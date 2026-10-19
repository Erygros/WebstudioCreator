import { bookingSchema, MAX_FILES, MAX_TOTAL_BYTES } from '@/lib/booking';
import { calculate } from '@/lib/pricing';
import { getProduct } from '@/lib/catalog';
import { money, tax } from '@/lib/i18n';
import { deliver, newReference, type MailAttachment } from '@/lib/server/mail';
import { requestAllowed } from '@/lib/server/request';
import { paymentSettings, submissionAvailable } from '@/lib/server/settings';
import { readLimitedBody, PayloadTooLargeError } from '@/lib/http';
export const runtime = 'nodejs';
export const maxDuration = 60;
export async function POST(request: Request) {
  if (!requestAllowed(request))
    return Response.json({ error: 'origin_or_rate_limit' }, { status: 429 });
  if (!submissionAvailable())
    return Response.json({ error: 'delivery_not_configured' }, { status: 503 });
  let data: FormData;
  try {
    const body = await readLimitedBody(request, MAX_TOTAL_BYTES + 50000);
    data = await new Response(body as BodyInit, {
      headers: { 'Content-Type': request.headers.get('content-type') || '' },
    }).formData();
  } catch (error) {
    return Response.json(
      { error: error instanceof PayloadTooLargeError ? 'payload_too_large' : 'invalid_request' },
      { status: error instanceof PayloadTooLargeError ? 413 : 400 },
    );
  }
  let booking;
  try {
    booking = bookingSchema.parse(JSON.parse(String(data.get('booking'))));
  } catch {
    return Response.json({ error: 'invalid_briefing' }, { status: 400 });
  }
  let quote;
  try {
    quote = calculate(booking.configuration);
  } catch {
    return Response.json({ error: 'invalid_configuration' }, { status: 400 });
  }
  const settings = paymentSettings();
  if (booking.payment !== 'discuss' && !settings[booking.payment])
    return Response.json({ error: 'payment_unavailable' }, { status: 400 });
  const files = data.getAll('files');
  if (files.length > MAX_FILES) return Response.json({ error: 'too_many_files' }, { status: 400 });
  const attachments: MailAttachment[] = [];
  let total = 0;
  for (const file of files) {
    if (!(file instanceof File)) return Response.json({ error: 'invalid_file' }, { status: 400 });
    total += file.size;
    if (total > MAX_TOTAL_BYTES || !file.size)
      return Response.json({ error: 'file_size' }, { status: 400 });
    const bytes = Buffer.from(await file.arrayBuffer());
    const pdf =
      bytes.subarray(0, 5).toString() === '%PDF-' &&
      file.type === 'application/pdf' &&
      /\.pdf$/i.test(file.name);
    const png =
      bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) &&
      file.type === 'image/png' &&
      /\.png$/i.test(file.name);
    const jpg =
      bytes[0] === 255 &&
      bytes[1] === 216 &&
      bytes[2] === 255 &&
      file.type === 'image/jpeg' &&
      /\.jpe?g$/i.test(file.name);
    if (!pdf && !png && !jpg) return Response.json({ error: 'file_type' }, { status: 400 });
    attachments.push({
      filename: file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100),
      content: bytes,
      contentType: file.type,
    });
  }
  const reference = newReference();
  const locale = booking.locale;
  const de = locale === 'de';
  const product = getProduct(booking.configuration.productId)!;
  const detail = [
    `Webstudio Creator · ${reference}`,
    `${de ? 'Produkt' : 'Product'}: ${product.name[locale]}`,
    `Status: ${product.comingSoon ? 'interest_only' : 'request_received'} · payment: unpaid`,
    `Price version: ${quote.version}`,
    ...quote.lines.map(
      (l) => `${l.quantity} × ${l.name[locale]}: ${money(l.amount, locale)} (${l.period})`,
    ),
    `${de ? 'Einmalig' : 'One-time'}: ${money(quote.once, locale)}`,
    `${de ? 'Monatlich' : 'Monthly'}: ${money(quote.monthly, locale)}`,
    `${de ? 'Geplante Anzahlung' : 'Planned deposit'}: ${money(quote.deposit, locale)}`,
    `${de ? 'Rest einmalig' : 'One-time balance'}: ${money(quote.remainder, locale)}`,
    tax[locale],
    `Name: ${booking.name}`,
    `Email: ${booking.email}`,
    `Phone: ${booking.phone}`,
    `Creator: ${booking.creator}`,
    `Platforms: ${booking.platforms.join(', ')}`,
    `Links: ${booking.links}`,
    `Brief: ${booking.description}`,
    `Service details: ${booking.serviceBrief}`,
    `Wishes: ${booking.wishes}`,
    `Desired date (unconfirmed): ${booking.deadline || '—'}`,
    `Payment preference: ${booking.payment}`,
    `Attachments: ${attachments.map((f) => f.filename).join(', ') || '—'}`,
    de
      ? 'Unverbindliche Anfrage. Keine Bestellung, Rechnung, Zahlung oder Abo-Aktivierung. Umfang und Termin werden persönlich bestätigt.'
      : 'Non-binding request. No order, invoice, payment or subscription activation. Scope and timing require personal confirmation.',
  ].join('\n\n');
  try {
    const result = await deliver({
      reference,
      email: booking.email,
      subject: product.name[locale],
      internal: detail,
      customer:
        (de
          ? 'Deine Projektanfrage wurde an Webstudio Creator übermittelt. Bitte bewahre diese Nachricht auf. Wir melden uns persönlich.'
          : 'Your project request has been delivered to Webstudio Creator. Please keep this message. We will contact you personally.') +
        '\n\n' +
        detail,
      attachments,
    });
    return Response.json(
      {
        reference,
        ...result,
        status: product.comingSoon ? 'interest_only' : 'request_received',
        paid: false,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    console.error('Creator operator delivery failed', reference);
    return Response.json({ error: 'delivery_failed' }, { status: 502 });
  }
}
