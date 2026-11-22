// Mede detalhes finos da referência: transform final da arte do hero e o início/sentido do offset-path.
import { chromium } from 'playwright';
const url = process.argv[2];
const browser = await chromium.launch({ channel: 'chrome' });
for (const motion of ['no-preference', 'reduce']) {
  for (const [w, h] of [[1440, 900], [390, 844], [1000, 800]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: motion });
    const page = await ctx.newPage();
    await page.goto(url);
    await page.waitForTimeout(1300);
    const r = await page.evaluate(() => {
      const art = document.querySelector('.hero-art');
      const orb = document.querySelector('.orbital:not(.back)');
      const res = { artTransform: getComputedStyle(art).transform, artRect: art.getBoundingClientRect().toJSON() };
      // Réplica do ::after para ler a posição no caminho (pseudo-elementos não têm getBoundingClientRect).
      const saved = orb.style.transform;
      orb.style.transform = 'none';
      const o = orb.getBoundingClientRect();
      const d = document.createElement('div');
      Object.assign(d.style, { position: 'absolute', left: 0, top: 0, width: '8px', height: '8px', offsetPath: 'ellipse(50% 50% at 50% 50%)' });
      orb.append(d);
      res.path = [0, 12.5, 25, 50, 75].map((p) => {
        d.style.offsetDistance = p + '%';
        const b = d.getBoundingClientRect();
        return [p, +(b.x + 4 - o.x).toFixed(1), +(b.y + 4 - o.y).toFixed(1)];
      });
      res.orbBox = [o.width, o.height];
      d.remove();
      orb.style.transform = saved;
      return res;
    });
    console.log(motion, w, JSON.stringify(r));
    await ctx.close();
  }
}
await browser.close();

