import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components/shell';
import type { Locale } from '@/lib/i18n';
export default async function LocalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== 'de' && locale !== 'en') notFound();
  return (
    <div lang={locale}>
      <Header locale={locale as Locale} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer locale={locale as Locale} />
    </div>
  );
}
