/**
 * Pixel e leads do CRM <Code> Labs.
 * - Visitas e cliques só são registrados se o visitante aceitou os cookies de ESTATÍSTICAS.
 * - Sem nome, e-mail ou IP. O identificador da visita fica só na aba (sessionStorage).
 * - O lead (pedido de orçamento) é enviado porque a própria pessoa pediu o orçamento.
 */
import { SITE } from './config';
import { CONSENT_STORAGE_KEY } from '../ConsentManager';

const conf = () => (SITE.crm && SITE.crm.url && SITE.crm.anonKey ? SITE.crm : null);

function analyticsAllowed(): boolean {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return !!raw && JSON.parse(raw)?.categories?.analytics === true;
  } catch { return false; }
}

function session(): string {
  try {
    let s = window.sessionStorage.getItem('cl_sid');
    if (!s) { s = Math.random().toString(36).slice(2) + Date.now().toString(36); window.sessionStorage.setItem('cl_sid', s); }
    return s;
  } catch { return 'anon'; }
}

function post(table: 'events' | 'leads', body: Record<string, unknown>) {
  const c = conf();
  if (!c) return;
  try {
    fetch(`${c.url.replace(/\/+$/, '')}/rest/v1/${table}`, {
      method: 'POST', keepalive: true,
      headers: { apikey: c.anonKey, Authorization: `Bearer ${c.anonKey}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(body),
    }).catch(() => undefined);
  } catch { /* sem rede */ }
}

let viewSent = false;
export function trackEvent(kind: string, page: string, meta?: Record<string, unknown>) {
  if (!conf() || !analyticsAllowed()) return;
  if (kind !== 'view' && !viewSent) { viewSent = true; post('events', { kind: 'view', page, session: session(), meta: null }); }
  if (kind === 'view') viewSent = true;
  post('events', { kind, page, session: session(), meta: meta || null });
}

export type LeadPayload = { empresa: string; contato?: string; whatsapp?: string; interesse?: string; origem: 'estudio' | 'orcamento' | 'quiz'; resumo?: string; respostas?: { k: string; v: string }[]; cores?: string[]; modelo?: string };
const sent = new Set<string>();
export function trackLead(l: LeadPayload) {
  if (!conf()) return;
  const key = `${l.origem}:${l.empresa}:${l.resumo || ''}`;
  if (sent.has(key)) return;
  sent.add(key);
  post('leads', { empresa: l.empresa, contato: l.contato || null, whatsapp: l.whatsapp || null, interesse: l.interesse || null, origem: l.origem, resumo: l.resumo || null, dados: { respostas: l.respostas || [], cores: l.cores || [], modelo: l.modelo || null } });
  trackEvent('lead', l.origem === 'estudio' ? 'estudio' : 'home');
}

const SKIP = /cookie|aceitar|recusar|personalizar|privacidade|termos/i;
/** Liga o contador de cliques (um único ouvinte para o site todo). */
export function startClickTracking(getPage: () => string): () => void {
  if (!conf()) return () => undefined;
  const on = (e: MouseEvent) => {
    const el = (e.target as HTMLElement | null)?.closest?.('button,a') as HTMLElement | null;
    if (!el) return;
    const first = ((el as HTMLElement).innerText || el.textContent || '').split('\n').map((x) => x.trim()).find(Boolean) || '';
    const label = (el.getAttribute('aria-label') || first).replace(/\s+/g, ' ').replace(/[✦↗→✕]/g, '').trim().slice(0, 60);
    if (!label || SKIP.test(label)) return;
    trackEvent('click', getPage(), { label });
  };
  document.addEventListener('click', on, true);
  return () => document.removeEventListener('click', on, true);
}

/* ------------------------------------------------------------------
 * Qualidade da navegação: erros da página, cliques de frustração
 * (vários cliques seguidos no mesmo lugar) e até onde a pessoa rolou.
 * Também só conta com consentimento de estatísticas (passa pelo trackEvent).
 * ------------------------------------------------------------------ */
export function startQualityTracking(getPage: () => string): () => void {
  if (!conf() || typeof window === 'undefined') return () => undefined;
  let errors = 0;
  const onErr = (msg: string) => { if (errors++ < 5) trackEvent('error', getPage(), { msg: String(msg || 'Erro').slice(0, 160) }); };
  const e1 = (e: ErrorEvent) => onErr(e.message);
  const e2 = (e: PromiseRejectionEvent) => onErr((e.reason && (e.reason.message || String(e.reason))) || 'Promise rejeitada');
  window.addEventListener('error', e1);
  window.addEventListener('unhandledrejection', e2);

  let clicks: { t: number; x: number; y: number }[] = [];
  let lastRage = 0;
  const onClick = (e: MouseEvent) => {
    const now = Date.now();
    clicks = clicks.filter((c) => now - c.t < 800 && Math.hypot(c.x - e.clientX, c.y - e.clientY) < 30);
    clicks.push({ t: now, x: e.clientX, y: e.clientY });
    if (clicks.length >= 3 && now - lastRage > 3000) {
      lastRage = now; clicks = [];
      const el = e.target as HTMLElement | null;
      const label = ((el?.closest?.('button,a') as HTMLElement | null)?.innerText || el?.innerText || '').split('\n')[0].trim().slice(0, 60) || 'Área sem texto';
      trackEvent('rage', getPage(), { label });
    }
  };
  document.addEventListener('click', onClick, true);

  const sent = new Set<string>();
  const onScroll = (e: Event) => {
    const t = e.target as HTMLElement | Document;
    const el = (t === document || !(t as HTMLElement).scrollHeight) ? document.scrollingElement || document.documentElement : (t as HTMLElement);
    const max = el.scrollHeight - el.clientHeight;
    if (max < 200) return;
    const pctNow = Math.round(((el.scrollTop + 1) / max) * 100);
    for (const d of [25, 50, 75, 100]) {
      const k = getPage() + ':' + d;
      if (pctNow >= d - 2 && !sent.has(k)) { sent.add(k); trackEvent('scroll', getPage(), { depth: d }); }
    }
  };
  document.addEventListener('scroll', onScroll, true);
  return () => { window.removeEventListener('error', e1); window.removeEventListener('unhandledrejection', e2); document.removeEventListener('click', onClick, true); document.removeEventListener('scroll', onScroll, true); };
}

/* ------------------------------------------------------------------
 * Pesquisa de satisfação: aparece uma vez por visitante, depois de
 * 45 segundos no site ou na segunda página visitada.
 * A nota é dada pela própria pessoa, sem nome nem contato.
 * ------------------------------------------------------------------ */
const SAT_KEY = 'cl_satisfacao_v1';
let satTimer = 0;
let pagesSeen = 0;
export function satisfactionTick(page: string) {
  if (!conf() || typeof window === 'undefined' || page === 'previa') return;
  try { if (window.localStorage.getItem(SAT_KEY)) return; } catch { return; }
  pagesSeen++;
  window.clearTimeout(satTimer);
  if (pagesSeen >= 2) satTimer = window.setTimeout(() => showSatisfaction(page), 4000);
  else satTimer = window.setTimeout(() => showSatisfaction(page), 45000);
}
function showSatisfaction(page: string) {
  if (document.getElementById('cl-sat')) return;
  try { if (window.localStorage.getItem(SAT_KEY)) return; window.localStorage.setItem(SAT_KEY, 'visto'); } catch { return; }
  const faces = [['😞', 'Muito ruim'], ['🙁', 'Ruim'], ['😐', 'Ok'], ['🙂', 'Bom'], ['😍', 'Ótimo']];
  const box = document.createElement('div');
  box.id = 'cl-sat';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-label', 'Pesquisa de satisfação');
  box.innerHTML = `<style>#cl-sat{position:fixed;right:20px;bottom:20px;z-index:2147483000;width:min(340px,calc(100vw - 32px));background:#15131c;color:#f3efe9;border-radius:18px;padding:18px 18px 16px;font:500 14px/1.45 Poppins,system-ui,sans-serif;box-shadow:0 24px 60px -18px rgba(0,0,0,.55);animation:clsat .45s cubic-bezier(.2,.9,.3,1.2) both}@keyframes clsat{from{opacity:0;transform:translateY(16px) scale(.96)}}#cl-sat b{display:block;font-size:15px;margin-bottom:10px;padding-right:24px}#cl-sat .x{position:absolute;right:10px;top:10px;width:28px;height:28px;border:0;border-radius:8px;background:transparent;color:#a39fb3;cursor:pointer;font-size:18px}#cl-sat .f{display:flex;justify-content:space-between;gap:6px}#cl-sat .f button{flex:1;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);border-radius:12px;padding:8px 0;font-size:24px;cursor:pointer;transition:.15s}#cl-sat .f button:hover{transform:translateY(-2px);border-color:#c6ff34}#cl-sat textarea{width:100%;box-sizing:border-box;margin-top:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:10px;color:inherit;font:inherit;padding:8px 10px;min-height:64px;resize:vertical}#cl-sat .s{margin-top:10px;width:100%;border:0;border-radius:10px;padding:10px;background:#c6ff34;color:#111;font:700 14px Poppins,system-ui,sans-serif;cursor:pointer}#cl-sat small{display:block;color:#a39fb3;margin-top:8px;font-size:11px}</style>
<button class="x" aria-label="Fechar">×</button><b>Você encontrou o que procurava?</b><div class="f">${faces.map((f, i) => `<button data-n="${i + 1}" title="${f[1]}" aria-label="${f[1]}">${f[0]}</button>`).join('')}</div><small>Resposta anônima. Ajuda a gente a melhorar o site.</small>`;
  document.body.appendChild(box);
  const close = () => box.remove();
  (box.querySelector('.x') as HTMLButtonElement).onclick = close;
  box.querySelectorAll<HTMLButtonElement>('.f button').forEach((btn) => {
    btn.onclick = () => {
      const score = Number(btn.dataset.n);
      const send = (comment?: string) => post('events', { kind: 'satisfaction', page, session: analyticsAllowed() ? session() : 'anonimo', meta: comment ? { score, comment: comment.slice(0, 400) } : { score } });
      box.querySelector('.f')!.remove();
      box.querySelector('small')!.remove();
      (box.querySelector('b') as HTMLElement).textContent = score >= 4 ? 'Que bom! Quer contar o que mais gostou?' : 'Poxa. O que podemos melhorar?';
      const ta = document.createElement('textarea'); ta.placeholder = 'Opcional'; ta.maxLength = 400;
      const ok = document.createElement('button'); ok.className = 's'; ok.textContent = 'Enviar';
      box.append(ta, ok);
      ok.onclick = () => { send(ta.value.trim() || undefined); box.innerHTML = '<b style="margin:0">Obrigado pela resposta! 💜</b>'; setTimeout(close, 1800); };
      (box.querySelector('.x') as HTMLButtonElement).onclick = () => { send(); close(); };
    };
  });
}
