'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { Brand, Mark } from './brand';
import { navigation, type Locale } from '@/lib/i18n';
import { services } from '@/lib/catalog';
import { company } from '@/lib/company';
export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === 'dark');
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  useEffect(() => {
    setMenu(false);
    setSearch(false);
  }, [pathname]);
  useEffect(() => {
    if (search) {
      dialog.current?.showModal();
      searchInput.current?.focus();
    } else dialog.current?.close();
  }, [search]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearch((s) => !s);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  function theme() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    try {
      localStorage.setItem('wc-theme', next ? 'dark' : 'light');
    } catch {}
  }
  const results = services.filter((p) =>
    (p.name[locale] + ' ' + p.description[locale] + ' ' + p.scope.map((s) => s[locale]).join(' '))
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <>
      <a className="skip" href="#main">
        {locale === 'de' ? 'Zum Inhalt' : 'Skip to content'}
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Brand locale={locale} />
          <nav
            className={menu ? 'main-nav is-open' : 'main-nav'}
            aria-label={locale === 'de' ? 'Hauptnavigation' : 'Main navigation'}
          >
            <Link href={`/${locale}`} aria-current={pathname === `/${locale}` ? 'page' : undefined}>
              {locale === 'de' ? 'Startseite' : 'Home'}
            </Link>
            {navigation.map(([slug, de, en]) => (
              <Link
                key={slug}
                aria-current={pathname === `/${locale}/${slug}` ? 'page' : undefined}
                href={`/${locale}/${slug}`}
              >
                {locale === 'de' ? de : en}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button search-toggle"
              onClick={() => setSearch(true)}
              aria-label={locale === 'de' ? 'Leistungen suchen' : 'Search services'}
            >
              <Search size={17} />
            </button>
            <Link
              className="language"
              href={pathname.replace(/^\/(de|en)(?=\/|$)/, locale === 'de' ? '/en' : '/de')}
              lang={locale === 'de' ? 'en' : 'de'}
              aria-label={locale === 'de' ? 'Switch to English' : 'Zu Deutsch wechseln'}
            >
              {locale.toUpperCase()}
              <span>⌄</span>
            </Link>
            <button
              className="icon-button"
              onClick={theme}
              aria-label={locale === 'de' ? 'Farbschema wechseln' : 'Toggle colour theme'}
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Link className="login-link" href={`/${locale}/login`}>
              Login <ArrowUpRight size={14} />
            </Link>
            <button
              className="icon-button mobile-toggle"
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-label={locale === 'de' ? 'Menü' : 'Menu'}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <dialog
        ref={dialog}
        className="search-dialog"
        onCancel={() => setSearch(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSearch(false);
        }}
      >
        <div className="search-head">
          <Search size={20} />
          <input
            ref={searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              locale === 'de' ? 'Was möchtest du gestalten?' : 'What would you like to create?'
            }
            aria-label={locale === 'de' ? 'Leistungen suchen' : 'Search services'}
          />
          <button
            className="icon-button"
            onClick={() => setSearch(false)}
            aria-label={locale === 'de' ? 'Schließen' : 'Close'}
          >
            <X size={19} />
          </button>
        </div>
        <div className="search-results">
          {results.length ? (
            results.map((p) => (
              <Link key={p.id} href={`/${locale}/services/${p.id}`}>
                <span>
                  {p.name[locale]}
                  <small>{p.short[locale]}</small>
                </span>
                <ArrowUpRight size={18} />
              </Link>
            ))
          ) : (
            <p>
              {locale === 'de'
                ? 'Keine passende Leistung. Schreib uns über Kontakt.'
                : 'No matching services. Get in touch through Contact.'}
            </p>
          )}
        </div>
        <small className="search-hint">
          {locale === 'de' ? 'Schnellsuche' : 'Quick search'} <kbd>Ctrl K</kbd>
        </small>
      </dialog>
    </>
  );
}
export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <Brand locale={locale} />
          <p>
            {locale === 'de'
              ? 'Für deinen Content. Für das, was kommt.'
              : 'For your content. For what comes next.'}
          </p>
          <span className="footer-location">
            <span className="status-dot" /> Dortmund, Deutschland
          </span>
        </div>
        <div>
          <span className="eyebrow">Studio</span>
          {navigation.map(([slug, de, en]) => (
            <Link href={`/${locale}/${slug}`} key={slug}>
              {locale === 'de' ? de : en}
            </Link>
          ))}
        </div>
        <div>
          <span className="eyebrow">{locale === 'de' ? 'Lass uns sprechen' : 'Let’s talk'}</span>
          <Link href={`/${locale}/contact`}>
            {locale === 'de' ? 'Projekt anfragen' : 'Start a project'} <ArrowUpRight size={14} />
          </Link>
          <a href={`tel:${company.phoneHref}`}>{company.phone}</a>
          <span className="muted">
            {locale === 'de' ? 'Ein Geschäftsbereich von' : 'A division of'}
            <br />
            {company.name}
          </span>
        </div>
        <Mark className="footer-mark" />
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Webstudio Creator</span>
        <div>
          <Link href={`/${locale}/imprint`}>{locale === 'de' ? 'Impressum' : 'Legal notice'}</Link>
          <Link href={`/${locale}/privacy`}>{locale === 'de' ? 'Datenschutz' : 'Privacy'}</Link>
          <Link href={`/${locale}/terms`}>
            {locale === 'de' ? 'Bestellhinweise' : 'Ordering information'}
          </Link>
          <span>Made for creators. Built with care.</span>
        </div>
      </div>
    </footer>
  );
}
