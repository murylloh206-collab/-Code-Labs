/**
 * Camada de efeitos dos sites do Estúdio (roda dentro do iframe da prévia).
 * Entrada em cortina, revelação ao rolar, números que contam, inclinação 3D,
 * paralaxe, brilho que segue o mouse, botões magnéticos e confete nos cliques.
 */

export type FxOpts = { name: string; intro: boolean; tilt: boolean };

export const FX_CSS = `
html.fx-wait *,html.fx-wait *:before,html.fx-wait *:after{animation-play-state:paused !important}
html.fx-wait .fx-cur,html.fx-wait .fx-cur *,html.fx-wait .fx-cur *:before,html.fx-wait .fx-cur *:after{animation-play-state:running !important}
html.fx,html.fx body{overflow-x:clip !important;max-width:100vw}
html.fx [data-r]{opacity:0;will-change:transform,opacity,filter;transition:opacity 1s cubic-bezier(.2,.7,.2,1) var(--d,0ms),transform 1s cubic-bezier(.2,.7,.2,1) var(--d,0ms),filter 1s ease var(--d,0ms)}
html.fx [data-r=up]{transform:translateY(54px);filter:blur(8px)}
html.fx [data-r=left]{transform:translateX(-80px);filter:blur(8px)}
html.fx [data-r=right]{transform:translateX(80px);filter:blur(8px)}
html.fx [data-r=zoom]{transform:scale(.84);filter:blur(10px)}
html.fx [data-r=flip]{transform:perspective(900px) rotateX(24deg) translateY(50px);filter:blur(6px)}
html.fx [data-r].in{opacity:1;transform:none;filter:none}
html.fx [data-r].done{will-change:auto;transition:transform .45s cubic-bezier(.2,.7,.2,1),box-shadow .35s,filter .3s}
.fx-bar{position:fixed;left:0;top:0;height:4px;width:100%;transform-origin:0 50%;transform:scaleX(0);background:linear-gradient(90deg,var(--p),var(--s));z-index:9998;pointer-events:none;box-shadow:0 0 14px var(--p)}
.fx-glow{position:fixed;left:0;top:0;width:520px;height:520px;margin:-260px 0 0 -260px;border-radius:50%;pointer-events:none;z-index:1;background:radial-gradient(closest-side,color-mix(in srgb,var(--p) 26%,transparent),transparent);mix-blend-mode:soft-light;opacity:0;transition:opacity .4s}
.fx-glow.on{opacity:1}
.fx-cur{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;pointer-events:none;overflow:hidden}
.fx-cur .p1,.fx-cur .p2{position:absolute;left:0;right:0;height:50.5%;background:var(--ink);transition:transform .9s cubic-bezier(.8,0,.15,1)}
.fx-cur .p1{top:0}.fx-cur .p2{bottom:0;background:var(--p)}
.fx-cur .p2:before{content:"";position:absolute;inset:0;background:var(--ink);transform-origin:0 50%;animation:fxfill 1s .15s cubic-bezier(.7,0,.2,1) both}
.fx-cur .t{position:relative;z-index:2;text-align:center;color:var(--on-ink);font:800 clamp(28px,7vw,72px)/1 system-ui,sans-serif;letter-spacing:-.03em;padding:0 20px;transition:opacity .4s,transform .6s}
.fx-cur .t span{display:inline-block;animation:fxletter .7s cubic-bezier(.2,.8,.2,1) both}
.fx-cur .t i{display:block;height:5px;margin:22px auto 0;width:min(260px,60vw);border-radius:9px;background:rgba(255,255,255,.18);overflow:hidden}
.fx-cur .t i:after{content:"";display:block;height:100%;background:var(--p);border-radius:9px;transform-origin:0 50%;animation:fxfill 1.05s .1s cubic-bezier(.6,0,.2,1) both}
.fx-cur.out .p1{transform:translateY(-101%)}.fx-cur.out .p2{transform:translateY(101%)}.fx-cur.out .t{opacity:0;transform:scale(1.12)}
@keyframes fxfill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes fxletter{from{opacity:0;transform:translateY(60%) rotate(8deg);filter:blur(8px)}to{opacity:1;transform:none;filter:none}}
.fx-conf{position:fixed;left:0;top:0;width:10px;height:6px;border-radius:2px;pointer-events:none;z-index:9997}
@media (pointer:coarse){.fx-glow{display:none}}
@media (prefers-reduced-motion:reduce){html.fx [data-r]{opacity:1 !important;transform:none !important;filter:none !important}.fx-cur{display:none}}
`;

