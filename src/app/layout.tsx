import type { Metadata } from 'next';
import { headers } from 'next/headers';
import '@fontsource-variable/manrope';
import '@fontsource-variable/space-grotesk';
import './globals.css';
export const metadata: Metadata = {
  title: {
    default: 'Webstudio Creator — Dein Content. Unser Handwerk.',
    template: '%s | Webstudio Creator',
  },
  description:
    'Websites, Stream-Overlays, Discord-Server und Creator-Tools. Individuell gestaltet. Transparent kalkuliert. by Webstudio Expert.',
  applicationName: 'Webstudio Creator',
  robots: { index: false, follow: true },
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (await headers()).get('x-creator-locale') === 'en' ? 'en' : 'de';
  return (
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.dataset.theme=localStorage.getItem('wc-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch{}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
