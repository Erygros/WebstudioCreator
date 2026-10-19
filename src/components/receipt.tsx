'use client';
import { useEffect, useState } from 'react';
import { CheckCircle2, Info, Printer } from 'lucide-react';
import { money, type Locale } from '@/lib/i18n';
import { ButtonLink, path } from './content';
type ReceiptData = {
  reference: string;
  customerEmailSent: boolean;
  created: string;
  status: string;
  productName: string;
  quote: { once: number; monthly: number; deposit: number; remainder: number };
  locale: Locale;
};
export function Receipt({ locale }: { locale: Locale }) {
  const de = locale === 'de';
  const [receipt, setReceipt] = useState<ReceiptData | null | undefined>(undefined);
  useEffect(() => {
    try {
      const value = JSON.parse(sessionStorage.getItem('wc-receipt') || 'null');
      setReceipt(
        value &&
          typeof value.reference === 'string' &&
          /^WC-\d{4}-[A-F0-9]{16}$/.test(value.reference) &&
          typeof value.productName === 'string' &&
          value.quote &&
          Number.isSafeInteger(value.quote.once) &&
          Number.isSafeInteger(value.quote.monthly)
          ? value
          : null,
      );
    } catch {
      setReceipt(null);
    }
  }, []);
  if (receipt === undefined)
    return (
      <div className="confirmation">
        <p role="status">{de ? 'Beleg wird geladen …' : 'Loading receipt …'}</p>
      </div>
    );
  if (!receipt)
    return (
      <section className="confirmation">
        <Info size={30} />
        <h1>{de ? 'Noch keine Übermittlung bestätigt.' : 'No submission confirmed yet.'}</h1>
        <p>
          {de
            ? 'Hier erscheint die Referenz nach einer erfolgreich per E-Mail übermittelten Anfrage. Falls du bereits eine Anfrage gesendet hast, nutze die Referenz aus deiner E-Mail-Bestätigung.'
            : 'Your reference appears here after a request is successfully delivered by email. If you already submitted a request, use the reference in your confirmation email.'}
        </p>
        <ButtonLink href={path(locale, 'order')}>
          {de ? 'Projekt konfigurieren' : 'Configure a project'}
        </ButtonLink>
      </section>
    );
  return (
    <section className="confirmation">
      <CheckCircle2 size={38} strokeWidth={1.4} />
      <span className="eyebrow" style={{ marginTop: 25 }}>
        {de ? 'ANFRAGE ÜBERMITTELT' : 'REQUEST DELIVERED'}
      </span>
      <h1>{de ? 'Dein nächstes Kapitel beginnt.' : 'Your next chapter begins.'}</h1>
      <p>
        {de
          ? 'Deine Anfrage wurde an das Creator-Projektpostfach übermittelt. Wir prüfen dein Briefing und melden uns persönlich.'
          : 'Your request was delivered to the creator project inbox. We’ll review your brief and contact you personally.'}
      </p>
      <div className="confirmation-code">
        <small>{de ? 'DEINE WC-REFERENZ' : 'YOUR WC REFERENCE'}</small>
        <strong>{receipt.reference}</strong>
      </div>
      <p>
        {receipt.productName}
        <br />
        {de ? 'Einmalig: ' : 'One-time: '}
        {money(receipt.quote.once, locale)} · {de ? 'Monatlich: ' : 'Monthly: '}
        {money(receipt.quote.monthly, locale)}
      </p>
      <div className="notice">
        <Info size={20} />
        <p>
          {receipt.customerEmailSent
            ? de
              ? 'Eine Bestätigung wurde an deine E-Mail-Adresse gesendet. Bitte bewahre sie auf.'
              : 'A confirmation was sent to your email address. Please keep it.'
            : de
              ? 'Die Betreiber-Nachricht wurde angenommen. Die Bestätigung an deine E-Mail-Adresse konnte nicht versandt werden. Bitte speichere diesen Beleg und nutze die WC-Referenz für Rückfragen.'
              : 'The operator message was accepted, but your email confirmation could not be sent. Please save this receipt and use the WC reference for enquiries.'}
          <br />
          {de
            ? 'Status: Anfrage eingegangen · Nicht bezahlt. Kein Vertrag oder Abonnement durch diese Bestätigung.'
            : 'Status: Request received · Unpaid. This receipt does not create a contract or subscription.'}
        </p>
      </div>
      <p className="tax-note">
        {de
          ? 'Dieser lokale Beleg ist keine Rechnung und keine authentifizierte Statusabfrage. Der übermittelte E-Mail-Beleg ist der maßgebliche Vorgangsnachweis.'
          : 'This local receipt is not an invoice or an authenticated status lookup. The delivered email record is the authoritative request record.'}
      </p>
      <div className="receipt-actions" style={{ marginTop: 25 }}>
        <button className="button secondary" onClick={() => window.print()}>
          {de ? 'Beleg drucken / speichern' : 'Print / save receipt'}
          <Printer size={16} />
        </button>
        <ButtonLink href={path(locale)}>{de ? 'Zur Startseite' : 'Back home'}</ButtonLink>
      </div>
    </section>
  );
}
