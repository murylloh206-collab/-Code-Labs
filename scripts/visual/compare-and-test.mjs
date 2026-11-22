import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'scripts', 'visual', 'out');
fs.mkdirSync(OUT, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const cleanUrl = (req.url || '/').split('?')[0];
      if (cleanUrl === '/reference.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fs.readFileSync(path.join(ROOT, 'scripts', 'visual', 'reference.html')));
        return;
      }
      let filePath = path.join(DIST, cleanUrl === '/' ? 'index.html' : cleanUrl);
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(DIST, 'index.html');
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(filePath));
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

async function waitImagesAndFonts(page) {
  await page.evaluate(async () => {
    await Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 3000))]);
    const imgs = [...document.images];
    await Promise.race([
      Promise.all(
        imgs.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((r) => {
                img.addEventListener('load', r, { once: true });
                img.addEventListener('error', r, { once: true });
              }),
        ),
      ),
      new Promise((r) => setTimeout(r, 4000)),
    ]);
  });
}

async function captureShots(browser, url, prefix, width, height, reducedMotion = 'no-preference') {
  const ctx = await browser.newContext({
    viewport: { width, height },
    reducedMotion,
    hasTouch: width < 600,
    isMobile: width < 600,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console.error: ${m.text()}`);
  });

  await page.goto(url, { waitUntil: 'load', timeout: 20000 });
  await waitImagesAndFonts(page);
  await page.waitForTimeout(1000);

  // Topo / Hero
  await page.screenshot({ path: path.join(OUT, `${prefix}-${width}-top.png`) });

  // Rola passo a passo para disparar todos os IntersectionObservers antes do fullPage
  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= docHeight; y += Math.floor(height * 0.7)) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(220);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  // Captura fullPage
  await page.screenshot({ path: path.join(OUT, `${prefix}-${width}-full.png`), fullPage: true });

  // Captura seções específicas em 1440x900 para inspeção fina
  if (width === 1440 && reducedMotion === 'no-preference') {
    for (const id of ['solucoes', 'crm', 'sobre', 'processo', 'orcamento']) {
      await page.evaluate((secId) => {
        const el = document.getElementById(secId);
        if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 92);
      }, id);
      await page.waitForTimeout(450);
      await page.screenshot({ path: path.join(OUT, `${prefix}-${width}-${id}.png`) });
    }
  }

  const metrics = await page.evaluate(() => ({
    title: document.title,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
    brokenImages: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).length,
  }));

  await ctx.close();
  return { metrics, errors };
}

async function testMotionAndFlows(browser, baseUrl) {
  const report = { desktopMotion: {}, mobileMotion: {}, reducedMotion: {}, reloadCheck: {}, flows: {} };

  // 1. Desktop motion + gravação de vídeo curto (mouse parado)
  const videoCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference',
    recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
  });
  const page = await videoCtx.newPage();
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));

  await page.goto(baseUrl, { waitUntil: 'load', timeout: 20000 });
  await waitImagesAndFonts(page);
  await page.waitForTimeout(900);

  const sampleTransforms = async () => {
    const out = [];
    for (let i = 0; i < 4; i++) {
      const s = await page.evaluate(() => {
        const g = (id) => {
          const el = document.querySelector(`[data-testid="${id}"]`);
          return el ? getComputedStyle(el).transform : 'missing';
        };
        return { sculpture: g('sculpture'), label: g('floating-label'), ticker: g('band-track') };
      });
      out.push(s);
      await page.waitForTimeout(450);
    }
    return out;
  };

  const samples = await sampleTransforms();
  const changed = (k) => new Set(samples.map((s) => s[k])).size > 1;
  report.desktopMotion = {
    sculptureMoving: changed('sculpture'),
    labelMoving: changed('label'),
    tickerMoving: changed('ticker'),
  };

  // Testa pausa do ticker no hover (desktop)
  const band = page.getByTestId('blue-band');
  await band.hover();
  await page.waitForTimeout(150);
  const t1 = await page.evaluate(() => getComputedStyle(document.querySelector('[data-testid="band-track"]')).transform);
  await page.waitForTimeout(500);
  const t2 = await page.evaluate(() => getComputedStyle(document.querySelector('[data-testid="band-track"]')).transform);
  report.desktopMotion.tickerPausesOnHover = t1 === t2;

  // Move mouse para fora e testa se volta a andar
  await page.mouse.move(10, 10);
  await page.waitForTimeout(500);
  const t3 = await page.evaluate(() => getComputedStyle(document.querySelector('[data-testid="band-track"]')).transform);
  report.desktopMotion.tickerResumesAfterHover = t3 !== t2;

  // Reload check: garante que animações continuam funcionando após reload
  await page.reload({ waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(900);
  const reloadSamples = await sampleTransforms();
  report.reloadCheck = {
    sculptureMovingAfterReload: new Set(reloadSamples.map((s) => s.sculpture)).size > 1,
    tickerMovingAfterReload: new Set(reloadSamples.map((s) => s.ticker)).size > 1,
  };

  // Fluxos interativos (Desktop)
  // a) CRM Tabs + teclado
  await page.getByTestId('tab-clientes').click();
  const clientesTitle = await page.getByTestId('crm-panel').textContent();
  await page.getByTestId('tab-clientes').press('ArrowRight');
  const rotinasTitle = await page.getByTestId('crm-panel').textContent();
  await page.getByTestId('tab-vendas').click();
  report.flows.crmTabs = {
    clientesOk: clientesTitle?.includes('Relacionamentos com contexto.'),
    keyboardRightToRotinasOk: rotinasTitle?.includes('Informações que seguem o fluxo.'),
  };

  // b) Card "Quero simplificar minha operação" pré-seleciona serviço e rola até briefing
  await page.getByText('Quero simplificar minha operação').click();
  await page.waitForTimeout(300);
  const autoPressed = await page.getByTestId('choice-auto').getAttribute('aria-pressed');
  report.flows.chooseServiceLink = autoPressed === 'true';

  // c) Briefing: passo 1 -> passo 2 -> erro validação -> preencher -> voltar e conferir preservação -> passo 3 -> copiar -> baixar
  await page.getByTestId('brief-next').click();
  await page.getByTestId('brief-review').click();
  const errName = await page.getByTestId('brief-error').textContent();
  await page.getByTestId('brief-name').fill('Muryllo Teste');
  await page.getByTestId('brief-company').fill('Empresa Demo');
  await page.getByTestId('brief-goal').fill('Curto');
  await page.getByTestId('brief-review').click();
  const errGoal = await page.getByTestId('brief-error').textContent();

  await page.getByTestId('brief-goal').fill('Quero automatizar o atendimento e integrar o CRM da empresa.');
  // Voltar ao passo 1 e retornar ao passo 2 para conferir preservação dos dados
  await page.getByTestId('brief-back').click();
  await page.getByTestId('brief-next').click();
  const preservedName = await page.getByTestId('brief-name').inputValue();
  const preservedGoal = await page.getByTestId('brief-goal').inputValue();

  await page.getByTestId('brief-review').click();
  const reviewText = await page.getByTestId('brief-card').textContent();

  // Download do briefing (sem fingir envio)
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByTestId('brief-finish').click(),
  ]);
  const toastAfterDownload = await page.getByTestId('toast').textContent();

  report.flows.brief = {
    errNameOk: errName?.includes('Preencha seu nome'),
    errGoalOk: errGoal?.includes('pelo menos 15 caracteres'),
    preservedDataOk: preservedName === 'Muryllo Teste' && preservedGoal.includes('automatizar'),
    reviewSummaryOk: reviewText?.includes('Automação ou integração') && reviewText?.includes('Muryllo Teste · Empresa Demo'),
    downloadFilename: download.suggestedFilename(),
    toastTruthful: toastAfterDownload?.includes('Nenhum dado foi enviado'),
  };

  // d) FAQ
  await page.getByTestId('faq-0').click();
  const faqExpanded = await page.getByTestId('faq-0').getAttribute('aria-expanded');
  report.flows.faqToggle = faqExpanded === 'true';

  // e) Modal Privacidade
  await page.getByTestId('privacy-open').click();
  const modalVisible = await page.getByTestId('privacy-dialog').isVisible();
  await page.getByTestId('privacy-close').click();
  const modalClosed = !(await page.getByTestId('privacy-dialog').isVisible());
  report.flows.privacyModal = { opened: modalVisible, closed: modalClosed };
  report.flows.consoleErrors = consoleErrors;

  const videoPath = await page.video()?.path();
  await videoCtx.close();
  if (videoPath && fs.existsSync(videoPath)) {
    fs.renameSync(videoPath, path.join(OUT, 'desktop-motion-1440x900.webm'));
  }

  // 2. Mobile motion + menu mobile (390x844 emulado)
  const mobCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'no-preference',
    hasTouch: true,
    isMobile: true,
  });
  const mPage = await mobCtx.newPage();
  await mPage.goto(baseUrl, { waitUntil: 'load', timeout: 20000 });
  await mPage.waitForTimeout(900);
  const m1 = await mPage.evaluate(() => getComputedStyle(document.querySelector('[data-testid="sculpture"]')).transform);
  await mPage.waitForTimeout(600);
  const m2 = await mPage.evaluate(() => getComputedStyle(document.querySelector('[data-testid="sculpture"]')).transform);
  await mPage.getByTestId('menu-toggle').click();
  const menuOpen = await mPage.getByTestId('mobile-menu').isVisible();
  await mPage.keyboard.press('Escape');
  const menuClosed = !(await mPage.getByTestId('mobile-menu').isVisible());
  report.mobileMotion = { sculptureMoving: m1 !== m2, menuOpen, menuClosed };
  await mobCtx.close();

  // 3. Reduced motion (1440x900)
  const redCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  });
  const rPage = await redCtx.newPage();
  await rPage.goto(baseUrl, { waitUntil: 'load', timeout: 20000 });
  await rPage.waitForTimeout(500);
  const r1 = await rPage.evaluate(() => ({
    s: getComputedStyle(document.querySelector('[data-testid="sculpture"]')).transform,
    t: getComputedStyle(document.querySelector('[data-testid="band-track"]')).transform,
    h1: document.querySelector('[data-testid="hero-h1"]')?.textContent,
  }));
  await rPage.waitForTimeout(700);
  const r2 = await rPage.evaluate(() => ({
    s: getComputedStyle(document.querySelector('[data-testid="sculpture"]')).transform,
    t: getComputedStyle(document.querySelector('[data-testid="band-track"]')).transform,
  }));
  report.reducedMotion = {
    sculptureStatic: r1.s === r2.s,
    tickerStatic: r1.t === r2.t,
    contentReadable: r1.h1?.includes('Código que'),
  };
  await redCtx.close();

  return report;
}

const { server, baseUrl } = await startServer();
console.error('Server at', baseUrl);
const browser = await chromium.launch({ channel: 'chrome' });
try {
  console.error('1/5 ref1440...');
  const ref1440 = await captureShots(browser, `${baseUrl}/reference.html`, 'ref', 1440, 900);
  console.error('2/5 app1440...');
  const app1440 = await captureShots(browser, baseUrl, 'app', 1440, 900);
  console.error('3/5 ref390...');
  const ref390 = await captureShots(browser, `${baseUrl}/reference.html`, 'ref', 390, 844);
  console.error('4/5 app390...');
  const app390 = await captureShots(browser, baseUrl, 'app', 390, 844);
  console.error('5/5 flows & motion...');
  const flows = await testMotionAndFlows(browser, baseUrl);
  console.log(JSON.stringify({ ref1440, app1440, ref390, app390, flows }, null, 2));
} finally {
  await browser.close();
  server.close();
}

