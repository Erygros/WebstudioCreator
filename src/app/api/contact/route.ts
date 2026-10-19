import { contactSchema } from '@/lib/booking';
import { deliver, newReference } from '@/lib/server/mail';
import { requestAllowed } from '@/lib/server/request';
import { submissionAvailable } from '@/lib/server/settings';
import { readLimitedBody } from '@/lib/http';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!requestAllowed(request))
    return Response.json({ error: 'origin_or_rate_limit' }, { status: 429 });
  if (!submissionAvailable())
    return Response.json({ error: 'delivery_not_configured' }, { status: 503 });
  let raw: string;
  try {
    raw = new TextDecoder().decode(await readLimitedBody(request, 15000));
  } catch {
    return Response.json({ error: 'payload_too_large' }, { status: 413 });
  }
  let data;
  try {
    data = contactSchema.parse(JSON.parse(raw));
  } catch {
    return Response.json({ error: 'invalid_contact' }, { status: 400 });
  }
  const reference = newReference();
  const detail = `Webstudio Creator · ${reference}\n\n${data.name}\n${data.email}\n\n${data.subject}\n\n${data.message}\n\nStatus: contact_request · no order or payment`;
  try {
    const result = await deliver({
      reference,
      email: data.email,
      subject: data.subject,
      internal: detail,
      customer:
        (data.locale === 'de'
          ? 'Deine Nachricht ist bei Webstudio Creator eingegangen. Wir melden uns persönlich.'
          : 'Your message has been delivered to Webstudio Creator. We will reply personally.') +
        '\n\n' +
        detail,
    });
    return Response.json({ reference, ...result }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    console.error('Creator contact delivery failed', reference);
    return Response.json({ error: 'delivery_failed' }, { status: 502 });
  }
}
