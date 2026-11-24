import React from 'react';
import { companion, mix, onColor, readableOn } from '../color';

export type TypeId = 'site' | 'landing' | 'cardapio' | 'loja' | 'sistema';
export type Look = 'claro' | 'escuro';

export type Cfg = {
  name: string;
  slogan: string;
  type: TypeId;
  template: string;
  look: Look;
  logo: string | null;
  photo: string | null;
  colors: string[];
};

export type TplProps = { cfg: Cfg };

export const DEFAULT_CFG: Cfg = {
  name: '',
  slogan: '',
  type: 'site',
  template: 'consultoria',
  look: 'claro',
  logo: null,
  photo: null,
  colors: ['#7e3bed'],
};

export const displayName = (cfg: Cfg) => cfg.name.trim() || 'Seu Negócio';

/** Variáveis de tema (cores) calculadas a partir da cor do cliente e do estilo claro/escuro. */
export function themeVars(cfg: Cfg): string {
  const p = cfg.colors[0] || '#7e3bed';
  const s = cfg.colors[1] || companion(p);
  const dark = cfg.look === 'escuro';
  const bg = dark ? mix(p, '#07070a', 0.93) : mix(p, '#fbfaf7', 0.95);
  const fg = dark ? '#f5f4f8' : '#131316';
  const card = dark ? mix(p, '#121216', 0.88) : '#ffffff';
  const v: Record<string, string> = {
    '--p': p,
    '--on-p': onColor(p),
    '--p-text': readableOn(p, bg, 3.4),
    '--s': s,
    '--on-s': onColor(s),
    '--bg': bg,
    '--bg2': dark ? mix(p, '#0c0c10', 0.9) : mix(p, '#f3f1ec', 0.9),
    '--fg': fg,
    '--mut': dark ? '#b4b2bd' : '#5d5c66',
    '--card': card,
    '--line': dark ? 'rgba(255,255,255,.1)' : 'rgba(17,17,20,.1)',
    '--soft': mix(p, bg, 0.82),
    '--ink': mix(p, '#08080b', 0.86),
    '--on-ink': '#f6f5f9',
  };
  return ':root{' + Object.entries(v).map(([k, x]) => `${k}:${x}`).join(';') + '}';
}

/** CSS base compartilhado pelos modelos (reset + animações). */
export const BASE_CSS = `
*{box-sizing:border-box}html,body{margin:0;padding:0}
body{background:var(--bg);color:var(--fg);-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{display:block;max-width:100%}
section,header,main,aside,footer,div{min-width:0}h1,h2,h3{overflow-wrap:break-word}button,input{font:inherit;color:inherit}button{cursor:pointer}a{color:inherit}
@keyframes up{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
@keyframes diag{from{opacity:0;transform:translate(-40px,40px) rotate(-3deg)}to{opacity:1;transform:none}}
@keyframes zoom{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@keyframes floatR{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-12px) rotate(-1deg)}}
@keyframes marq{to{transform:translateX(-50%)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes draw{from{stroke-dashoffset:1200}to{stroke-dashoffset:0}}
@keyframes grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes pulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--p) 60%,transparent)}80%,100%{box-shadow:0 0 0 16px transparent}}
@keyframes bump{0%{transform:scale(1)}40%{transform:scale(1.35)}100%{transform:scale(1)}}
.a1{animation:up .8s cubic-bezier(.2,.7,.2,1) both}.a2{animation:up .8s .1s cubic-bezier(.2,.7,.2,1) both}
.a3{animation:up .8s .2s cubic-bezier(.2,.7,.2,1) both}.a4{animation:up .8s .3s cubic-bezier(.2,.7,.2,1) both}
.a5{animation:up .8s .4s cubic-bezier(.2,.7,.2,1) both}.dg{animation:diag .9s cubic-bezier(.2,.7,.2,1) both}
.zm{animation:zoom 1s .15s cubic-bezier(.2,.7,.2,1) both}.fl{animation:float 6s ease-in-out infinite}
.flr{animation:floatR 7s ease-in-out infinite}.sp{animation:spin 22s linear infinite}
.lift{transition:transform .35s cubic-bezier(.2,.7,.2,1),box-shadow .35s}
.lift:hover{transform:translateY(-6px);box-shadow:0 24px 50px -24px rgba(0,0,0,.35)}
.btn{transition:transform .2s,filter .2s}.btn:hover{transform:translateY(-2px);filter:brightness(1.06)}
.bump{animation:bump .4s}
@supports (animation-timeline: view()){.rv{animation:up linear both;animation-timeline:view();animation-range:entry 0% cover 22%}}
@media (prefers-reduced-motion:reduce){*{animation-duration:.01s !important;animation-iteration-count:1 !important;transition:none !important}}
`;

export function fonts(...families: string[]) {
  return `@import url("https://fonts.googleapis.com/css2?${families.map((f) => 'family=' + f).join('&')}&display=swap");`;
}

