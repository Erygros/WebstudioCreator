export type Locale = 'de' | 'en';
export const path = (locale: Locale, slug = '') => `/${locale}${slug ? '/' + slug : ''}`;
export type Text = { de: string; en: string };
export const tr = (de: string, en: string): Text => ({ de, en });
export const money = (cents: number, locale: Locale) =>
  new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: cents % 100 ? 2 : 0,
  }).format(cents / 100);
export const tax = tr(
  'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.',
  'No VAT charged under § 19 of the German VAT Act.',
);
export const navigation = [
  ['services', 'Leistungen', 'Services'],
  ['pricing', 'Preise', 'Pricing'],
  ['packages', 'Pakete', 'Packages'],
  ['projects', 'Projekte', 'Projects'],
  ['faq', 'FAQ', 'FAQ'],
  ['contact', 'Kontakt', 'Contact'],
];
