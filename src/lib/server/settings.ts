// Import only in server components and handlers. Never expose delivery credentials.
import 'server-only';
export function submissionAvailable() {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD &&
    process.env.CREATOR_MAIL_FROM &&
    process.env.CREATOR_MAIL_TO &&
    process.env.CREATOR_SENDER_VERIFIED === 'true'
  );
}
export function paymentSettings() {
  return {
    bank:
      process.env.BANK_VERIFIED === 'true' &&
      !!process.env.BANK_RECIPIENT &&
      !!process.env.BANK_IBAN,
    invoice: process.env.INVOICE_ENABLED === 'true',
    crypto:
      process.env.CRYPTO_VERIFIED === 'true' &&
      !!process.env.CRYPTO_CURRENCY &&
      !!process.env.CRYPTO_NETWORK &&
      !!process.env.CRYPTO_ADDRESS,
  };
}
