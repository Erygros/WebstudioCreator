# Webstudio Creator

Eigenständige Creator-Plattform von Webstudio Expert. Next.js App Router, TypeScript, Tailwind CSS 4, Motion, Lucide und Zod. Repository: [Erygros/WebstudioCreator](https://github.com/Erygros/WebstudioCreator), Branch `main`.

## Lokal starten

Node.js 22 oder neuer verwenden (getestet: 24.19). `npm ci`, dann `npm run dev`. Die Vorschau läuft unter `http://127.0.0.1:3000/de`; Englisch unter `/en`. Optionale Konfiguration aus `.env.example` in `.env.local` übernehmen. Ohne Secrets starten alle öffentlichen Informationsseiten und Konfiguratoren; der Versand bleibt nachvollziehbar deaktiviert.

```sh
npm run typecheck
npm test
npm run build
npm start
# Optional bei laufendem Server:
npm run test:http
```

## Implementiert

- Eigenständiges responsives Design, lokale Manrope-/Space-Grotesk-Schriften, SVG-Logo für beide Farbschemata und Favicon.
- DE/EN-Routen, übersetzte Inhalte, lokale Themenpräferenz, Tastatur-Schnellsuche, mobile Navigation, reduzierte Bewegung und Seitenübergänge.
- Startseite, Leistungsübersicht, acht individuelle Leistungsseiten mit passenden Vorschauen, Live-Konfiguratoren und FAQ, separate Preise, drei Pakete mit festen Grenzen, Projekte, FAQ und Kontakt.
- Vierstufiger Anfrageprozess mit dienstleistungsspezifischem Briefing, Mehrfachauswahl, Mengenlimits, optionalem Wunschtermin, bis zu drei PDF-/PNG-/JPG-Dateien (insgesamt 3 MB), Angebotsübersicht und druckbarem Eingangsbeleg.
- Alle Preise in ganzzahligen EUR-Cent unter `src/lib/catalog.ts`. Getrennte Einmal-/Monatssummen, 50 % geplante Anzahlung nur auf einmalige Leistungen, Preisversionierung und strikte serverseitige Neuberechnung. Keine erfundenen Rabatte.
- Server-Routen für Angebotsberechnung, Kontakt und Anfragen, Zod-Validierung, Origin-Prüfung, Dateisignaturprüfung, Honeypot und zusätzlicher prozesslokaler Versandbegrenzung.
- SMTP-Übermittlung der vollständigen Anfrage inkl. Briefing und Anhängen an das separate Creator-Postfach; danach Kundenbestätigung. `WC-JAHR-<16 Hexzeichen>` als Referenz. Erfolg erst nach SMTP-Annahme der Betreiber-Nachricht. Ein Fehler der Kundenbestätigung wird ausdrücklich angezeigt. Keine Zahlung wird ausgelöst.
- Alle geforderten Portal-/Adminmodule als klar gesperrte Integrationsansichten. Keine erfassten Passwörter, offenen CRUD-Endpunkte, Demo-Aufträge oder simulierte Anmeldung.
- Typisierte Repository-Schnittstelle, standardmäßig gesperrter Adapter sowie vorbereitete SQL-Migration mit 21 Tabellen, RLS, geschützten Rollen und separatem Schema. Die Migration ist **nicht** auf eine externe Datenbank angewendet.

## SMTP aktivieren

Ein eigenes Creator-Postfach und eine eigene Absenderadresse einrichten, Domain beim SMTP-Anbieter verifizieren (SPF/DKIM/DMARC), dann `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `CREATOR_MAIL_FROM`, `CREATOR_MAIL_TO` und `CREATOR_SENDER_VERIFIED=true` serverseitig setzen. Port 465 verwendet TLS direkt; andere Ports erfordern STARTTLS. `SITE_URL` muss exakt dem aufgerufenen Origin entsprechen, bei Vercel einschließlich `https://`.

Keine bestehenden Expert-Kundenbestände, Vorlagen, CRM-Prozesse oder E-Mail-Protokolle anbinden. Das Creator-Postfach ist bis zur Datenbankintegration das dauerhafte Vorgangsarchiv und muss entsprechend gesichert und aufbewahrt werden. SMTP-Annahme ist keine Garantie für spätere Postfachzustellung; Bounce-Monitoring betreiben. Bei einem unklaren Verbindungsabbruch zuerst das Postfach prüfen, statt dieselbe Anfrage wiederholt zu senden. Ein dauerhafter automatischer Idempotenz-/Retrymechanismus wird zusammen mit der Datenbank und einer Outbox umgesetzt.

Vor öffentlicher Versandaktivierung eine Vercel-Firewall-/Rate-Limit-Regel für `POST /api/booking` und `POST /api/contact` konfigurieren. Die Begrenzung in der App (5 Versuche / 15 Minuten / Instanz und IP) ist ergänzend und kein verteilter Abuse-Schutz.

## Verbindliche Bestellungen und Zahlungen

Der aktuelle Abschluss ist ausdrücklich eine **unverbindliche Projektanfrage**. Verbindliche zahlungspflichtige Online-Bestellungen sind noch nicht aktiviert: Es fehlen freigegebene Creator-Vertrags-/Verbraucher-/Widerrufsinformationen und verifizierte Zahlungsangaben. Vorlagen für diese rechtlich maßgeblichen Inhalte werden nicht erfunden. Der in der ursprünglichen Datei enthaltene Auftrag bricht in Abschnitt 11 mitten im Satz ab; nachfolgende Vorgaben lagen nicht vor.

Geplante Zahlungsarten haben ausschließlich serverseitige Konfigurationsfelder. Eine gesetzte IBAN oder Krypto-Adresse schaltet noch keinen Checkout frei. Zahlungsanweisungen, Wechselkurse, Fälligkeiten und Freigaben müssen nach Prüfung umgesetzt werden; niemals erfundene Empfangsadressen verwenden. Anfragen sind immer unbezahlt. Bankeingänge werden später nur durch berechtigte Administratoren bestätigt. Das Creator-Dashboard bleibt eine unverbindliche Vormerkung ohne Abonnement oder Abbuchung.

## Supabase später anbinden

Siehe [supabase/README.md](supabase/README.md). Kein SDK mit erfundenen URLs, keine Verbindung und kein Datenimport sind eingerichtet. `src/lib/data/repository.ts` verweigert jede Datenoperation. Ein neuer verifizierender Serveradapter muss Authentifizierung, geschützte Memberships, Eigentumsrechte und explizite Projektfilter erzwingen. Danach die Module einzeln mit echten Funktionen aktivieren. Ein bloßes Hinzufügen von Zugangsdaten aktiviert nichts. Private Storage-Buckets, signierte Downloads, Audit-Logging, transaktionale Preisverwaltung und Outbox sind zusätzliche Integrationsschritte.

## Vercel

In einem angemeldeten Vercel-Konto **dieses GitHub-Repository** importieren, Framework Next.js, Node.js 24, Build `npm run build`, Standardausgabe verwenden. Eigene Creator-Domain und serverseitige Umgebungsvariablen konfigurieren. Die Anwendung braucht Node.js für SMTP und ist kein statischer Export. Automatische GitHub-Deployments können anschließend `main` verfolgen.

In dieser Arbeitsumgebung war die Vercel-CLI nicht angemeldet; es wurde kein Deployment und keine Domain-Verknüpfung behauptet. Keine Veröffentlichung in ein fremdes oder temporäres Konto durchführen.

## Freigabe vor öffentlichem Produktivbetrieb

Unternehmens- und Steuerdaten wurden am 19.10.2026 direkt am [offiziellen Impressum](https://webstudio-expert.de/impressum) verifiziert. Adresse: Enrico Gross, Webstudio Expert, Karinstraße 5, 44388 Dortmund; § 19 UStG. Zahlungsdaten lagen nicht vor.

Die Datenschutzseite beschreibt den aktuellen Stand; tatsächliche Hosting-/SMTP-Anbieter, Auftragsverarbeitung, Speicherfristen und mögliche Drittlandtransfers vor dem Start ergänzen. Kontakt-/Anfrageversand gegen den echten SMTP-Anbieter testen, einschließlich Fehlern und Kundenzustellung. Rechtsinformationen und gegebenenfalls Vertragsabschluss prüfen. Erst dann Indexierung aktivieren: derzeit `noindex` und `robots.txt` mit Disallow, damit unfertige Rechts- und Integrationsbereiche nicht als fertiger Shop erscheinen.

## Tests

Unit-Tests prüfen Preise, Optionen, manipulierte Beträge, Monatsleistungen, Briefingvalidierung und gesperrte Datenadapter. Ein isolierter echter PostgreSQL-Kern (PGlite, nur im Test) führt die Migration aus und prüft Kundentrennung, geschützte Adminnotizen, verweigerte Rolleneskalation und Zahlungsschreibrechte. Er ersetzt keinen Test in einem echten Supabase-Projekt. HTTP-Smoke-Tests prüfen beide Sprachen, alle öffentlichen Seiten, Portal-Sperren, 404s, serverseitige Preisberechnung und fehlende SMTP-Konfiguration. Eine reale E-Mail-Zustellung ist ohne Zugangsdaten nicht geprüft.