const REVEAL_SEL = [
  'h2', 'h3', '.rv', '.lift', '.card', '.bx', '.chip', '.stats>div', '.sg>*', '.bento>*', '.spec>div', '.svc3>div',
  'section>p', '.eyebrow', 'details', '.fq', '.pc', '.prod', '.cc', '.q',
].join(',');

const NUM = /^(R\$\s?)?(\d{1,3}(?:\.\d{3})+|\d+)(,\d+)?(\s?[%+kKhx]|\s?mil|\s?min)?(\+)?$/;

export function startFx(doc: Document, opts: FxOpts): () => void {
  const win = doc.defaultView as Window;
  const root = doc.documentElement;
  const body = doc.body;
  const reduce = win.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const fine = win.matchMedia?.('(pointer: fine)').matches;
  const cleanups: Array<() => void> = [];
  const timers: number[] = [];
  const later = (fn: () => void, ms: number) => { const t = win.setTimeout(fn, ms); timers.push(t); return t; };

  const style = doc.createElement('style');
  style.setAttribute('data-fx', '');
  style.textContent = FX_CSS;
  doc.head.appendChild(style);
  cleanups.push(() => style.remove());

  const mk = (cls: string, html = '') => {
    const d = doc.createElement('div');
    d.className = cls;
    if (html) d.innerHTML = html;
    body.appendChild(d);
    cleanups.push(() => d.remove());
    return d;
  };

  let ready = false;
  const queue = new Set<Element>();
  const counters = new Map<Element, () => void>();

  /* ---------- revelação ao rolar ---------- */
  const reveal = (el: Element) => {
    el.classList.add('in');
    const d = parseInt((el as HTMLElement).style.getPropertyValue('--d') || '0', 10);
    later(() => { el.classList.add('done'); (el as HTMLElement).style.removeProperty('--d'); }, 1050 + d);
    counters.get(el)?.();
  };
  const io: IntersectionObserver = new (win as any).IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    entries.forEach((e: IntersectionObserverEntry) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      if (ready) reveal(e.target); else queue.add(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  cleanups.push(() => io.disconnect());

  const countUp = (node: Text, parent: Element) => {
    const m = NUM.exec((node.nodeValue || '').trim());
    if (!m) return;
    const pre = m[1] || '';
    const int = parseInt(m[2].replace(/\./g, ''), 10);
    const dec = m[3] ? m[3].slice(1) : '';
    const target = parseFloat(int + (dec ? '.' + dec : ''));
    const suf = (m[4] || '') + (m[5] || '');
    const group = /\./.test(m[2]) || int >= 10000;
    const fmt = (v: number) => pre + v.toLocaleString('pt-BR', { minimumFractionDigits: dec.length, maximumFractionDigits: dec.length, useGrouping: group }) + suf;
    node.nodeValue = fmt(0);
    counters.set(parent, () => {
      counters.delete(parent);
      const t0 = win.performance.now();
      const dur = 1700;
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - k, 4);
        node.nodeValue = fmt(target * e);
        if (k < 1) win.requestAnimationFrame(tick); else node.nodeValue = fmt(target);
      };
      win.requestAnimationFrame(tick);
    });
  };

  const tag = () => {
    const els = Array.from(doc.querySelectorAll<HTMLElement>(REVEAL_SEL));
    const seen = new Map<Element, number>();
    els.forEach((el) => {
      if (el.hasAttribute('data-r') || el.closest('[data-nofx]')) return;
      const cs = win.getComputedStyle(el);
      if (cs.position === 'fixed' || cs.position === 'sticky') return;
      if (cs.animationName && cs.animationName !== 'none') return;
      if (el.closest('[data-r]') && !el.matches('.chip,h2,h3')) return;
      const parent = el.parentElement as Element;
      const idx = seen.get(parent) || 0;
      seen.set(parent, idx + 1);
      const siblings = parent ? parent.children.length : 1;
      let kind = 'up';
      if (/^H[23]$/.test(el.tagName) || el.matches('.chip')) kind = 'up';
      else if (cs.display === 'grid' || (parent && win.getComputedStyle(parent).display === 'grid')) {
        kind = siblings === 2 ? (idx === 0 ? 'left' : 'right') : idx % 2 ? 'flip' : 'zoom';
      } else if (el.matches('.rv') && siblings === 2) kind = idx === 0 ? 'left' : 'right';
      el.setAttribute('data-r', kind);
      el.style.setProperty('--d', `${Math.min(idx, 6) * 90}ms`);
      io.observe(el);
    });
    // contadores
    const walker = doc.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    nodes.forEach((n) => {
      const p = n.parentElement;
      if (!p || p.hasAttribute('data-cnt') || p.closest('[data-nocount],script,style,button,input')) return;
      if (!NUM.test((n.nodeValue || '').trim())) return;
      if (parseFloat(win.getComputedStyle(p).fontSize) < 26) return;
      p.setAttribute('data-cnt', '1');
      countUp(n, p);
      if (!p.hasAttribute('data-r')) io.observe(p);
    });
  };

  tag();
  let mo: MutationObserver | null = null;
  let moT = 0;
  const watch = doc.getElementById('r');
  if (watch) {
    mo = new (win as any).MutationObserver(() => { win.clearTimeout(moT); moT = win.setTimeout(tag, 120); });
    (mo as MutationObserver).observe(watch, { childList: true, subtree: true });
    cleanups.push(() => { mo?.disconnect(); });
  }

  /* ---------- barra de progresso, brilho do mouse ---------- */
  const bar = mk('fx-bar');
  const onScroll = () => {
    const h = Math.max(1, root.scrollHeight - win.innerHeight);
    const y = win.scrollY;
    bar.style.transform = `scaleX(${Math.min(1, y / h)})`;
    doc.querySelectorAll<HTMLElement>('.vis,.obj,.hero-art,[data-par]').forEach((el) => {
      const r = el.getBoundingClientRect();
      const c = r.top + r.height / 2 - win.innerHeight / 2;
      el.style.translate = `0 ${(-c * 0.07).toFixed(1)}px`;
    });
  };
  win.addEventListener('scroll', onScroll, { passive: true });
  cleanups.push(() => win.removeEventListener('scroll', onScroll));
  onScroll();

  const glow = mk('fx-glow');
  let gx = 0, gy = 0, tx = 0, ty = 0, raf = 0;
  const loop = () => {
    gx += (tx - gx) * 0.14; gy += (ty - gy) * 0.14;
    glow.style.transform = `translate(${gx}px,${gy}px)`;
    raf = win.requestAnimationFrame(loop);
  };

  /* ---------- mouse: glow, paralaxe, inclinação, ímã ---------- */
  let tilted: HTMLElement | null = null;
  const resetTilt = (el: HTMLElement) => { el.style.transform = ''; el.style.transition = ''; };
  const onMove = (ev: PointerEvent) => {
    tx = ev.clientX; ty = ev.clientY;
    glow.classList.add('on');
    const W = win.innerWidth, H = win.innerHeight;
    const nx = (ev.clientX / W - 0.5) * 2, ny = (ev.clientY / H - 0.5) * 2;
    doc.querySelectorAll<HTMLElement>('.fl,.flr,.sp').forEach((el, i) => {
      const k = 10 + (i % 4) * 7;
      el.style.translate = `${(-nx * k).toFixed(1)}px ${(-ny * k).toFixed(1)}px`;
    });
    const t = ev.target as HTMLElement;
    if (opts.tilt) {
      const card = t.closest?.('.lift,.card,.bx') as HTMLElement | null;
      if (tilted && tilted !== card) { resetTilt(tilted); tilted = null; }
      if (card && !card.closest('[data-notilt]')) {
        const r = card.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width - 0.5, py = (ev.clientY - r.top) / r.height - 0.5;
        card.style.transition = 'transform .12s ease-out';
        card.style.transform = `perspective(900px) rotateX(${(-py * 9).toFixed(2)}deg) rotateY(${(px * 11).toFixed(2)}deg) translateY(-6px) scale(1.015)`;
        tilted = card;
      }
    }
    const mg = t.closest?.('.btn,.pill,.b') as HTMLElement | null;
    doc.querySelectorAll<HTMLElement>('[data-mag]').forEach((el) => { if (el !== mg) { el.style.translate = ''; el.removeAttribute('data-mag'); } });
    if (mg) {
      const r = mg.getBoundingClientRect();
      mg.setAttribute('data-mag', '1');
      mg.style.translate = `${((ev.clientX - (r.left + r.width / 2)) * 0.22).toFixed(1)}px ${((ev.clientY - (r.top + r.height / 2)) * 0.3).toFixed(1)}px`;
    }
  };
  const onLeave = () => { glow.classList.remove('on'); if (tilted) { resetTilt(tilted); tilted = null; } };
  if (fine && !reduce) {
    doc.addEventListener('pointermove', onMove);
    doc.addEventListener('pointerleave', onLeave);
    raf = win.requestAnimationFrame(loop);
    cleanups.push(() => { doc.removeEventListener('pointermove', onMove); doc.removeEventListener('pointerleave', onLeave); win.cancelAnimationFrame(raf); });
  }

  /* ---------- confete nos cliques ---------- */
  const onClick = (ev: MouseEvent) => {
    const t = (ev.target as HTMLElement).closest?.('.btn,.pill,.b,button');
    if (!t || reduce) return;
    const cs = win.getComputedStyle(root);
    const cols = [cs.getPropertyValue('--p'), cs.getPropertyValue('--s'), '#ffffff', '#ffd23f'].map((c) => c.trim() || '#7e3bed');
    for (let i = 0; i < 18; i++) {
      const p = doc.createElement('i');
      p.className = 'fx-conf';
      p.style.background = cols[i % cols.length];
      p.style.left = ev.clientX + 'px';
      p.style.top = ev.clientY + 'px';
      body.appendChild(p);
      const a = Math.random() * Math.PI * 2, v = 70 + Math.random() * 110;
      const anim = p.animate([
        { transform: 'translate(0,0) rotate(0)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * v}px,${Math.sin(a) * v - 40}px) rotate(${Math.random() * 540}deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${Math.cos(a) * v * 1.2}px,${Math.sin(a) * v + 90}px) rotate(${Math.random() * 900}deg)`, opacity: 0 },
      ], { duration: 900 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.3,1)' });
      anim.onfinish = () => p.remove();
    }
  };
  doc.addEventListener('click', onClick, true);
  cleanups.push(() => doc.removeEventListener('click', onClick, true));

  /* ---------- cortina de entrada ---------- */
  const start = () => {
    ready = true;
    root.classList.remove('fx-wait');
    queue.forEach((el) => reveal(el));
    queue.clear();
  };
  if (opts.intro && !reduce) {
    const letters = (opts.name || 'Seu site').split('').map((c, i) => `<span style="animation-delay:${(i * 45)}ms">${c === ' ' ? '&nbsp;' : c.replace(/</g, '&lt;')}</span>`).join('');
    const cur = mk('fx-cur', `<div class="p1"></div><div class="p2"></div><div class="t">${letters}<i></i></div>`);
    later(() => cur.classList.add('out'), 1250);
    later(start, 1500);
    later(() => cur.remove(), 2400);
  } else {
    start();
  }
  // segurança: nunca deixar a página congelada
  later(() => { if (!ready) start(); }, 3000);

  return () => {
    timers.forEach((t) => win.clearTimeout(t));
    cleanups.forEach((f) => { try { f(); } catch { /* iframe já descartado */ } });
  };
}
