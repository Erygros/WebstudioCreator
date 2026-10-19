import Link from 'next/link';
import { FolderLock, Info, LockKeyhole, ShieldCheck } from 'lucide-react';
import type { Locale } from '@/lib/i18n';
import { company } from '@/lib/company';
import { PageIntro, ButtonLink, path } from './content';
import { Receipt } from './receipt';
export function AccessPage({ locale, mode }: { locale: Locale; mode: string }) {
  const de = locale === 'de';
  const heading =
    mode === 'register'
      ? de
        ? 'Dein Creator-Zugang.'
        : 'Your creator account.'
      : mode === 'reset-password'
        ? de
          ? 'Passwort zurücksetzen.'
          : 'Reset your password.'
        : de
          ? 'Willkommen zurück.'
          : 'Welcome back.';
  return (
    <section className="access-panel">
      <div className="access-icon">
        <LockKeyhole size={23} />
      </div>
      <span className="eyebrow" style={{ marginBottom: 15 }}>
        CREATOR SPACE / {de ? 'BALD VERFÜGBAR' : 'COMING LATER'}
      </span>
      <h1>{heading}</h1>
      <p>
        {de
          ? 'Der Kundenbereich wird nach der sicheren Datenbank- und Authentifizierungsanbindung freigeschaltet. Aktuell kannst du ohne Konto Leistungen konfigurieren und bei eingerichtetem Versand direkt anfragen.'
          : 'The client area will be enabled after the secure database and authentication integration. For now, configure services without an account and send requests when delivery is configured.'}
      </p>
      <div className="notice">
        <ShieldCheck size={18} />
        <p>
          {de
            ? 'Login, Registrierung und Passwortänderungen sind noch nicht aktiv. Es werden hier keine Zugangsdaten erfasst.'
            : 'Login, registration and password changes are not active yet. No credentials are collected here.'}
        </p>
      </div>
      <ButtonLink href={path(locale, 'order')}>
        {de ? 'Projekt ohne Konto konfigurieren' : 'Configure a project without an account'}
      </ButtonLink>
      <div className="access-links">
        <Link href={path(locale, 'login')}>Login</Link>
        <Link href={path(locale, 'register')}>{de ? 'Registrierung' : 'Registration'}</Link>
        <Link href={path(locale, 'reset-password')}>
          {de ? 'Passwort vergessen' : 'Forgot password'}
        </Link>
      </div>
    </section>
  );
}
export const clientSections = [
  ['dashboard', 'Dashboard', 'Dashboard'],
  ['orders', 'Meine Aufträge', 'My projects'],
  ['order-details', 'Auftragdetails', 'Project details'],
  ['messages', 'Nachrichten', 'Messages'],
  ['files', 'Dateien', 'Files'],
  ['revisions', 'Korrekturen', 'Revisions'],
  ['approvals', 'Freigaben', 'Approvals'],
  ['invoices', 'Rechnungen', 'Invoices'],
  ['payments', 'Zahlungen', 'Payments'],
  ['subscriptions', 'Abonnements', 'Subscriptions'],
  ['support', 'Support', 'Support'],
  ['profile', 'Profileinstellungen', 'Profile settings'],
];
export const adminSections = [
  ['dashboard', 'Dashboard', 'Dashboard'],
  ['crm', 'Leads / CRM', 'Leads / CRM'],
  ['customers', 'Kunden', 'Clients'],
  ['orders', 'Aufträge', 'Projects'],
  ['kanban', 'Kanban', 'Kanban'],
  ['services', 'Dienstleistungen', 'Services'],
  ['pricing', 'Preise', 'Pricing'],
  ['packages', 'Pakete', 'Packages'],
  ['payments', 'Zahlungen', 'Payments'],
  ['invoices', 'Rechnungen', 'Invoices'],
  ['subscriptions', 'Abonnements', 'Subscriptions'],
  ['messages', 'Nachrichten', 'Messages'],
  ['support', 'Support-Tickets', 'Support tickets'],
  ['email-templates', 'E-Mail-Vorlagen', 'Email templates'],
  ['email-logs', 'E-Mail-Protokolle', 'Email logs'],
  ['statistics', 'Statistiken', 'Statistics'],
  ['settings', 'Einstellungen', 'Settings'],
];
export function PortalPage({
  locale,
  admin = false,
  section = 'dashboard',
}: {
  locale: Locale;
  admin?: boolean;
  section?: string;
}) {
  const de = locale === 'de';
  const sections = admin ? adminSections : clientSections;
  const title =
    sections.find((s) => s[0] === section)?.[de ? 1 : 2] ||
    (de ? 'Geschützter Bereich' : 'Protected area');
  return (
    <div className="portal-layout">
      <nav
        className="portal-sidebar"
        aria-label={admin ? 'Administration' : de ? 'Kundenportal' : 'Client portal'}
      >
        <span className="eyebrow">{admin ? 'CREATOR ADMIN' : 'CREATOR SPACE'}</span>
        {sections.map(([slug, d, e]) => (
          <Link
            className={slug === section ? 'active' : ''}
            href={path(locale, `${admin ? 'admin' : 'portal'}/${slug}`)}
            key={slug}
            aria-current={slug === section ? 'page' : undefined}
          >
            {de ? d : e}
            <LockKeyhole size={12} />
          </Link>
        ))}
      </nav>
      <div className="portal-content">
        <span className="eyebrow">
          <span className="status-dot" />
          {de ? 'ZUGRIFF NOCH NICHT AKTIVIERT' : 'ACCESS NOT ENABLED'}
        </span>
        <h1>{title}</h1>
        <div className="notice">
          <ShieldCheck size={22} />
          <p>
            {de
              ? 'Dieser Bereich benötigt eine sichere Anmeldung, rollenbasierte Berechtigungen und eine persistente Datenbank. Die Integration ist vorbereitet, aber noch nicht verbunden. Es werden keine echten Daten oder Beispieldatensätze angezeigt.'
              : 'This area requires secure sign-in, role-based permissions and a persistent database. The integration is prepared but not connected. No real records or sample records are displayed.'}
          </p>
        </div>
        <div className="portal-empty">
          <FolderLock size={30} strokeWidth={1.3} />
          <h2>
            {de
              ? 'Deine Daten brauchen einen sicheren Platz.'
              : 'Your data deserves a secure home.'}
          </h2>
          <p>
            {de
              ? 'Nach der Supabase-Anbindung werden diese Funktionen mit verifizierter Sitzung und passenden Zugriffsrechten aktiviert.'
              : 'After the Supabase integration, these features will be enabled with verified sessions and appropriate access permissions.'}
          </p>
        </div>
        <ButtonLink href={path(locale, 'contact')} secondary>
          {de ? 'Persönlich Kontakt aufnehmen' : 'Contact us personally'}
        </ButtonLink>
      </div>
    </div>
  );
}
export function ConfirmationPage({ locale }: { locale: Locale }) {
  return <Receipt locale={locale} />;
}
export function LegalPage({
  locale,
  page,
}: {
  locale: Locale;
  page: 'imprint' | 'privacy' | 'terms';
}) {
  const de = locale === 'de';
  return (
    <>
      <PageIntro
        eyebrow="WEBSTUDIO CREATOR"
        title={
          page === 'imprint'
            ? de
              ? 'Impressum.'
              : 'Legal notice.'
            : page === 'privacy'
              ? de
                ? 'Datenschutz.'
                : 'Privacy.'
              : de
                ? 'Bevor wir loslegen.'
                : 'Before we begin.'
        }
      />
      <div className="legal-layout">
        <nav className="legal-nav">
          <Link href={path(locale, 'imprint')}>{de ? 'Impressum' : 'Legal notice'}</Link>
          <Link href={path(locale, 'privacy')}>{de ? 'Datenschutz' : 'Privacy'}</Link>
          <Link href={path(locale, 'terms')}>
            {de ? 'Bestellhinweise' : 'Ordering information'}
          </Link>
        </nav>
        <article className="legal-content">
          {page === 'imprint' ? (
            <>
              <section>
                <h2>{de ? 'Anbieter' : 'Service provider'}</h2>
                <address>
                  {company.owner}
                  <br />
                  {company.name}
                  <br />
                  {company.street}
                  <br />
                  {company.city}
                  <br />
                  {company.country}
                </address>
                <p style={{ marginTop: 15 }}>
                  {de
                    ? 'Einzelunternehmen. Inhaber: Enrico Gross. Webstudio Creator ist ein Geschäftsbereich von Webstudio Expert.'
                    : 'Sole proprietorship owned by Enrico Gross. Webstudio Creator is a division of Webstudio Expert.'}
                </p>
              </section>
              <section>
                <h2>{de ? 'Kontakt' : 'Contact'}</h2>
                <p>
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                  <br />
                  <a href={`tel:${company.phoneHref}`}>{company.phone}</a>
                </p>
                <p style={{ marginTop: 12 }}>
                  {de
                    ? 'Bitte gib bei Kontaktaufnahme „Webstudio Creator“ an. Die Verarbeitung von Creator-Anfragen erfolgt getrennt von anderen Geschäftsbereichen.'
                    : 'Please mention “Webstudio Creator” when contacting us. Creator enquiries are processed separately from other divisions.'}
                </p>
              </section>
              <section>
                <h2>{de ? 'Umsatzsteuer' : 'VAT'}</h2>
                <p>
                  {de
                    ? 'Es wird die Kleinunternehmerregelung gemäß § 19 UStG angewendet. Für die hier entsprechend angebotenen Leistungen wird keine Umsatzsteuer berechnet oder gesondert ausgewiesen.'
                    : 'The small business exemption under § 19 of the German VAT Act applies. No VAT is charged or separately shown for the services offered here.'}
                </p>
              </section>
              <section>
                <h2>{de ? 'Quelle der Unternehmensangaben' : 'Source of company information'}</h2>
                <p>
                  {de
                    ? 'Die Unternehmens- und Steuerangaben wurden am 19.10.2026 mit dem offiziellen Impressum von Webstudio Expert abgeglichen.'
                    : 'Company and tax information was checked against the official Webstudio Expert legal notice on 19 October 2026.'}
                  <br />
                  <a href={company.source} target="_blank" rel="noreferrer">
                    {de
                      ? 'Offizielles Impressum von Webstudio Expert'
                      : 'Official Webstudio Expert legal notice'}{' '}
                    ↗
                  </a>
                </p>
              </section>
            </>
          ) : page === 'privacy' ? (
            <>
              <section>
                <h2>{de ? 'Verantwortlicher' : 'Controller'}</h2>
                <p>
                  {company.owner}, {company.name}, {company.street}, {company.city},{' '}
                  {company.country}.<br />
                  {de ? 'Kontakt für Datenschutzanliegen:' : 'Contact for privacy requests:'}{' '}
                  <a href={`mailto:${company.email}`}>{company.email}</a>.
                </p>
              </section>
              <section>
                <h2>{de ? 'Anfragen und Projektbriefings' : 'Enquiries and project briefs'}</h2>
                <p>
                  {de
                    ? 'Wenn du das Kontakt- oder Projektformular nutzt, verarbeiten wir die von dir eingegebenen Kontakt-, Plattform- und Projektinformationen sowie freiwillig hochgeladene Dateien zur Beantwortung deiner Anfrage und zur Vorbereitung einer möglichen Zusammenarbeit (Art. 6 Abs. 1 lit. b DSGVO). Du kannst uns stattdessen telefonisch kontaktieren.'
                    : 'When you use the contact or project form, we process your contact, platform and project information and any voluntarily uploaded files to respond to your enquiry and prepare a possible collaboration (Article 6(1)(b) GDPR). You can contact us by phone instead.'}
                </p>
                <p style={{ marginTop: 12 }}>
                  {de
                    ? 'Der Formularversand wird erst nach Konfiguration einer separaten Creator-Absenderadresse und eines Übermittlungsdienstes aktiviert. Die Angaben werden dann per E-Mail an das Creator-Projektpostfach übermittelt. Es werden keine Kundendaten aus Webstudio Expert übernommen.'
                    : 'Form delivery is enabled only after a separate creator sender and delivery service have been configured. Your details are then sent by email to the creator project inbox. No client data is imported from Webstudio Expert.'}
                </p>
              </section>
              <section>
                <h2>
                  {de
                    ? 'Technischer Betrieb und lokale Speicherung'
                    : 'Technical operation and local storage'}
                </h2>
                <p>
                  {de
                    ? 'Die App bindet keine Analyse- oder Werbedienste ein. Schriften und Grafiken werden lokal bereitgestellt. Dein gewähltes Farbschema wird im lokalen Speicher deines Browsers gespeichert. Die Produktauswahl bleibt im Sitzungsspeicher erhalten. Ein nach Übermittlung angezeigter Beleg enthält die WC-Referenz und Preisübersicht im Sitzungsspeicher. Du kannst diese Daten über die Browser-Einstellungen entfernen. Briefingtexte und Dateien werden nicht automatisch im Browser gespeichert.'
                    : 'The app integrates no analytics or advertising services. Fonts and graphics are served locally. Your chosen colour theme is saved in browser local storage. Product selection is retained in session storage. After submission, a receipt containing the WC reference and price summary is held in session storage. You can remove these through your browser settings. Brief text and files are not automatically saved in browser storage.'}
                </p>
                <p style={{ marginTop: 12 }}>
                  {de
                    ? 'Beim Aufruf können durch den tatsächlich eingesetzten Hostinganbieter technisch notwendige Verbindungsdaten verarbeitet werden. Die konkrete Hosting- und SMTP-Konfiguration, Auftragsverarbeitung, Speicherfristen und gegebenenfalls Übermittlungen außerhalb der EU müssen vor dem öffentlichen Produktivbetrieb ergänzt und geprüft werden.'
                    : 'The actual hosting provider may process connection data necessary to serve this site. The specific hosting and SMTP configuration, data processing agreements, retention periods and any international transfers must be completed and reviewed before public production use.'}
                </p>
              </section>
              <section>
                <h2>{de ? 'Speicherdauer und deine Rechte' : 'Retention and your rights'}</h2>
                <p>
                  {de
                    ? 'Anfragedaten werden für die Bearbeitung und gegebenenfalls Vertragsabwicklung verwendet. Gesetzliche Aufbewahrungspflichten bleiben unberührt. Du kannst Auskunft, Berichtigung, Löschung, Einschränkung und gegebenenfalls Datenübertragbarkeit verlangen. Soweit eine Verarbeitung auf Einwilligung beruht, kannst du sie für die Zukunft widerrufen. Außerdem kannst du dich bei einer Datenschutzaufsichtsbehörde beschweren.'
                    : 'Enquiry data is used to handle the enquiry and any resulting contract. Statutory retention requirements remain applicable. You can request access, correction, deletion, restriction and, where applicable, data portability. Where processing relies on consent, you can withdraw it for the future. You may also complain to a data protection supervisory authority.'}
                </p>
              </section>
              <div className="notice">
                <Info size={18} />
                <p>
                  {de
                    ? 'Diese Hinweise beschreiben den aktuellen, nicht angebundenen Stand. Vor Aktivierung des öffentlichen Versands sind die tatsächlich eingesetzten Dienstleister und Speicherfristen zu ergänzen.'
                    : 'This notice describes the current disconnected state. Before public delivery is activated, the actual providers and retention periods must be added.'}
                </p>
              </div>
            </>
          ) : (
            <>
              <section>
                <h2>
                  {de
                    ? 'Aktuell: unverbindliche Projektanfragen'
                    : 'Currently: non-binding project requests'}
                </h2>
                <p>
                  {de
                    ? 'Die Konfiguratoren erstellen eine transparente Preisübersicht. Das Absenden eines Formulars ist aktuell eine unverbindliche Anfrage, keine zahlungspflichtige Bestellung. Eine Zusammenarbeit kommt erst nach gesonderter persönlicher Vereinbarung zustande. Eine automatische Eingangsbestätigung ist keine Auftragsannahme.'
                    : 'The configurators create a transparent price summary. Submitting a form is currently a non-binding enquiry, not a paid order. Work begins only after a separate personal agreement. An automatic receipt confirmation does not constitute acceptance of an order.'}
                </p>
              </section>
              <section>
                <h2>{de ? 'Umfang, Preise und Termine' : 'Scope, prices and timing'}</h2>
                <p>
                  {de
                    ? 'Der jeweilige Leistungsumfang und die enthaltenen Korrekturrunden sind auf der Produktseite beschrieben. Optionen werden getrennt berechnet. Lieferzeiten sind Richtwerte ab vollständigem Materialeingang und abgestimmtem Briefing. Zusätzlicher Aufwand wird vor Umsetzung vereinbart. Alle Preise in EUR; keine Umsatzsteuer gemäß § 19 UStG.'
                    : 'Scope and included revision rounds are described on each product page. Options are calculated separately. Delivery times are estimates starting after receipt of all materials and an agreed brief. Additional work is agreed before implementation. All prices in EUR; no VAT under § 19 of the German VAT Act.'}
                </p>
              </section>
              <section>
                <h2>
                  {de
                    ? 'Zahlungen und wiederkehrende Leistungen'
                    : 'Payments and recurring services'}
                </h2>
                <p>
                  {de
                    ? 'Geplant sind bei einmaligen Leistungen 50 % Anzahlung und der Rest nach Freigabe. Monatliche Kontingente und optionale Betreuung sind separat ausgewiesen. Das Clip-Paket ist vor dem nächsten Leistungsmonat kündbar; nicht genutzte Kontingente werden nicht übertragen. Individuelle Vertragsbedingungen werden vor Beginn persönlich vereinbart. Keine Anfrage gilt automatisch als bezahlt.'
                    : 'One-time work is planned with a 50% deposit and the balance after approval. Monthly allowances and optional maintenance are shown separately. Clip packages may be cancelled before the next service month; unused allowances do not roll over. Individual contract terms are agreed before work starts. No enquiry is automatically marked as paid.'}
                </p>
              </section>
              <section>
                <h2>{de ? 'Zukünftiges Creator-Dashboard' : 'Future creator dashboard'}</h2>
                <p>
                  {de
                    ? 'Das Dashboard befindet sich in Entwicklung. Funktionen und Preise sind geplant. Vormerkungen sind unverbindlich und lösen weder Kosten noch ein Abonnement aus.'
                    : 'The dashboard is in development. Features and prices are planned. Expressions of interest are non-binding and incur no costs or subscriptions.'}
                </p>
              </section>
              <section>
                <h2>{de ? 'Verbindliche Online-Bestellungen' : 'Binding online orders'}</h2>
                <p>
                  {de
                    ? 'Ein zahlungspflichtiger Online-Abschluss wird erst nach Freigabe der konkreten Vertrags-, Verbraucher- und Widerrufsinformationen sowie verifizierter Zahlungsdaten aktiviert. Bis dahin werden ausschließlich Anfragen übermittelt.'
                    : 'Paid online checkout will only be enabled after approval of the applicable contract, consumer and withdrawal information and verified payment details. Until then, only enquiries are transmitted.'}
                </p>
              </section>
            </>
          )}
        </article>
      </div>
    </>
  );
}
