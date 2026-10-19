import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Bot,
  Check,
  CheckCheck,
  ChevronDown,
  Code2,
  FileText,
  Globe2,
  Hash,
  Layers,
  LayoutDashboard,
  MessageCircle,
  Monitor,
  Play,
  Plus,
  Radio,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Video,
  WandSparkles,
  Zap,
} from 'lucide-react';
import { services, packages, type Product } from '@/lib/catalog';
import { money, tax, type Locale, type Text } from '@/lib/i18n';
import { ProductPreview } from './preview';
import { Configurator } from './configurator';
export const serviceIcons = [
  Monitor,
  Radio,
  Hash,
  LayoutDashboard,
  SlidersHorizontal,
  Video,
  FileText,
  Bot,
];
export const path = (locale: Locale, slug = '') => `/${locale}${slug ? '/' + slug : ''}`;
export function ButtonLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link href={href} className={`button ${secondary ? 'secondary' : ''}`}>
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">
          <span className="tiny-square" />
          {eyebrow}
        </span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
export function ServiceGrid({ locale, all = true }: { locale: Locale; all?: boolean }) {
  const de = locale === 'de';
  return (
    <div className="service-grid">
      {services.slice(0, all ? 8 : 4).map((p, i) => {
        const Icon = serviceIcons[i];
        return (
          <Link
            className={`service-card service-card-${i}`}
            href={path(locale, `services/${p.id}`)}
            key={p.id}
          >
            <div className="service-card-top">
              <span className="service-icon">
                <Icon strokeWidth={1.6} size={22} />
              </span>
              {p.comingSoon ? (
                <span className="small-badge">{de ? 'In Entwicklung' : 'In development'}</span>
              ) : (
                <ArrowUpRight size={19} />
              )}
            </div>
            <span className="service-category">{p.category[locale]}</span>
            <h3>{p.name[locale]}</h3>
            <p>{p.short[locale]}</p>
            {i < 2 && (
              <div className={`service-vignette vignette-${i}`} aria-hidden="true">
                {i === 0 ? (
                  <>
                    <span>YOUR SPACE ↗</span>
                    <b>
                      CREATOR
                      <br />
                      BY DESIGN.
                    </b>
                    <i />
                    <i />
                    <i />
                  </>
                ) : (
                  <>
                    <span>ON AIR / YOUR IDENTITY</span>
                    <div className="vignette-wave">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                    <b>
                      MAKE IT
                      <br />
                      YOUR SHOW.
                    </b>
                  </>
                )}
              </div>
            )}
            <div className="service-card-bottom">
              <span>
                {de ? 'ab' : 'from'} <strong>{money(p.price, locale)}</strong>
                {p.period === 'monthly' && <small> / {de ? 'Monat' : 'month'}</small>}
              </span>
              <span className="card-more">
                {de ? 'Entdecken' : 'Explore'} <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
export function PackageTable({ locale }: { locale: Locale }) {
  const de = locale === 'de';
  return (
    <div className="package-grid">
      {packages.map((p, i) => (
        <article className={`package ${i === 1 ? 'featured' : ''}`} key={p.id}>
          {i === 1 && (
            <span className="package-recommend">
              <Sparkles size={12} />
              {de ? 'DER NÄCHSTE SCHRITT' : 'THE NEXT STEP'}
            </span>
          )}
          <span className="eyebrow">{p.category[locale]}</span>
          <h3>{p.name[locale]}</h3>
          <p>{p.short[locale]}</p>
          <div className="package-price">
            {money(p.price, locale)}
            <small>{de ? 'einmalig' : 'one-time'}</small>
          </div>
          <ButtonLink href={path(locale, `order?product=${p.id}`)} secondary={i !== 1}>
            {de ? 'Paket konfigurieren' : 'Configure package'}
          </ButtonLink>
          <ul>
            {p.scope.map((s, j) => (
              <li key={j}>
                <Check size={15} />
                {s[locale]}
              </li>
            ))}
          </ul>
          <div className="package-meta">
            <span>
              {p.revisions} {de ? 'Korrekturrunden' : 'revision rounds'}
            </span>
            <span>{p.delivery[locale]}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
export const faqs: { q: Text; a: Text }[] = [
  {
    q: {
      de: 'Ich stehe noch ganz am Anfang. Passt das für mich?',
      en: 'I’m just starting out. Is this for me?',
    },
    a: {
      de: 'Ja. Du kannst mit einer einzelnen Leistung starten und später erweitern. Die Einstiegspreise beziehen sich auf klar definierte Umfänge – ohne Mindestreichweite und ohne Voraussetzung einer bestehenden Community.',
      en: 'Yes. Start with a single service and expand later. Entry prices cover clearly defined scopes, with no minimum audience or existing community required.',
    },
  },
  {
    q: { de: 'Wie läuft die Zusammenarbeit ab?', en: 'How does the collaboration work?' },
    a: {
      de: 'Du konfigurierst deine Leistung und sendest dein Briefing. Wir prüfen Umfang und Termin, klären offene Fragen und bestätigen die Umsetzung persönlich. Danach folgen Gestaltung, die vereinbarten Korrekturen und die Übergabe.',
      en: 'Configure your service and send your brief. We review scope and timing, clarify questions and personally confirm the project. Design, agreed revisions and handover follow.',
    },
  },
  {
    q: { de: 'Gibt es versteckte Kosten?', en: 'Are there any hidden costs?' },
    a: {
      de: 'Der Konfigurator zeigt einmalige und monatliche Leistungen getrennt. Hosting, Domains und Drittanbieter-Lizenzen sind nur enthalten, wenn sie ausdrücklich genannt werden. Änderungen außerhalb des vereinbarten Umfangs werden vorab angeboten.',
      en: 'The configurator shows one-time and monthly services separately. Hosting, domains and third-party licences are only included when explicitly stated. Changes outside the agreed scope are quoted in advance.',
    },
  },
  {
    q: { de: 'Wann ist mein Projekt fertig?', en: 'When will my project be ready?' },
    a: {
      de: 'Die jeweilige Leistungsseite nennt einen Richtwert. Die Zeit beginnt nach abgestimmtem Briefing und vollständigem Materialeingang. Deinen verbindlichen Termin vereinbaren wir bei der persönlichen Projektbestätigung.',
      en: 'Each service page gives an estimated timeframe, starting once the brief and all materials are complete. We agree your confirmed deadline during personal project confirmation.',
    },
  },
  {
    q: { de: 'Wie funktionieren Zahlung und Anzahlung?', en: 'How do payments and deposits work?' },
    a: {
      de: 'Für einmalige Leistungen planen wir 50 % Anzahlung und 50 % nach Freigabe. Monatliche Leistungen werden separat ausgewiesen. Zahlungsinformationen erhältst du erst nach persönlicher Bestätigung; eine Anfrage gilt niemals automatisch als bezahlt.',
      en: 'One-time services are planned with a 50% deposit and 50% after approval. Monthly services are listed separately. Payment information follows personal confirmation; a request is never automatically marked as paid.',
    },
  },
  {
    q: {
      de: 'Ist das Creator-Dashboard schon verfügbar?',
      en: 'Is the creator dashboard available yet?',
    },
    a: {
      de: 'Das Creator-Dashboard befindet sich in Entwicklung. Alle gezeigten Statistiken sind Beispieldaten der Konzeptvorschau. Eine Vormerkung ist unverbindlich; es wird kein Abonnement gestartet und nichts berechnet.',
      en: 'The creator dashboard is in development. All statistics shown are sample data in the concept preview. Joining the interest list is non-binding, starts no subscription and incurs no charge.',
    },
  },
  {
    q: { de: 'Wem gehören die fertigen Dateien?', en: 'Who owns the finished files?' },
    a: {
      de: 'Die beschriebenen finalen Dateien und vereinbarten Nutzungsrechte werden nach vollständiger Zahlung übergeben. Bearbeitbare Quelldateien sind enthalten, wenn sie im Leistungsumfang oder als Option genannt sind. Rechte an Drittanbieter-Material bleiben gesondert geregelt.',
      en: 'The specified final files and agreed usage rights are handed over after full payment. Editable source files are included when listed in the scope or as an option. Third-party materials remain subject to their own licences.',
    },
  },
  {
    q: {
      de: 'Kann ich meine bestehende Website oder Community behalten?',
      en: 'Can I keep my existing website or community?',
    },
    a: {
      de: 'Ja. Beschreibe deinen aktuellen Stand im Briefing. Anpassungen an vorhandenen Systemen prüfen wir vorab. Übermittle keine Passwörter; benötigte Zugriffe stimmen wir über sichere Einladungen oder OAuth ab.',
      en: 'Yes. Describe your current setup in the brief. We review changes to existing systems in advance. Do not send passwords; any access is arranged through secure invitations or OAuth.',
    },
  },
];
export function FaqList({ locale, limit = 8 }: { locale: Locale; limit?: number }) {
  return (
    <div className="faq-list">
      {faqs.slice(0, limit).map((f, i) => (
        <details key={i}>
          <summary>
            {f.q[locale]}
            <Plus size={18} />
          </summary>
          <p>{f.a[locale]}</p>
        </details>
      ))}
    </div>
  );
}
export function Process({ locale }: { locale: Locale }) {
  const de = locale === 'de';
  return (
    <div className="process-grid">
      {[
        [
          SlidersHorizontal,
          de ? 'Du wählst.' : 'You choose.',
          de
            ? 'Leistung und Optionen auswählen. Den Preis kennst du sofort.'
            : 'Choose your service and options. See your price immediately.',
        ],
        [
          MessageCircle,
          de ? 'Wir hören zu.' : 'We listen.',
          de
            ? 'Briefing abstimmen, Fragen klären und gemeinsam die Richtung festlegen.'
            : 'Align on the brief, clarify questions and set the direction together.',
        ],
        [
          WandSparkles,
          de ? 'Wir gestalten.' : 'We create.',
          de
            ? 'Dein Projekt entsteht. Du gibst Feedback, wir kümmern uns um die Details.'
            : 'Your project takes shape. You give feedback; we take care of the details.',
        ],
        [
          CheckCheck,
          de ? 'Du startest.' : 'You launch.',
          de
            ? 'Freigabe, saubere Übergabe und alles bereit für deinen nächsten Schritt.'
            : 'Approval, a clean handover and everything ready for your next step.',
        ],
      ].map(([Icon, title, copy], i) => {
        const C = Icon as typeof Monitor;
        return (
          <div key={i}>
            <div className="process-top">
              <span>0{i + 1}</span>
              <C size={21} />
            </div>
            <h3>{title as string}</h3>
            <p>{copy as string}</p>
          </div>
        );
      })}
    </div>
  );
}
export function ContactCta({ locale }: { locale: Locale }) {
  const de = locale === 'de';
  return (
    <section className="contact-cta">
      <div>
        <span className="eyebrow">
          <span className="status-dot" />
          {de ? 'DEIN NÄCHSTES KAPITEL' : 'YOUR NEXT CHAPTER'}
        </span>
        <h2>
          {de ? 'Du hast die Vision.' : 'You bring the vision.'}
          <br />
          <span>{de ? 'Wir das Handwerk.' : 'We bring the craft.'}</span>
        </h2>
      </div>
      <div>
        <p>
          {de
            ? 'Erzähl uns, was du vorhast. Gemeinsam machen wir deinen nächsten Schritt konkret.'
            : 'Tell us what you have in mind. Together, we’ll make your next step happen.'}
        </p>
        <ButtonLink href={path(locale, 'contact')}>
          {de ? 'Lass uns loslegen' : 'Let’s get started'}
        </ButtonLink>
      </div>
      <span className="cta-asterisk" aria-hidden="true">
        ✳
      </span>
    </section>
  );
}
export function Home({ locale }: { locale: Locale }) {
  const de = locale === 'de';
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="tiny-square" />{' '}
            {de ? 'DEIN CONTENT. UNSER HANDWERK.' : 'YOUR CONTENT. OUR CRAFT.'}
            <span className="hero-edition">EST. 2026</span>
          </div>
          <h1>
            {de ? (
              <>
                Dein Content.
                <br />
                Deine Community.
                <br />
                <span>Unser Handwerk.</span>
              </>
            ) : (
              <>
                Your content.
                <br />
                Your community.
                <br />
                <span>Our craft.</span>
              </>
            )}
          </h1>
          <div className="hero-bottom">
            <p>
              {de
                ? 'Professionelle Websites, Stream-Designs, Discord-Server und individuelle Creator-Tools. Alles aus einer Hand – für deinen nächsten Schritt als Creator.'
                : 'Professional websites, stream designs, Discord servers and custom creator tools. Everything in one place, for your next step as a creator.'}
            </p>
            <div className="hero-buttons">
              <ButtonLink href={path(locale, 'services')}>
                {de ? 'Leistungen entdecken' : 'Explore services'}
              </ButtonLink>
              <Link className="text-link" href={path(locale, 'pricing')}>
                {de ? 'Preise ansehen' : 'View pricing'}
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
        <ProductPreview locale={locale} />
        <div className="hero-foot">
          <span>
            {de ? 'DU ERSCHAFFST. WIR GEBEN DIR DEN RAHMEN.' : 'YOU CREATE. WE SET THE STAGE.'}
          </span>
          <span>
            <span className="hero-foot-line" />
            {de ? 'Scrollen & entdecken' : 'Scroll to explore'} <ArrowDownIcon />
          </span>
        </div>
      </section>
      <div className="platform-bar">
        <span>{de ? 'DEIN ZUHAUSE. JEDE PLATTFORM.' : 'YOUR HOME. EVERY PLATFORM.'}</span>
        <div>
          <strong className="platform-twitch">twitch</strong>
          <strong className="platform-kick">KICK</strong>
          <strong className="platform-youtube">
            <Play size={19} fill="currentColor" />
            YouTube
          </strong>
          <strong className="platform-tiktok">
            <AudioLines size={22} />
            TikTok
          </strong>
          <strong className="platform-instagram">◎ Instagram</strong>
        </div>
      </div>
      <section className="section reveal services-section">
        <SectionTitle
          eyebrow={de ? 'WAS WIR FÜR DICH TUN' : 'WHAT WE DO FOR YOU'}
          title={
            de
              ? 'Du machst den Content. Wir den Rest.'
              : 'You make the content. We handle the rest.'
          }
          description={
            de
              ? 'Acht Leistungen. Ein Anspruch: Dein Auftritt soll sich nach dir anfühlen.'
              : 'Eight services. One goal: a presence that feels like you.'
          }
        >
          <Link className="text-link" href={path(locale, 'services')}>
            {de ? 'Alle Leistungen' : 'All services'}
            <ArrowUpRight size={16} />
          </Link>
        </SectionTitle>
        <ServiceGrid locale={locale} />
        <p className="tax-note">{tax[locale]}</p>
      </section>
      <section className="manifesto section">
        <span className="eyebrow">BUILT AROUND YOU.</span>
        <div>
          <h2>
            {de ? (
              <>
                Kein Einheitslook.
                <br />
                Kein Technikchaos.
                <br />
                <span>Einfach dein Ding.</span>
              </>
            ) : (
              <>
                No cookie-cutter look.
                <br />
                No technical chaos.
                <br />
                <span>Just your thing.</span>
              </>
            )}
          </h2>
          <div className="manifesto-bottom">
            <p>
              {de
                ? 'Für den ersten Stream. Für die wachsende Community. Für alle, die aus ihrer Leidenschaft mehr machen wollen. Wir verbinden Gestaltung und Technik – damit du dich auf deinen Content konzentrieren kannst.'
                : 'For your first stream. For your growing community. For everyone building something from their passion. We connect design and technology so you can focus on your content.'}
            </p>
            <div>
              {[
                [Layers, de ? 'Alles aus einer Hand' : 'Everything in one place'],
                [Sparkles, de ? 'Individuell statt austauschbar' : 'Individual by design'],
                [
                  ShieldCheck,
                  de ? 'Klare Preise. Klare Absprachen.' : 'Clear prices. Clear agreements.',
                ],
              ].map(([Icon, label], i) => {
                const C = Icon as typeof Layers;
                return (
                  <span key={i}>
                    <C size={17} />
                    {label as string}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="section reveal packages-section">
        <SectionTitle
          eyebrow={de ? 'ZUSAMMEN PASST’S BESSER' : 'BETTER TOGETHER'}
          title={de ? 'Ein Paket. Ein stimmiger Auftritt.' : 'One package. One cohesive identity.'}
          description={
            de
              ? 'Durchdacht kombiniert, klar im Umfang. Und erweiterbar, wenn du wächst.'
              : 'Thoughtfully combined, clearly scoped. And ready to grow with you.'
          }
        />
        <PackageTable locale={locale} />
        <p className="tax-note">
          {tax[locale]}{' '}
          {de
            ? 'Domain, Hosting und externe Lizenzen separat.'
            : 'Domain, hosting and external licences separate.'}
        </p>
      </section>
      <section className="section reveal">
        <SectionTitle
          eyebrow={de ? 'VOM GEDANKEN ZUM AUFTRITT' : 'FROM IDEA TO IDENTITY'}
          title={de ? 'Gute Zusammenarbeit ist einfach.' : 'Good collaboration feels simple.'}
        />
        <Process locale={locale} />
      </section>
      <section className="section reveal projects-teaser">
        <div>
          <span className="eyebrow">WORK IN PROGRESS</span>
          <h2>{de ? 'Gute Arbeit spricht für sich.' : 'Good work speaks for itself.'}</h2>
          <p>
            {de
              ? 'Unser Creator-Portfolio entsteht gerade. Bis die ersten freigegebenen Projekte hier einziehen, zeigen dir unsere interaktiven Designkonzepte, wie dein Auftritt aussehen könnte.'
              : 'Our creator portfolio is taking shape. Until the first approved projects arrive, explore our interactive design concepts to see what your presence could look like.'}
          </p>
          <Link className="text-link" href={path(locale, 'projects')}>
            {de ? 'Designkonzepte ansehen' : 'Explore design concepts'}
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="project-type-art" aria-hidden="true">
          <span>
            YOUR
            <br />
            <i>NEXT</i>
            <br />
            CHAPTER<span className="type-star">✳</span>
          </span>
          <small>GOOD CONTENT DESERVES GOOD DESIGN.</small>
        </div>
      </section>
      <section className="section reveal faq-section">
        <SectionTitle
          eyebrow={de ? 'GUT ZU WISSEN' : 'GOOD TO KNOW'}
          title={de ? 'Noch ein paar Fragen?' : 'A few more questions?'}
        />
        <FaqList locale={locale} limit={5} />
        <Link className="text-link" href={path(locale, 'faq')}>
          {de ? 'Alle Fragen & Antworten' : 'All questions & answers'}
          <ArrowUpRight size={16} />
        </Link>
      </section>
      <ContactCta locale={locale} />
    </>
  );
}
function ArrowDownIcon() {
  return (
    <svg width="13" height="17" viewBox="0 0 13 17" fill="none" aria-hidden="true">
      <path d="M6.5 1v14m-5-5 5 5 5-5" stroke="currentColor" />
    </svg>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="page-intro">
      <span className="eyebrow">
        <span className="tiny-square" />
        {eyebrow}
      </span>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
export function PricingPage({ locale }: { locale: Locale }) {
  const de = locale === 'de';
  return (
    <>
      <PageIntro
        eyebrow={de ? 'KLAR KALKULIERT' : 'CLEARLY PRICED'}
        title={de ? 'Gutes Handwerk. Klare Preise.' : 'Good craft. Clear prices.'}
        description={
          de
            ? 'Du entscheidest, was du brauchst. Jeder Einstiegspreis hat einen festen Umfang; Erweiterungen berechnest du direkt im Konfigurator.'
            : 'You decide what you need. Every starting price covers a defined scope; calculate additions directly in the configurator.'
        }
      />
      <section className="pricing-list">
        {services.map((p, i) => {
          const Icon = serviceIcons[i];
          return (
            <Link href={path(locale, `services/${p.id}`)} key={p.id}>
              <span className="pricing-icon">
                <Icon size={24} />
              </span>
              <div>
                <h2>{p.name[locale]}</h2>
                <p>{p.short[locale]}</p>
              </div>
              {p.comingSoon && <span className="small-badge">{de ? 'Geplant' : 'Planned'}</span>}
              <span className="pricing-amount">
                <small>{de ? 'ab' : 'from'}</small> {money(p.price, locale)}
                {p.period === 'monthly' && <small> / {de ? 'Monat' : 'month'}</small>}
              </span>
              <ArrowUpRight size={20} />
            </Link>
          );
        })}
      </section>
      <p className="tax-note">{tax[locale]}</p>
      <section className="section reveal">
        <SectionTitle
          eyebrow={de ? 'GEMEINSAM STARTEN' : 'START TOGETHER'}
          title={de ? 'Dein Auftritt im Paket.' : 'Your identity, as a package.'}
        />
        <PackageTable locale={locale} />
      </section>
      <section className="section reveal">
        <SectionTitle
          eyebrow={de ? 'SO PLANST DU' : 'HOW TO PLAN'}
          title={de ? 'Einmalig. Monatlich. Nachvollziehbar.' : 'One-time. Monthly. Transparent.'}
        />
        <div className="info-columns">
          <div>
            <h3>{de ? '50 % Anzahlung' : '50% deposit'}</h3>
            <p>
              {de
                ? 'Bei einmaligen Leistungen wird nach persönlicher Auftragsbestätigung eine Anzahlung von 50 % vereinbart. Der Rest folgt nach Freigabe.'
                : 'One-time projects are planned with a 50% deposit after personal confirmation. The balance follows approval.'}
            </p>
          </div>
          <div>
            <h3>{de ? 'Monatlich kündbar' : 'Cancel monthly'}</h3>
            <p>
              {de
                ? 'Wiederkehrende Leistungen sind separat ausgewiesen. Das Clip-Paket ist monatlich kündbar; Kündigung vor dem nächsten Leistungsmonat.'
                : 'Recurring services are shown separately. Clip packages can be cancelled before the next service month.'}
            </p>
          </div>
          <div>
            <h3>{de ? 'Keine automatische Zahlung' : 'No automatic payment'}</h3>
            <p>
              {de
                ? 'Das Absenden einer Anfrage löst keine Abbuchung aus. Zahlungsdetails werden mit der persönlichen Bestätigung mitgeteilt.'
                : 'Submitting a request does not charge you. Payment details are shared with your personal confirmation.'}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
export function ServicePage({ locale, product }: { locale: Locale; product: Product }) {
  const de = locale === 'de';
  return (
    <>
      <div className="service-intro">
        <div>
          <Link className="breadcrumb" href={path(locale, 'services')}>
            ← {de ? 'Alle Leistungen' : 'All services'}
          </Link>
          <span className="eyebrow">{product.category[locale]}</span>
          <h1>{product.name[locale]}</h1>
          <p>{product.description[locale]}</p>
          <div className="service-start-price">
            {de ? 'ab' : 'from'} <strong>{money(product.price, locale)}</strong>
            <span>
              {product.period === 'monthly'
                ? de
                  ? '/ Monat'
                  : '/ month'
                : de
                  ? 'einmalig'
                  : 'one-time'}
            </span>
          </div>
          <p className="tax-note">{tax[locale]}</p>
          <ButtonLink href={path(locale, `order?product=${product.id}`)}>
            {product.comingSoon
              ? de
                ? 'Unverbindlich vormerken'
                : 'Join the interest list'
              : de
                ? 'Konfigurieren & anfragen'
                : 'Configure & enquire'}
          </ButtonLink>
        </div>
        <div className="service-intro-note">
          <span className="eyebrow">
            {de ? 'DEIN PROJEKT AUF EINEN BLICK' : 'YOUR PROJECT AT A GLANCE'}
          </span>
          <dl>
            <div>
              <dt>{de ? 'Zeitrahmen' : 'Timeframe'}</dt>
              <dd>{product.delivery[locale]}</dd>
            </div>
            <div>
              <dt>{de ? 'Korrekturen' : 'Revisions'}</dt>
              <dd>
                {product.revisions} {de ? 'Runden inklusive' : 'rounds included'}
              </dd>
            </div>
            <div>
              <dt>{de ? 'Zusammenarbeit' : 'Collaboration'}</dt>
              <dd>{de ? 'Direkt. Persönlich. Remote.' : 'Direct. Personal. Remote.'}</dd>
            </div>
          </dl>
        </div>
      </div>
      <ProductPreview locale={locale} initial={product.preview} />
      {product.comingSoon && (
        <div className="notice">
          <LayoutDashboard size={22} />
          <p>
            {de
              ? 'In Entwicklung. Diese Vorschau verwendet Beispieldaten. Keine Live-Anbindung, kein kostenpflichtiges Abonnement und noch kein zugesagter Starttermin.'
              : 'In development. This preview uses sample data. No live integration, no paid subscription and no confirmed launch date.'}
          </p>
        </div>
      )}
      <section className="section reveal scope-section">
        <SectionTitle
          eyebrow={de ? 'DAS IST DRIN' : 'WHAT’S INCLUDED'}
          title={
            de ? 'Ein klarer Umfang. Raum für deine Ideen.' : 'A clear scope. Room for your ideas.'
          }
        />
        <div className="scope-grid">
          <div>
            {product.scope.map((s, i) => (
              <div className="scope-item" key={i}>
                <Check size={19} />
                <p>{s[locale]}</p>
              </div>
            ))}
          </div>
          <div className="options-overview">
            <h3>{de ? 'Individuell erweiterbar' : 'Individually expandable'}</h3>
            {product.options.map((o) => (
              <div key={o.id}>
                <span>{o.name[locale]}</span>
                <strong>
                  + {money(o.price, locale)}
                  {o.period === 'monthly' && (de ? '/Mo.' : '/mo.')}
                </strong>
              </div>
            ))}
            <Link className="text-link" href={path(locale, `order?product=${product.id}`)}>
              {de ? 'Deinen Preis berechnen' : 'Calculate your price'}
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section reveal">
        <SectionTitle
          eyebrow={de ? 'DEIN PREIS, LIVE BERECHNET' : 'YOUR PRICE, CALCULATED LIVE'}
          title={de ? 'Stell dir dein Projekt zusammen.' : 'Build your own project.'}
        />
        <Configurator locale={locale} productId={product.id} />
      </section>
      <section className="section reveal">
        <SectionTitle
          eyebrow={de ? 'DEIN WEG ZUM ERGEBNIS' : 'YOUR PATH TO THE RESULT'}
          title={de ? 'Von deiner Idee bis zur Übergabe.' : 'From your idea to handover.'}
        />
        <Process locale={locale} />
      </section>
      <section className="section reveal">
        <SectionTitle
          eyebrow="FAQ"
          title={
            de
              ? `Fragen zu ${product.name.de}.`
              : `Questions about ${product.name.en.toLowerCase()}.`
          }
        />
        <div className="faq-list">
          <details>
            <summary>
              {de
                ? 'Was ist im Einstiegspreis enthalten?'
                : 'What does the starting price include?'}
              <Plus size={18} />
            </summary>
            <p>
              {product.scope.map((s) => s[locale]).join('. ')}. {product.revisions}{' '}
              {de ? 'Korrekturrunden sind enthalten.' : 'revision rounds are included.'}
            </p>
          </details>
          <details>
            <summary>
              {de
                ? 'Welche Materialien braucht ihr von mir?'
                : 'What materials do you need from me?'}
              <Plus size={18} />
            </summary>
            <p>
              {de
                ? 'Deinen Creator-Namen, Plattformen, Profil-Links, gewünschte Stilrichtung und vorhandene Markenmaterialien.'
                : 'Your creator name, platforms, profile links, preferred style and existing brand materials.'}{' '}
              {product.id === 'short-form-content'
                ? de
                  ? 'Zusätzlich benötigen wir dein Ausgangsmaterial und Hinweise auf relevante Stream-Momente.'
                  : 'We also need your source footage and notes on relevant stream moments.'
                : product.id === 'sponsoring-mediakits'
                  ? de
                    ? 'Für das Mediakit benötigen wir deine verifizierbaren Reichweiten und Kooperationsmöglichkeiten.'
                    : 'For the media kit, we need your verifiable audience numbers and partnership opportunities.'
                  : de
                    ? 'Zugriffe stimmen wir persönlich und sicher ab.'
                    : 'We arrange access personally and securely.'}
            </p>
          </details>
          <details>
            <summary>
              {de ? 'Wann beginnt die Lieferzeit?' : 'When does the delivery period begin?'}
              <Plus size={18} />
            </summary>
            <p>
              {product.delivery[locale]}.{' '}
              {de
                ? 'Der Richtwert beginnt nach vollständigem Materialeingang und abgestimmtem Briefing. Den verbindlichen Termin bestätigen wir persönlich.'
                : 'This estimate starts after all materials and an agreed brief are received. We personally confirm your deadline.'}
            </p>
          </details>
        </div>
      </section>
      <ContactCta locale={locale} />
    </>
  );
}
