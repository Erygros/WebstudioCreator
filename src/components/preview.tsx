'use client';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowDown,
  ArrowUpRight,
  AudioLines,
  Bell,
  Bot,
  Check,
  ChevronRight,
  CirclePlay,
  Code2,
  Command,
  FileText,
  Hash,
  Headphones,
  LayoutDashboard,
  Mic,
  Monitor,
  MoreHorizontal,
  Plus,
  Radio,
  Send,
  Settings2,
  Shield,
  Sparkles,
  Video,
  Volume2,
} from 'lucide-react';
import type { Locale } from '@/lib/i18n';
const tabs = [
  ['website', 'Website', Monitor],
  ['overlay', 'Overlay', Radio],
  ['discord', 'Discord', Hash],
  ['dashboard', 'Creator-Tools', Command],
] as const;
export function ProductPreview({
  locale,
  initial = 'website',
  compact = false,
}: {
  locale: Locale;
  initial?: string;
  compact?: boolean;
}) {
  const [active, setActive] = useState(initial);
  const [alert, setAlert] = useState(false);
  const [channel, setChannel] = useState('general');
  const [command, setCommand] = useState('!socials');
  const reduced = useReducedMotion();
  const is = locale === 'de';
  const previewTabs: Array<readonly [string, string, typeof Monitor]> = [...tabs];
  if (!previewTabs.some(([id]) => id === initial)) {
    const label =
      initial === 'shorts'
        ? 'Shorts'
        : initial === 'mediakit'
          ? 'Mediakit'
          : initial === 'bot'
            ? 'Bot'
            : is
              ? 'Kanal'
              : 'Channel';
    previewTabs.unshift([
      initial,
      label,
      initial === 'shorts'
        ? Video
        : initial === 'mediakit'
          ? FileText
          : initial === 'bot'
            ? Bot
            : Monitor,
    ]);
  }
  return (
    <div className={`product-showcase ${compact ? 'compact' : ''}`}>
      <div className="showcase-toolbar">
        <div
          className="showcase-tabs"
          role="tablist"
          aria-label={is ? 'Produktvorschau' : 'Product preview'}
        >
          {previewTabs.map(([id, label, Icon]) => (
            <button
              key={id}
              role="tab"
              aria-selected={active === id}
              aria-controls="preview-panel"
              id={`preview-tab-${id}`}
              tabIndex={active === id ? 0 : -1}
              onKeyDown={(e) => {
                if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                  e.preventDefault();
                  const index = previewTabs.findIndex((t) => t[0] === id);
                  const next =
                    e.key === 'Home'
                      ? 0
                      : e.key === 'End'
                        ? previewTabs.length - 1
                        : (index + (e.key === 'ArrowRight' ? 1 : -1) + previewTabs.length) %
                          previewTabs.length;
                  setActive(previewTabs[next][0]);
                  (e.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus();
                }
              }}
              onClick={() => setActive(id)}
            >
              <Icon size={14} />
              {label === 'Creator-Tools' && !is ? 'Creator tools' : label}
            </button>
          ))}
        </div>
        <span className="preview-label">
          <span /> {is ? 'INTERAKTIVE VORSCHAU' : 'INTERACTIVE PREVIEW'}
        </span>
      </div>
      <motion.div
        className="showcase-stage"
        onPointerMove={(e) => {
          if (reduced || e.pointerType === 'touch') return;
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty(
            '--tilt',
            `${((e.clientX - r.left) / r.width - 0.5) * 2}deg`,
          );
        }}
        onPointerLeave={(e) => e.currentTarget.style.setProperty('--tilt', '0deg')}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            id="preview-panel"
            role="tabpanel"
            aria-label={
              is
                ? 'Gestaltungsbeispiel, kein echtes Kundenprojekt'
                : 'Design example, not a client project'
            }
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className={`preview-window preview-${active}`}
          >
            <div className="window-chrome">
              <span className="window-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="window-address">
                {active === 'website'
                  ? 'nova.creator / home'
                  : active === 'discord'
                    ? 'NOVA / COMMUNITY'
                    : active === 'overlay'
                      ? 'NOVA / LIVE STUDIO'
                      : active === 'dashboard'
                        ? 'NOVA / CREATOR SPACE'
                        : `NOVA / ${active.toUpperCase()}`}
              </span>
              <MoreHorizontal size={16} />
            </div>
            {(active === 'website' || active === 'channel') && (
              <div className="mock-website">
                <div className="mock-nav">
                  <strong>
                    NOVA<span>®</span>
                  </strong>
                  <div>
                    STREAMS <span>ABOUT</span> <span>CONTACT ↗</span>
                  </div>
                </div>
                <div className="mock-web-body">
                  <div className="mock-copy">
                    <span className="live-pill">
                      <i /> {is ? 'DEIN NÄCHSTES LEVEL' : 'YOUR NEXT LEVEL'}
                    </span>
                    <h3>
                      More than
                      <br />a stream<span>.</span>
                    </h3>
                    <p>
                      Gaming. Good vibes. A community
                      <br />
                      that feels like home.
                    </p>
                    <button onClick={() => setAlert(!alert)} className="mock-watch">
                      <CirclePlay size={14} />
                      {alert ? (is ? 'Du bist dabei!' : 'You’re in!') : 'Join the community'}
                      <ArrowUpRight size={12} />
                    </button>
                    <div className="mock-social">
                      TWITCH ↗ <span>YOUTUBE ↗</span> DISCORD ↗
                    </div>
                  </div>
                  <div className="orb-art" aria-hidden="true">
                    <div className="orb-ring ring-one" />
                    <div className="orb-ring ring-two" />
                    <div className="orb-core" />
                    <div className="orbit-label">
                      CREATE
                      <br />
                      YOUR
                      <br />
                      <b>OWN.</b>
                    </div>
                    <span className="orb-cross">+</span>
                    <span className="orb-caption">NO LIMITS. JUST YOU.</span>
                  </div>
                </div>
                <div className="mock-bottom">
                  <span>
                    <i /> NEXT STREAM / FRIDAY 20:00
                  </span>
                  <span>
                    GOOD CONTENT. GREAT COMPANY. <ArrowDown size={11} />
                  </span>
                </div>
              </div>
            )}
            {active === 'overlay' && (
              <div className="mock-overlay">
                <div className="stream-top">
                  <span className="live-pill">
                    <i /> LIVE / DESIGN PREVIEW
                  </span>
                  <span>
                    NOVA <AudioLines size={20} />
                  </span>
                </div>
                <div className="stream-art">
                  <div className="wire-sphere" />
                  <span>
                    THE NEXT
                    <br />
                    <b>CHAPTER.</b>
                  </span>
                  <button
                    className="play-button"
                    onClick={() => setAlert(!alert)}
                    aria-label={is ? 'Beispiel-Alert auslösen' : 'Trigger sample alert'}
                  >
                    <CirclePlay size={36} />
                  </button>
                </div>
                <div className="webcam-frame">
                  <Video size={28} />
                  <span>YOUR CAM HERE</span>
                </div>
                <button className="trigger-alert" onClick={() => setAlert(!alert)}>
                  <Bell size={14} />
                  {is ? 'Alert testen' : 'Test alert'}
                </button>
                <AnimatePresence>
                  {alert && (
                    <motion.div
                      className="sample-alert"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Sparkles size={23} />
                      <strong>Welcome to the crew!</strong>
                      <small>
                        {is ? 'Beispiel für einen Follow-Alert' : 'Sample follow alert'}
                      </small>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="stream-bottom">
                  <span>NOVA / ON AIR</span>
                  <span>STREAM DESIGN CONCEPT</span>
                </div>
              </div>
            )}
            {active === 'discord' && (
              <div className="mock-discord">
                <aside>
                  <div className="discord-server">N</div>
                  <Plus size={18} />
                  <Headphones size={18} />
                </aside>
                <div className="discord-channels">
                  <strong>
                    NOVA COMMUNITY <ChevronRight size={13} />
                  </strong>
                  <small>YOUR SPACE</small>
                  {['welcome', 'general', 'your-content', 'stream-talk'].map((c) => (
                    <button
                      className={channel === c ? 'selected' : ''}
                      key={c}
                      onClick={() => setChannel(c)}
                    >
                      <Hash size={14} />
                      {c}
                    </button>
                  ))}
                  <small>VOICE CHANNELS</small>
                  <span>
                    <Volume2 size={13} /> the lounge
                  </span>
                  <div className="discord-user">
                    <span>N</span> nova <Mic size={14} />
                  </div>
                </div>
                <div className="discord-chat">
                  <header>
                    <Hash size={17} />
                    {channel}
                    <span>Let’s make something.</span>
                  </header>
                  <div className="chat-intro">
                    <Hash size={28} />
                    <h3>
                      {is ? 'Dein Platz für echte Community.' : 'A place for real community.'}
                    </h3>
                    <p>Welcome to #{channel}. Make yourself at home.</p>
                  </div>
                  <div className="chat-message">
                    <span className="avatar">N</span>
                    <div>
                      <strong>
                        NOVA <small>12:04</small>
                      </strong>
                      <p>
                        {channel === 'welcome'
                          ? 'Hey crew! Welcome to your new home. ✌'
                          : channel === 'your-content'
                            ? 'Drop your latest creation here. ↓'
                            : channel === 'stream-talk'
                              ? 'What are we playing next?'
                              : 'Good to have you here. Let’s create something great.'}
                      </p>
                    </div>
                  </div>
                  <div className="chat-message bot-message">
                    <span className="avatar">
                      <Bot size={16} />
                    </span>
                    <div>
                      <strong>
                        NOVA BOT <em>APP</em>
                      </strong>
                      <p>
                        {is
                          ? 'Rollen & Moderation? Läuft automatisch.'
                          : 'Roles & moderation? Already taken care of.'}
                      </p>
                    </div>
                  </div>
                  <div className="chat-input">
                    <Plus size={14} />
                    <span>
                      {is
                        ? 'Gestaltungsbeispiel · kein verbundener Server'
                        : 'Design preview · no connected server'}
                    </span>
                    <Send size={13} />
                  </div>
                </div>
              </div>
            )}
            {active === 'dashboard' && (
              <div className="mock-dashboard">
                <aside>
                  <Command size={22} />
                  {[LayoutDashboard, AudioLines, Bot, Settings2].map((Icon, i) => (
                    <span className={i === 0 ? 'selected' : ''} key={i}>
                      <Icon size={17} />
                    </span>
                  ))}
                </aside>
                <div className="dashboard-body">
                  <header>
                    <span>CREATOR SPACE</span>
                    <span className="concept-badge">
                      {is ? 'KONZEPTVORSCHAU' : 'CONCEPT PREVIEW'}
                    </span>
                  </header>
                  <h3>
                    Hey, Nova <span>✳</span>
                  </h3>
                  <p>
                    {is ? 'Weniger verwalten. Mehr erschaffen.' : 'Less managing. More creating.'}
                  </p>
                  <div className="mock-stats">
                    {[
                      ['COMMUNITY', '2.4k', '+12.8%'],
                      ['WATCH TIME', '186h', '+8.2%'],
                      ['LIVE SESSIONS', '12', 'this month'],
                    ].map(([label, value, change]) => (
                      <div key={label}>
                        <small>{label}</small>
                        <strong>{value}</strong>
                        <span>{change}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mock-chart">
                    <span>
                      {is ? 'DEINE ENTWICKLUNG · BEISPIELDATEN' : 'YOUR GROWTH · SAMPLE DATA'}
                    </span>
                    <svg viewBox="0 0 460 90" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M0 80H460M0 45H460M0 10H460" stroke="#ffffff12" />
                      <path
                        d="M0 75 35 66 70 70 105 41 140 50 175 32 210 42 245 16 280 28 315 20 350 35 385 9 420 19 460 3"
                        fill="none"
                        stroke="#a58afa"
                        strokeWidth="3"
                      />
                    </svg>
                    <div>
                      MON <span>TUE</span>
                      <span>WED</span>
                      <span>THU</span>
                      <span>FRI</span>
                      <span>SAT</span>
                      <span>SUN</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {active === 'shorts' && (
              <div className="mock-shorts">
                <div className="short-film">
                  <div className="wire-sphere" />
                  <span>
                    ONE STREAM.
                    <br />
                    <b>MORE STORIES.</b>
                  </span>
                  <span className="caption-chip">
                    {is ? 'Dein bester Moment.' : 'Your best moment.'}
                  </span>
                  <small>9:16 / SHORT FORM</small>
                </div>
                <div>
                  <Video size={30} />
                  <h3>
                    Made to
                    <br />
                    stop the scroll.
                  </h3>
                  <p>{is ? 'Schnitt. Untertitel. Dein Stil.' : 'Editing. Captions. Your style.'}</p>
                  <span className="concept-badge">{is ? 'FORMATVORSCHAU' : 'FORMAT PREVIEW'}</span>
                </div>
              </div>
            )}
            {active === 'mediakit' && (
              <div className="mock-mediakit">
                <span>NOVA / MEDIA KIT</span>
                <h3>
                  Let’s make
                  <br />
                  an impact<span> together.</span>
                </h3>
                <div>
                  <span>GAMING & LIFESTYLE</span>
                  <ArrowUpRight size={42} />
                </div>
                <p>
                  {is
                    ? 'Platz für deine echten Zahlen, deine Geschichte und deine nächsten Partnerschaften.'
                    : 'Room for your real numbers, your story and your next partnerships.'}
                </p>
                <small>
                  {is
                    ? 'GESTALTUNGSBEISPIEL · KEINE ECHTEN REICHWEITEN'
                    : 'DESIGN EXAMPLE · NO REAL AUDIENCE FIGURES'}
                </small>
              </div>
            )}
            {active === 'bot' && (
              <div className="mock-bot">
                <div>
                  <Bot size={32} />
                  <span>NOVA BOT / SANDBOX</span>
                  <Shield size={18} />
                </div>
                <h3>{is ? 'Deine Befehle. Dein Flow.' : 'Your commands. Your flow.'}</h3>
                <div className="terminal">
                  <span>nova@creator ~ % {command}</span>
                  <p>
                    {command === '!socials'
                      ? '↗ twitch.tv/your-channel · youtube.com/@your-channel'
                      : command === '!schedule'
                        ? '↗ Friday · 20:00 CET'
                        : '✓ Example reward added · +10 points'}
                  </p>
                  <small>
                    {is
                      ? 'Lokale Funktionsvorschau. Kein verbundener Bot.'
                      : 'Local feature preview. No connected bot.'}
                  </small>
                </div>
                <div className="command-buttons">
                  {['!socials', '!schedule', '!points'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCommand(c)}
                      className={command === c ? 'active' : ''}
                    >
                      <Code2 size={12} />
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="floating-note">
          <span className="note-icon">
            <Check size={17} />
          </span>
          <span>
            {is ? 'Deine Vision. Individuell umgesetzt.' : 'Your vision. Individually crafted.'}
            <small>{is ? 'Kein Template. Dein Unikat.' : 'Your identity. In every detail.'}</small>
          </span>
          <Sparkles size={17} />
        </div>
        <div className="stage-grid" aria-hidden="true" />
      </motion.div>
      <div className="showcase-caption">
        <span>
          <span className="status-dot" />
          {is
            ? 'Für dich gestaltet. Für deine Community gemacht.'
            : 'Designed for you. Made for your community.'}
        </span>
        <span>
          {is ? 'Gestaltungsbeispiel' : 'Design example'} <ArrowUpRight size={12} />
        </span>
      </div>
    </div>
  );
}
