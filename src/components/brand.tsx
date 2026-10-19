import Link from 'next/link';
export function Mark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M5 8h9l6 13 6-13h9L22 33h-4L5 8Z" fill="currentColor" />
      <path d="m5 22 6 11h7l-6-11H5Zm23 0-6 11h7l6-11h-7Z" fill="currentColor" />
    </svg>
  );
}
export function Brand({ locale = 'de' }: { locale?: string }) {
  return (
    <Link className="brand" href={`/${locale}`} aria-label="Webstudio Creator — Home">
      <Mark />
      <span>
        <strong>
          WEBSTUDIO <span className="brand-slash">/</span> CREATOR
        </strong>
        <small>BY WEBSTUDIO EXPERT</small>
      </span>
    </Link>
  );
}
