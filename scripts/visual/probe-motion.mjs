// Investiga o movimento de uma página (referência ou implementação).
// Uso: node scripts/visual/probe-motion.mjs <url> [system|no-preference|reduce] [largura] [altura]
import { chromium } from 'playwright';

const [url, motion = 'system', w = '1440', h = '900'] = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chrome', headless: motion !== 'system' });
const context = await browser.newContext({
  viewport: { width: Number(w), height: Number(h) },
  reducedMotion: motion === 'system' ? null : motion,
  hasTouch: Number(w) < 600,
  isMobile: Number(w) < 600,
});
const page = await context.newPage();
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(1500);
const info = await page.evaluate(async () => {
  const mq = (q) => matchMedia(q).matches;
  const out = {
    prefersReduce: mq('(prefers-reduced-motion: reduce)'),
    hoverHover: mq('(hover: hover)'),
    pointerFine: mq('(pointer: fine)'),
    animations: document.getAnimations().map((a) => ({
      target: a.effect?.target?.className || a.effect?.target?.tagName || '?',
      name: a.animationName || a.id || 'waapi',
      playState: a.playState,
      duration: a.effect?.getTiming?.().duration,
      delay: a.effect?.getTiming?.().delay,
      easing: a.effect?.getTiming?.().easing,
      iterations: a.effect?.getTiming?.().iterations,
    })),
  };
  // Amostra transformações reais ao longo do tempo para provar que algo se move.
  const pick = (sel) => document.querySelector(sel);
  const targets = {
    sculpture: pick('.sculpture') || pick('[data-testid="sculpture"]'),
    label: pick('.floating-label') || pick('[data-testid="floating-label"]'),
    ticker: pick('.band-track') || pick('[data-testid="band-track"]'),
  };
  const samples = [];
  for (let i = 0; i < 4; i++) {
    const row = {};
    for (const [k, el] of Object.entries(targets)) row[k] = el ? getComputedStyle(el).transform : 'n/a';
    samples.push(row);
    await new Promise((r) => setTimeout(r, 700));
  }
  out.samples = samples;
  return out;
});
console.log(JSON.stringify(info, null, 2));
await browser.close();