/** Logo do cliente (imagem enviada) ou um selo com as iniciais. */
export function Logo({ cfg, size = 38, invert = false }: { cfg: Cfg; size?: number; invert?: boolean }) {
  const name = displayName(cfg);
  if (cfg.logo) {
    return <img src={cfg.logo} alt={name} style={{ height: size, width: 'auto', maxWidth: size * 3.2, objectFit: 'contain' }} />;
  }
  const ini = name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <span
      aria-hidden="true"
      style={{
        width: size, height: size, borderRadius: size * 0.3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: invert ? 'var(--on-p)' : 'var(--p)', color: invert ? 'var(--p)' : 'var(--on-p)', fontWeight: 800, fontSize: size * 0.42, flexShrink: 0,
      }}
    >
      {ini}
    </span>
  );
}

export function Brand({ cfg, size = 36, style }: { cfg: Cfg; size?: number; style?: React.CSSProperties }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: size * 0.5, ...style }}>
      <Logo cfg={cfg} size={size} />
      {!cfg.logo && <span>{displayName(cfg)}</span>}
    </span>
  );
}

/** Assinatura "Powered By <Code> Labs", na cor do próprio site. */
export function PoweredBy({ color = 'currentColor', accent }: { color?: string; accent?: string }) {
  return (
    <a
      href="https://startcodelabs.com"
      target="_blank"
      rel="noopener"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '22px 16px', color, textDecoration: 'none', opacity: 0.9, fontWeight: 600, fontSize: 14 }}
    >
      <span style={{ width: 34, height: 1.5, background: 'currentColor', opacity: 0.6 }} />
      Powered By
      <svg width="30" height="20" viewBox="0 0 120 80" aria-hidden="true">
        <polygon points="34,14 34,28 16,40 34,52 34,66 0,46 0,34" fill={accent || 'currentColor'} />
        <path d="M73 25 A18 18 0 1 0 73 55" fill="none" stroke="currentColor" strokeWidth="13" />
        <polygon points="86,14 86,28 104,40 86,52 86,66 120,46 120,34" fill={accent || 'currentColor'} />
      </svg>
      <span style={{ fontWeight: 800 }}>&lt;Code&gt; Labs</span>
      <span style={{ width: 34, height: 1.5, background: 'currentColor', opacity: 0.6 }} />
    </a>
  );
}

/** Ícones de traço simples. */
const PATHS: Record<string, string> = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  arrowUp: 'M7 17L17 7M8 7h9v9',
  play: 'M8 5v14l11-7z',
  check: 'M5 12l5 5L20 7',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
  chat: 'M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12z',
  bag: 'M6 7h12l-1 14H7zM9 7a3 3 0 0 1 6 0',
  cart: 'M3 4h2l2.5 11h11L21 7H6.5M9 20h.01M18 20h.01',
  heart: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.3-4.3',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21v-1a7 7 0 0 1 16 0v1',
  plus: 'M12 5v14M5 12h14',
  menu: 'M4 7h16M4 12h16M4 17h16',
  pin: 'M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  bolt: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  calendar: 'M4 6h16v15H4zM4 10h16M9 3v4M15 3v4',
  truck: 'M2 7h11v9H2zM13 10h5l3 3v3h-8M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4',
  leaf: 'M5 19c0-9 6-14 15-14 0 9-5 15-14 15M5 19l8-8',
  home: 'M3 11l9-8 9 8v10H3z',
  users: 'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 20v-2a4 4 0 0 0-3-3.9',
  box: 'M21 8l-9-5-9 5 9 5zM3 8v8l9 5 9-5V8M12 13v8',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1-1-3-2 .3-1.5-1.5L17 5l-3-1-1 2h-2L10 4 7 5l.5 1.8L6 8.3 4 8 3 11l2 1v0l-2 1 1 3 2-.3 1.5 1.5L7 19l3 1 1-2h2l1 2 3-1-.5-1.8 1.5-1.5 2 .3 1-3z',
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
  tooth: 'M7 3c-2.5 0-4 2-4 4.5C3 12 6 13 6.5 17s1 4 2 4 1.5-2 2-4 1-3 1.5-3 1 1 1.5 3 1 4 2 4 1.5-1 2-4S21 12 21 7.5C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3z',
};

export function Icon({ name, size = 20, stroke = 2, fill = false, style }: { name: string; size?: number; stroke?: number; fill?: boolean; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke={fill ? 'none' : 'currentColor'} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, ...style }}>
      <path d={PATHS[name] || PATHS.sparkle} />
    </svg>
  );
}

/** Foto do cliente ou uma composição gráfica no lugar. */
export function PhotoOr({ cfg, fallback, style, alt }: { cfg: Cfg; fallback: React.ReactNode; style?: React.CSSProperties; alt?: string }) {
  if (cfg.photo) return <img src={cfg.photo} alt={alt || displayName(cfg)} style={{ width: '100%', height: '100%', objectFit: 'cover', ...style }} />;
  return <>{fallback}</>;
}
