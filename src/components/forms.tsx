'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Info,
  LoaderCircle,
  Minus,
  Plus,
  Send,
  Upload,
} from 'lucide-react';
import { services, packages, getProduct, PRICE_VERSION } from '@/lib/catalog';
import { calculate, type Configuration } from '@/lib/pricing';
import { bookingSchema, contactSchema, platforms, MAX_FILES, MAX_TOTAL_BYTES } from '@/lib/booking';
import { money, tax, path, type Locale } from '@/lib/i18n';
import { company } from '@/lib/company';
const servicePrompt: Record<string, [string, string]> = {
  'creator-websites': [
    'Welche Seiten, Inhalte und Stilrichtung stellst du dir vor?',
    'Which pages, content and visual style do you have in mind?',
  ],
  'stream-overlays': [
    'Welche Screens, Alert-Texte, Farben und OBS-Version nutzt du?',
    'Which screens, alert copy, colours and OBS version do you use?',
  ],
  'discord-service': [
    'Wie groß ist deine Community und welche Rollen braucht sie?',
    'How large is your community and which roles do you need?',
  ],
  'creator-dashboard': [
    'Welche Plattformen und geplanten Funktionen interessieren dich?',
    'Which platforms and planned features interest you?',
  ],
  'channel-optimization': [
    'Welche Hauptplattform (Twitch, Kick, YouTube) und welche Ziele hast du?',
    'Which main platform (Twitch, Kick, YouTube) and goals do you have?',
  ],
  'short-form-content': [
    'Wo liegt dein Ausgangsmaterial? Welche Cliplänge und welcher Stil passen?',
    'Where is your source footage? Which clip length and style suit you?',
  ],
  'sponsoring-mediakits': [
    'Welche echten Reichweiten und Kooperationsformate möchtest du zeigen?',
    'Which real audience figures and partnership formats would you like to show?',
  ],
  'custom-stream-bots': [
    'Welche Hauptplattform, Chatbefehle und Integrationen brauchst du?',
    'Which main platform, chat commands and integrations do you need?',
  ],
};
export function QuoteSummary({ locale, config }: { locale: Locale; config: Configuration }) {
  const de = locale === 'de';
  const quote = calculate(config);
  const p = getProduct(config.productId)!;
  return (
    <aside className="quote-summary" aria-label={de ? 'Preisübersicht' : 'Price summary'}>
      <span className="eyebrow">{de ? 'DEINE AUSWAHL' : 'YOUR SELECTION'}</span>
      <h3>{p.name[locale]}</h3>
      {quote.lines.map((l) => (
        <div className="quote-line" key={l.id}>
          <span>
            {l.quantity > 1 && `${l.quantity} × `}
            {l.name[locale]}
          </span>
          <strong>
            {money(l.amount, locale)}
            {l.period === 'monthly' && (de ? '/Mo.' : '/mo.')}
          </strong>
        </div>
      ))}
      <div className="quote-totals" aria-live="polite">
        <div className="quote-line">
          <span>{de ? 'Einmalig gesamt' : 'One-time total'}</span>
          <strong>{money(quote.once, locale)}</strong>
        </div>
        {quote.monthly > 0 && (
          <div className="quote-line">
            <span>{de ? 'Monatlich' : 'Monthly'}</span>
            <strong>{money(quote.monthly, locale)}</strong>
          </div>
        )}
        {!p.comingSoon && (
          <>
            <div className="quote-line">
              <span>{de ? 'Geplante Anzahlung (50 %)' : 'Planned deposit (50%)'}</span>
              <strong>{money(quote.deposit, locale)}</strong>
            </div>
            <div className="quote-line">
              <span>{de ? 'Restbetrag einmalig' : 'One-time balance'}</span>
              <strong>{money(quote.remainder, locale)}</strong>
            </div>
          </>
        )}
      </div>
      <p className="tax-note">{tax[locale]}</p>
      <p className="summary-status">
        {p.comingSoon
          ? de
            ? 'Nur Vormerkung. Kein Abo, keine Kosten.'
            : 'Interest only. No subscription or charge.'
          : de
            ? 'Unverbindliche Anfrage. Keine automatische Zahlung.'
            : 'Non-binding request. No automatic payment.'}
      </p>
    </aside>
  );
}
export function OrderWizard({
  locale,
  initial,
  available,
}: {
  locale: Locale;
  initial?: string;
  available: boolean;
}) {
  const de = locale === 'de';
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [productId, setProductId] = useState(getProduct(initial || '')?.id || services[0].id);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [restored, setRestored] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [brief, setBrief] = useState<Record<string, string>>({});
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const [error, setError] = useState('');
  const form = useRef<HTMLFormElement>(null);
  const section = useRef<HTMLDivElement>(null);
  const product = getProduct(productId)!;
  const config: Configuration = { productId, quantities, priceVersion: PRICE_VERSION };
  const quote = calculate(config);
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('wc-config') || 'null');
      if (saved && (!initial || saved.productId === initial)) {
        calculate(saved);
        setProductId(saved.productId);
        setQuantities(saved.quantities);
      }
    } catch {}
    setRestored(true);
  }, [initial]);
  useEffect(() => {
    if (!restored) return;
    try {
      sessionStorage.setItem(
        'wc-config',
        JSON.stringify({ productId, quantities, priceVersion: PRICE_VERSION }),
      );
    } catch {}
  }, [productId, quantities, restored]);
  function go(next: number) {
    setError('');
    setStep(next);
    requestAnimationFrame(() =>
      section.current?.scrollIntoView({
        block: 'start',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      }),
    );
  }
  function choose(id: string) {
    setProductId(id);
    setQuantities({});
    setBrief((b) => ({ ...b, serviceBrief: '' }));
  }
  function qty(id: string, n: number) {
    setQuantities((q) => ({ ...q, [id]: n }));
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (step < 2) {
      go(step + 1);
      return;
    }
    if (step === 2) {
      const data = new FormData(e.currentTarget);
      setBrief(
        Object.fromEntries([...data.entries()].filter(([, v]) => typeof v === 'string')) as Record<
          string,
          string
        >,
      );
      go(3);
      return;
    }
    if (busyRef.current) return;
    const payload = {
      locale,
      configuration: config,
      ...brief,
      platforms: selectedPlatforms,
      payment: 'discuss',
      consent,
      website: brief.website || '',
    };
    const parsed = bookingSchema.safeParse(payload);
    if (!parsed.success) {
      setError(
        de
          ? 'Bitte prüfe dein Briefing, vollständige https://-Links und die Datenschutzhinweise. Alle Pflichtfelder müssen ausgefüllt sein.'
          : 'Please check your brief, full https:// links and privacy acknowledgement. All required fields must be complete.',
      );
      return;
    }
    busyRef.current = true;
    setBusy(true);
    try {
      const body = new FormData();
      body.set('booking', JSON.stringify(parsed.data));
      files.forEach((file) => body.append('files', file));
      const response = await fetch('/api/booking', { method: 'POST', body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      try {
        sessionStorage.setItem(
          'wc-receipt',
          JSON.stringify({
            reference: result.reference,
            customerEmailSent: result.customerEmailSent,
            created: new Date().toISOString(),
            status: result.status,
            productName: product.name[locale],
            quote,
            locale,
          }),
        );
        sessionStorage.removeItem('wc-config');
      } catch {}
      router.push(path(locale, 'confirmation'));
    } catch {
      setError(
        de
          ? 'Die Übermittlung konnte nicht bestätigt werden. Bitte versuche es nicht wiederholt. Falls du bereits eine E-Mail erhalten hast, nutze deren WC-Referenz; andernfalls kontaktiere uns telefonisch. Es wurde keine Zahlung ausgelöst.'
          : 'Delivery could not be confirmed. Please avoid repeated submissions. If you received an email, use its WC reference; otherwise contact us by phone. No payment was initiated.',
      );
      busyRef.current = false;
      setBusy(false);
    }
  }
  function selectFiles(list: FileList | null) {
    const selected = Array.from(list || []);
    if (
      selected.length > MAX_FILES ||
      selected.reduce((s, f) => s + f.size, 0) > MAX_TOTAL_BYTES ||
      selected.some((f) => !['image/png', 'image/jpeg', 'application/pdf'].includes(f.type))
    ) {
      setError(
        de
          ? 'Maximal 3 PDF-, PNG- oder JPG-Dateien, insgesamt bis zu 3 MB.'
          : 'Up to 3 PDF, PNG or JPG files, 3 MB combined.',
      );
      return;
    }
    setError('');
    setFiles(selected);
  }
  const labels = de
    ? ['Leistung', 'Konfiguration', 'Briefing', 'Übersicht']
    : ['Service', 'Configuration', 'Brief', 'Review'];
  return (
    <div className="wizard" ref={section} style={{ scrollMarginTop: 110 }}>
      <ol className="wizard-steps">
        {labels.map((label, i) => (
          <li
            className={step === i ? 'active' : ''}
            key={label}
            aria-current={step === i ? 'step' : undefined}
          >
            <span>{i < step ? <Check size={11} /> : i + 1}</span>
            {label}
          </li>
        ))}
      </ol>
      <div className="wizard-layout">
        <form ref={form} className="wizard-main" onSubmit={submit}>
          {step === 0 && (
            <>
              <h2>{de ? 'Womit starten wir?' : 'Where shall we start?'}</h2>
              <div className="product-choices">
                {services.map((p) => (
                  <button
                    type="button"
                    className={`product-choice ${p.id === productId ? 'selected' : ''}`}
                    key={p.id}
                    onClick={() => choose(p.id)}
                    aria-pressed={p.id === productId}
                  >
                    <strong>{p.name[locale]}</strong>
                    <span>
                      {de ? 'ab' : 'from'} {money(p.price, locale)}
                      {p.period === 'monthly' && (de ? ' / Monat' : ' / month')}
                      {p.comingSoon && (de ? ' · in Entwicklung' : ' · in development')}
                    </span>
                    {p.id === productId && <Check size={15} />}
                  </button>
                ))}
              </div>
              <p className="choice-heading">
                {de ? 'Oder ein stimmiges Gesamtpaket' : 'Or a complete package'}
              </p>
              <div className="product-choices">
                {packages.map((p) => (
                  <button
                    type="button"
                    className={`product-choice ${p.id === productId ? 'selected' : ''}`}
                    key={p.id}
                    onClick={() => choose(p.id)}
                    aria-pressed={p.id === productId}
                  >
                    <strong>{p.name[locale]}</strong>
                    <span>
                      {money(p.price, locale)} {de ? 'einmalig' : 'one-time'}
                    </span>
                    {p.id === productId && <Check size={15} />}
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h2>{de ? 'So individuell wie dein Content.' : 'As individual as your content.'}</h2>
              <p>
                {de ? 'Dein Grundumfang:' : 'Your base scope:'}{' '}
                {product.scope.map((s) => s[locale]).join(' · ')}
              </p>
              {product.comingSoon && (
                <div className="notice">
                  <Info size={19} />
                  <p>
                    {de
                      ? 'Geplante Funktionen und Preise. Deine Auswahl ist nur eine unverbindliche Vormerkung. Kein Abo wird gestartet.'
                      : 'Planned features and prices. Your selection is only a non-binding expression of interest. No subscription starts.'}
                  </p>
                </div>
              )}
              {product.options.map((o) => (
                <div className="config-option" key={o.id}>
                  <label htmlFor={o.id}>
                    {o.max === 1 && (
                      <input
                        id={o.id}
                        type="checkbox"
                        checked={!!quantities[o.id]}
                        onChange={(e) => qty(o.id, e.target.checked ? 1 : 0)}
                      />
                    )}
                    <span>
                      {o.name[locale]}
                      <small>
                        + {money(o.price, locale)}
                        {o.period === 'monthly' && (de ? ' / Monat' : ' / month')}
                        {o.max > 1 && (de ? ' je Einheit' : ' per unit')}
                      </small>
                    </span>
                  </label>
                  {o.max > 1 && (
                    <div className="quantity">
                      <button
                        type="button"
                        disabled={!quantities[o.id]}
                        aria-label={`${o.name[locale]} −1`}
                        onClick={() => qty(o.id, (quantities[o.id] || 0) - 1)}
                      >
                        <Minus size={12} />
                      </button>
                      <span id={o.id} aria-live="polite">
                        {quantities[o.id] || 0}
                      </span>
                      <button
                        type="button"
                        disabled={(quantities[o.id] || 0) >= o.max}
                        aria-label={`${o.name[locale]} +1`}
                        onClick={() => qty(o.id, (quantities[o.id] || 0) + 1)}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
          {step === 2 && (
            <>
              <h2>{de ? 'Erzähl uns von deinem Projekt.' : 'Tell us about your project.'}</h2>
              <div className="form-grid">
                <Field
                  name="name"
                  label={de ? 'Dein Name *' : 'Your name *'}
                  value={brief.name}
                  autoComplete="name"
                  required
                  maxLength={120}
                />
                <Field
                  name="email"
                  label={de ? 'E-Mail-Adresse *' : 'Email address *'}
                  value={brief.email}
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                />
                <Field
                  name="phone"
                  label={de ? 'Telefon (optional)' : 'Phone (optional)'}
                  value={brief.phone}
                  type="tel"
                  autoComplete="tel"
                  maxLength={40}
                />
                <Field
                  name="creator"
                  label={de ? 'Creator-Name *' : 'Creator name *'}
                  value={brief.creator}
                  required
                  maxLength={120}
                />
                <fieldset className="field full" style={{ border: 0, padding: 0, margin: 0 }}>
                  <legend style={{ marginBottom: 10 }}>
                    {de ? 'Deine Plattformen *' : 'Your platforms *'}
                  </legend>
                  <div className="platform-choices">
                    {platforms.map((p) => (
                      <label key={p}>
                        <input
                          type="checkbox"
                          checked={selectedPlatforms.includes(p)}
                          onChange={(e) =>
                            setSelectedPlatforms((current) =>
                              e.target.checked ? [...current, p] : current.filter((x) => x !== p),
                            )
                          }
                        />
                        {p}
                      </label>
                    ))}
                  </div>
                  {!selectedPlatforms.length && (
                    <small>
                      {de ? 'Wähle mindestens eine Plattform.' : 'Choose at least one platform.'}
                    </small>
                  )}
                </fieldset>
                <Field
                  name="links"
                  label={
                    de
                      ? 'Profil-Links (vollständig mit https://)'
                      : 'Profile links (full https:// URLs)'
                  }
                  value={brief.links}
                  full
                  maxLength={2000}
                />
                <label className="field full">
                  {de ? 'Deine Projektbeschreibung *' : 'Your project description *'}
                  <textarea
                    name="description"
                    defaultValue={brief.description}
                    required
                    minLength={20}
                    maxLength={8000}
                    placeholder={
                      de
                        ? 'Was möchtest du erreichen? Mindestens 20 Zeichen.'
                        : 'What would you like to achieve? At least 20 characters.'
                    }
                  />
                </label>
                <label className="field full">
                  {servicePrompt[product.id]?.[de ? 0 : 1] ||
                    (de
                      ? 'Welche Paketbestandteile sind dir besonders wichtig?'
                      : 'Which parts of the package matter most to you?')}{' '}
                  *
                  <textarea
                    name="serviceBrief"
                    defaultValue={brief.serviceBrief}
                    required
                    minLength={5}
                    maxLength={3000}
                  />
                </label>
                <label className="field full">
                  {de
                    ? 'Wünsche, Farben, Inspiration (optional)'
                    : 'Preferences, colours, inspiration (optional)'}
                  <textarea name="wishes" defaultValue={brief.wishes} maxLength={3000} />
                </label>
                <Field
                  name="deadline"
                  label={
                    de
                      ? 'Wunschtermin (unbestätigt, optional)'
                      : 'Preferred date (unconfirmed, optional)'
                  }
                  value={brief.deadline}
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  full
                />
                <label className="field full">
                  <span>
                    <Upload size={13} style={{ display: 'inline', marginRight: 7 }} />
                    {de ? 'Projektdateien (optional)' : 'Project files (optional)'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    multiple
                    onChange={(e) => selectFiles(e.target.files)}
                  />
                  <small>
                    {de
                      ? 'Bis zu 3 Dateien, zusammen 3 MB. PDF, PNG, JPG. Keine Passwörter oder Zugangsdaten. Videos bitte als Freigabelink unter Profil-Links angeben. Dateien werden bei Übermittlung per E-Mail versandt.'
                      : 'Up to 3 files, 3 MB combined. PDF, PNG, JPG. No passwords or credentials. Share video links in the profile links field. Files are delivered by email on submission.'}
                  </small>
                  <ul className="file-list">
                    {files.map((f, i) => (
                      <li key={i}>
                        {f.name}
                        <button
                          type="button"
                          onClick={() => setFiles((current) => current.filter((_, j) => i !== j))}
                        >
                          {de ? 'Entfernen' : 'Remove'}
                        </button>
                      </li>
                    ))}
                  </ul>
                </label>
                <label className="hp-field" aria-hidden="true">
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                </label>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2>
                {de ? 'Alles bereit für deinen nächsten Schritt.' : 'Ready for your next step.'}
              </h2>
              <div className="review-block">
                <h3>{product.name[locale]}</h3>
                <ul>
                  {product.scope.map((s, i) => (
                    <li key={i}>{s[locale]}</li>
                  ))}
                </ul>
                <p>
                  {product.revisions} {de ? 'Korrekturrunden' : 'revision rounds'} ·{' '}
                  {product.delivery[locale]}
                </p>
              </div>
              <div className="review-block">
                <h3>{de ? 'Dein Briefing' : 'Your brief'}</h3>
                <p>
                  {brief.name} / {brief.creator}
                  <br />
                  {brief.email}
                  {brief.phone && (
                    <>
                      <br />
                      {brief.phone}
                    </>
                  )}
                  <br />
                  {selectedPlatforms.join(' · ')}
                  {brief.links && (
                    <>
                      <br />
                      {brief.links}
                    </>
                  )}
                </p>
                <p style={{ marginTop: 14 }}>
                  {brief.description}
                  <br />
                  {brief.serviceBrief}
                  <br />
                  {brief.wishes}
                </p>
                {brief.deadline && (
                  <p>
                    {de ? 'Wunschtermin, unbestätigt: ' : 'Preferred date, unconfirmed: '}
                    {brief.deadline}
                  </p>
                )}
                {files.length > 0 && (
                  <p>
                    {de ? 'Anhänge: ' : 'Attachments: '}
                    {files.map((f) => f.name).join(', ')}
                  </p>
                )}
              </div>
              <div className="review-block">
                <h3>{de ? 'Zahlung & nächste Schritte' : 'Payment & next steps'}</h3>
                <p>
                  {product.comingSoon
                    ? de
                      ? 'Dies ist ausschließlich eine Vormerkung für ein zukünftiges Produkt. Es wird kein Abonnement oder Zahlungsauftrag angelegt.'
                      : 'This is only an expression of interest in a future product. No subscription or payment is created.'
                    : de
                      ? 'Du sendest eine unverbindliche Projektanfrage. Umfang, Termin und Zahlungsart werden persönlich vereinbart. Banküberweisung, Rechnung oder Kryptowährung sind nur nach Einrichtung und Bestätigung möglich. Es werden keine Zahlungsdaten abgefragt und keine Zahlungen ausgelöst.'
                      : 'You are sending a non-binding project request. Scope, timing and payment method are agreed personally. Bank transfer, invoice or cryptocurrency require configuration and confirmation. No payment details are collected and no payment is initiated.'}
                </p>
              </div>
              <label className="consent">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  {de ? 'Ich habe die ' : 'I have read the '}
                  <Link href={path(locale, 'privacy')} target="_blank">
                    {de ? 'Datenschutzhinweise' : 'privacy information'}
                  </Link>
                  {de ? ' und ' : ' and '}
                  <Link href={path(locale, 'terms')} target="_blank">
                    {de ? 'Bestellhinweise' : 'ordering information'}
                  </Link>
                  {de
                    ? ' gelesen. Meine Angaben und Dateien werden zur Bearbeitung dieser Anfrage verwendet.'
                    : ' and understand my details and files will be used to process this request.'}
                </span>
              </label>
              {!available && <Unavailable locale={locale} />}
            </>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="wizard-controls">
            {step > 0 ? (
              <button
                className="button secondary"
                type="button"
                disabled={busy}
                onClick={() => go(step - 1)}
              >
                <ArrowLeft size={15} />
                {de ? 'Zurück' : 'Back'}
              </button>
            ) : (
              <span />
            )}
            <button
              className="button"
              type="submit"
              disabled={
                busy ||
                (step === 2 && !selectedPlatforms.length) ||
                (step === 3 && (!available || !consent))
              }
            >
              {busy ? <LoaderCircle className="spin" size={16} /> : null}
              {step === 3
                ? product.comingSoon
                  ? de
                    ? 'Unverbindlich vormerken'
                    : 'Join the interest list'
                  : de
                    ? 'Projektanfrage senden'
                    : 'Send project request'
                : de
                  ? 'Weiter'
                  : 'Continue'}
              {!busy && <ArrowRight size={15} />}
            </button>
          </div>
        </form>
        <QuoteSummary locale={locale} config={config} />
      </div>
    </div>
  );
}
function Field({
  name,
  label,
  value,
  full = false,
  ...props
}: {
  name: string;
  label: string;
  value?: string;
  full?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`field ${full ? 'full' : ''}`}>
      {label}
      <input name={name} defaultValue={value || ''} {...props} />
    </label>
  );
}
function Unavailable({ locale }: { locale: Locale }) {
  return (
    <div className="notice">
      <Info size={18} />
      <p>
        {locale === 'de'
          ? 'Der direkte Anfrageversand ist noch nicht eingerichtet. Deine Konfiguration bleibt hier verfügbar. Besprich dein Projekt telefonisch mit uns: '
          : 'Direct request delivery has not been configured yet. Your configuration remains available here. Call us to discuss your project: '}
        <a href={`tel:${company.phoneHref}`}>{company.phone}</a>.{' '}
        {locale === 'de' ? 'Es wurde nichts übermittelt.' : 'Nothing has been submitted.'}
      </p>
    </div>
  );
}
export function ContactForm({ locale, available }: { locale: Locale; available: boolean }) {
  const de = locale === 'de';
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<{ reference: string; customerEmailSent: boolean } | null>(
    null,
  );
  const busyRef = useRef(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busyRef.current) return;
    setError('');
    const form = new FormData(e.currentTarget);
    const parsed = contactSchema.safeParse({
      ...Object.fromEntries(form),
      locale,
      consent: form.get('consent') === 'on',
    });
    if (!parsed.success) {
      setError(
        de
          ? 'Bitte fülle alle Pflichtfelder korrekt aus.'
          : 'Please complete all required fields correctly.',
      );
      return;
    }
    busyRef.current = true;
    setBusy(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setReceipt(result);
    } catch {
      setError(
        de
          ? 'Die Übermittlung konnte nicht bestätigt werden. Falls du schon eine Bestätigung erhalten hast, nutze deren Referenz. Andernfalls erreichst du uns telefonisch.'
          : 'Delivery could not be confirmed. If you received a confirmation, use its reference. Otherwise contact us by phone.',
      );
    } finally {
      setBusy(false);
      busyRef.current = false;
    }
  }
  return (
    <div className="contact-layout">
      <div>
        {receipt ? (
          <div className="form-success" role="status">
            <CheckCircle2 size={26} />
            <strong style={{ marginTop: 15 }}>
              {de ? 'Deine Nachricht wurde übermittelt.' : 'Your message has been delivered.'}
            </strong>
            <p>{receipt.reference}</p>
            <p style={{ marginTop: 10 }}>
              {receipt.customerEmailSent
                ? de
                  ? 'Eine Bestätigung wurde zusätzlich an deine E-Mail-Adresse gesendet.'
                  : 'A confirmation was also sent to your email address.'
                : de
                  ? 'Die Nachricht ist bei uns eingegangen. Die Bestätigung an deine E-Mail-Adresse konnte nicht versandt werden. Bitte notiere die Referenz.'
                  : 'We received your message, but the email confirmation could not be sent. Please save your reference.'}
            </p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="form-grid">
              <Field
                name="name"
                label={de ? 'Name *' : 'Name *'}
                autoComplete="name"
                required
                minLength={2}
                maxLength={120}
              />
              <Field
                name="email"
                label={de ? 'E-Mail-Adresse *' : 'Email address *'}
                type="email"
                autoComplete="email"
                required
                maxLength={254}
              />
              <Field
                name="subject"
                label={de ? 'Worum geht’s? *' : 'Subject *'}
                required
                minLength={2}
                maxLength={120}
                full
              />
              <label className="field full">
                {de ? 'Deine Nachricht *' : 'Your message *'}
                <textarea
                  name="message"
                  required
                  minLength={20}
                  maxLength={8000}
                  placeholder={de ? 'Mindestens 20 Zeichen.' : 'At least 20 characters.'}
                />
              </label>
              <label className="hp-field" aria-hidden="true">
                Website
                <input name="website" autoComplete="off" tabIndex={-1} defaultValue="" />
              </label>
            </div>
            <label className="consent">
              <input type="checkbox" name="consent" required />
              <span>
                {de ? 'Ich habe die ' : 'I have read the '}
                <Link href={path(locale, 'privacy')}>
                  {de ? 'Datenschutzhinweise' : 'privacy information'}
                </Link>
                {de
                  ? ' gelesen. Meine Angaben werden zur Bearbeitung meiner Nachricht verwendet.'
                  : ' and understand my details will be used to process my message.'}
              </span>
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            {!available && <Unavailable locale={locale} />}
            <button type="submit" className="button" disabled={!available || busy}>
              {de ? 'Nachricht senden' : 'Send message'}
              {busy ? <LoaderCircle size={16} /> : <Send size={15} />}
            </button>
          </form>
        )}
      </div>
      <aside className="contact-details">
        <span className="eyebrow" style={{ marginBottom: 18 }}>
          CREATOR TO CREATOR.
        </span>
        <h2>{de ? 'Direkt. Persönlich. Ohne Umwege.' : 'Direct. Personal. No detours.'}</h2>
        <p>
          {de
            ? 'Wir klären deine Fragen und finden gemeinsam den passenden Umfang. Bitte nenne bei Kontaktaufnahme „Webstudio Creator“, damit dein Anliegen im richtigen Projekt bleibt.'
            : 'We’ll answer your questions and find the right scope together. Mention “Webstudio Creator” when contacting us so your enquiry stays in the right project.'}
        </p>
        <a href={`tel:${company.phoneHref}`}>{company.phone} ↗</a>
        <address>
          {company.name}
          <br />
          {company.owner}
          <br />
          {company.street}
          <br />
          {company.city}
        </address>
        <div className="notice">
          <Info size={17} />
          <p>
            {de
              ? 'Eine eigene Creator-Absenderadresse wird vor Aktivierung des Direktversands eingerichtet und verifiziert.'
              : 'A dedicated creator sender address will be set up and verified before direct delivery is enabled.'}
          </p>
        </div>
      </aside>
    </div>
  );
}
