import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="error-page">
      <span className="eyebrow">404 / WEBSTUDIO CREATOR</span>
      <h1>
        Hier geht es nicht weiter.
        <br />
        <span>Let’s get you back.</span>
      </h1>
      <Link className="button" href="/de">
        Zur Startseite / Back home ↗
      </Link>
    </main>
  );
}
