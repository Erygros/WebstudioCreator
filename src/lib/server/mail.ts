import 'server-only';
import nodemailer from 'nodemailer';
import { randomUUID } from 'node:crypto';
import { submissionAvailable } from './settings';
export type MailAttachment = { filename: string; content: Buffer; contentType: string };
export function newReference() {
  return `WC-${new Date().getUTCFullYear()}-${randomUUID().replaceAll('-', '').slice(0, 16).toUpperCase()}`;
}
export function createTransport() {
  if (!submissionAvailable()) throw new Error('Delivery unavailable');
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465',
    requireTLS: process.env.SMTP_PORT !== '465',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    connectionTimeout: 10000,
    socketTimeout: 15000,
    tls: { minVersion: 'TLSv1.2' },
  });
}
export async function deliver({
  reference,
  email,
  subject,
  internal,
  customer,
  attachments = [],
}: {
  reference: string;
  email: string;
  subject: string;
  internal: string;
  customer: string;
  attachments?: MailAttachment[];
}) {
  const transporter = createTransport();
  const base = {
    from: process.env.CREATOR_MAIL_FROM!,
    headers: { 'X-Project': 'webstudio-creator', 'X-Creator-Reference': reference },
  };
  // Operator delivery is the durable record before any success is returned.
  const sent = await transporter.sendMail({
    ...base,
    to: process.env.CREATOR_MAIL_TO!,
    replyTo: email,
    subject: `[Webstudio Creator] ${reference} · ${subject}`,
    text: internal,
    attachments,
  });
  if (!sent.accepted?.length) throw new Error('Operator delivery rejected');
  let customerEmailSent = false;
  try {
    const receipt = await transporter.sendMail({
      ...base,
      to: email,
      replyTo: process.env.CREATOR_MAIL_TO!,
      subject: `Webstudio Creator · ${reference}`,
      text: customer,
    });
    customerEmailSent = !!receipt.accepted?.length;
  } catch {
    console.warn('Creator customer confirmation delivery failed', reference);
  }
  return { customerEmailSent };
}
