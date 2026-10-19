import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  Home,
  PageIntro,
  ServiceGrid,
  ServicePage,
  PricingPage,
  PackageTable,
  FaqList,
  ContactCta,
} from '@/components/content';
import { ProductPreview } from '@/components/preview';
import { OrderWizard, ContactForm } from '@/components/forms';
import { AccessPage, PortalPage, LegalPage, ConfirmationPage } from '@/components/pages';
import { getProduct } from '@/lib/catalog';
import { submissionAvailable } from '@/lib/server/settings';
import type { Locale } from '@/lib/i18n';
type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
const titles: Record<string, [string, string]> = {
  services: ['Leistungen', 'Services'],
  pricing: ['Preise', 'Pricing'],
  packages: ['Creator-Pakete', 'Creator packages'],
  projects: ['Projekte & Designkonzepte', 'Projects & design concepts'],
  faq: ['Fragen & Antworten', 'Questions & answers'],
  contact: ['Kontakt', 'Contact'],
  order: ['Projekt konfigurieren', 'Configure a project'],
  confirmation: ['Anfragebestätigung', 'Request confirmation'],
  login: ['Login', 'Login'],
  register: ['Registrierung', 'Registration'],
  'reset-password': ['Passwort zurücksetzen', 'Reset password'],
  imprint: ['Impressum', 'Legal notice'],
  privacy: ['Datenschutz', 'Privacy'],
  terms: ['Bestellhinweise', 'Ordering information'],
  portal: ['Kundenportal', 'Client portal'],
  admin: ['Administration', 'Administration'],
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug = [] } = await params;
  const p = slug[0] === 'services' && slug[1] ? getProduct(slug[1]) : undefined;
  const title = p?.name[locale as Locale] || titles[slug[0]]?.[locale === 'de' ? 0 : 1];
  return {
    title: title || undefined,
    description: p?.description[locale as Locale],
    alternates: { languages: { de: `/de/${slug.join('/')}`, en: `/en/${slug.join('/')}` } },
    robots: { index: false, follow: true },
  };
}
export default async function Page({ params, searchParams }: Props) {
  const { locale: raw, slug = [] } = await params;
  const locale = raw as Locale;
  const de = locale === 'de';
  const page = slug[0];
  const query = await searchParams;
  if (!page) return <Home locale={locale} />;
  if (page === 'services' && slug.length === 2) {
    const product = getProduct(slug[1]);
    if (!product || product.package) notFound();
    return <ServicePage locale={locale} product={product} />;
  }
  if (page === 'portal' || page === 'admin')
    return <PortalPage locale={locale} admin={page === 'admin'} section={slug[1]} />;
  if (slug.length > 1) notFound();
  switch (page) {
    case 'services':
      return (
        <>
          <PageIntro
            eyebrow={de ? 'FÜR DEINEN NÄCHSTEN SCHRITT' : 'FOR YOUR NEXT STEP'}
            title={de ? 'Gute Ideen verdienen gutes Handwerk.' : 'Good ideas deserve good craft.'}
            description={
              de
                ? 'Von der ersten Website bis zur eigenen Automatisierung. Wähle, was dich weiterbringt.'
                : 'From your first website to your own automation. Choose what moves you forward.'
            }
          />
          <ServiceGrid locale={locale} />
          <ContactCta locale={locale} />
        </>
      );
    case 'pricing':
      return <PricingPage locale={locale} />;
    case 'packages':
      return (
        <>
          <PageIntro
            eyebrow={de ? 'GEMEINSAM GEDACHT' : 'DESIGNED TOGETHER'}
            title={de ? 'Dein Auftritt. Im Ganzen.' : 'Your identity. In full.'}
            description={
              de
                ? 'Drei klare Pakete für deinen Start, deinen nächsten Schritt oder deinen kompletten Auftritt. Alle mit festem Umfang und individuell erweiterbar.'
                : 'Three clearly scoped packages for your start, your next step or your full presence. Each can be individually expanded.'
            }
          />
          <PackageTable locale={locale} />
          <section className="section">
            <FaqList locale={locale} limit={3} />
          </section>
          <ContactCta locale={locale} />
        </>
      );
    case 'projects':
      return (
        <>
          <PageIntro
            eyebrow="WORK IN PROGRESS"
            title={de ? 'Ein Einblick in die Möglichkeiten.' : 'A look at what’s possible.'}
            description={
              de
                ? 'Hier erscheinen künftig freigegebene Creator-Projekte und echte Kundenstimmen. Aktuell zeigen wir ausschließlich eigene, interaktive Gestaltungsbeispiele – keine Kundenreferenzen.'
                : 'Approved creator projects and genuine client feedback will appear here. For now, explore our own interactive design examples, clearly separate from client references.'
            }
          />
          <ProductPreview locale={locale} />
          <p className="tax-note">
            {de
              ? 'NOVA ist eine fiktive Designidentität für diese Vorschau. Es werden keine Kunden oder echten Kennzahlen dargestellt.'
              : 'NOVA is a fictional design identity for this preview. No clients or actual performance figures are represented.'}
          </p>
          <ContactCta locale={locale} />
        </>
      );
    case 'faq':
      return (
        <>
          <PageIntro
            eyebrow={de ? 'GUT ZU WISSEN' : 'GOOD TO KNOW'}
            title={de ? 'Klare Antworten. Von Anfang an.' : 'Clear answers. From the start.'}
          />
          <FaqList locale={locale} />
          <ContactCta locale={locale} />
        </>
      );
    case 'contact':
      return (
        <>
          <PageIntro
            eyebrow={de ? 'LASS UNS SPRECHEN' : 'LET’S TALK'}
            title={de ? 'Was hast du vor?' : 'What do you have in mind?'}
            description={
              de
                ? 'Eine konkrete Idee oder noch eine offene Frage? Erzähl uns davon.'
                : 'A clear idea or an open question? Tell us about it.'
            }
          />
          <ContactForm locale={locale} available={submissionAvailable()} />
        </>
      );
    case 'order':
      return (
        <>
          <PageIntro
            eyebrow={de ? 'DEIN PROJEKT BEGINNT HIER' : 'YOUR PROJECT STARTS HERE'}
            title={de ? 'Mach es zu deinem.' : 'Make it yours.'}
          />
          <OrderWizard
            locale={locale}
            initial={typeof query.product === 'string' ? query.product : undefined}
            available={submissionAvailable()}
          />
        </>
      );
    case 'confirmation':
      return <ConfirmationPage locale={locale} />;
    case 'login':
    case 'register':
    case 'reset-password':
      return <AccessPage locale={locale} mode={page} />;
    case 'imprint':
    case 'privacy':
    case 'terms':
      return <LegalPage locale={locale} page={page} />;
    default:
      notFound();
  }
}
