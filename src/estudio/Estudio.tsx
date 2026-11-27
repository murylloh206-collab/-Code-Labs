import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { SiteFrame } from './Frame';
import { TEMPLATES, TYPES, byId, forType } from './templates';
import { DEFAULT_CFG, Icon, type Cfg, type TypeId } from './templates/kit';
import { extractPalette, hexToHsl, hslToHex } from './color';
import { trackEvent, trackLead } from '../site/track';
import { canShareFile, captureFrame, downloadBlob, fileToDataUrl, shareFile, waLink } from './capture';
import { SITE } from '../site/config';

export const STORE_KEY = 'codelabs-estudio-v1';

type Device = 'phone' | 'tablet' | 'desktop';
const DEVICES: Record<Device, { w: number; h: number; label: string; icon: string }> = {
  phone: { w: 390, h: 844, label: 'Celular', icon: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2' },
  tablet: { w: 820, h: 1180, label: 'Tablet', icon: 'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2' },
  desktop: { w: 1440, h: 900, label: 'Computador', icon: 'M3 4h18v12H3zM8 20h8M12 16v4' },
};

const STEPS = ['Seu negócio', 'O que você precisa', 'Modelo e estilo', 'Sua cara', 'Pronto!'];
const PRESETS = ['#7e3bed', '#c6ff34', '#2038ff', '#ff8a1f', '#e63946', '#1f6f78', '#f5b900', '#111114'];

export function loadCfg(): Cfg {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return { ...DEFAULT_CFG, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_CFG, colors: [TEMPLATES[0].color] };
}

function saveCfg(cfg: Cfg) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(cfg));
  } catch {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ ...cfg, photo: null }));
    } catch {}
  }
}

const slug = (s: string) =>
  (s || 'seunegocio').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 22) || 'seunegocio';

const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..125,400..900&display=swap");
.es{font-family:'Archivo',system-ui,sans-serif;background:#0c0b0f;color:#f2f0f6;min-height:100vh;display:grid;grid-template-columns:400px 1fr;-webkit-font-smoothing:antialiased}
.es *{box-sizing:border-box}.es button,.es input{font-family:inherit;color:inherit}.es button{cursor:pointer}
.es .side{border-right:1px solid #24222b;display:flex;flex-direction:column;height:100vh;position:sticky;top:0;background:#111015}
.es .scroll{flex:1;overflow-y:auto;padding:0 24px 24px}
.es .wide{font-stretch:120%}
.es .steps{display:flex;gap:6px;padding:16px 24px}
.es .st{flex:1;height:5px;border-radius:99px;background:#2a2832;border:0;padding:0;transition:background-color .3s}
.es .st.on{background:#7e3bed}.es .st.done{background:#a77bff}
.es .lbl{font-size:12px;font-weight:700;letter-spacing:.12em;color:#a77bff}
.es h2{font-stretch:115%;font-weight:900;font-size:28px;line-height:1.05;margin:8px 0 6px}
.es .hint{color:#a9a5b4;font-size:14px;line-height:1.5;margin:0 0 18px}
.es .fld{width:100%;background:#1a1920;border:1.5px solid #2c2a34;border-radius:14px;padding:14px;font-size:15px;outline:none;transition:border-color .2s}
.es .fld:focus{border-color:#7e3bed;box-shadow:0 0 0 4px rgba(126,59,237,.2)}
.es .flab{display:block;font-size:13px;font-weight:700;margin:14px 0 6px}
.es .opt{width:100%;text-align:left;display:flex;gap:14px;align-items:flex-start;background:#17161c;border:1.5px solid #2a2832;border-radius:18px;padding:16px;margin-bottom:10px;transition:border-color .2s,background-color .2s,transform .2s}
.es .opt:hover{transform:translateY(-2px);border-color:#4b3a74}
.es .opt.on{border-color:#7e3bed;background:#1e1730}
.es .oic{width:42px;height:42px;border-radius:12px;background:#24212d;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#c6ff34}
.es .opt.on .oic{background:#7e3bed;color:#fff}
.es .row{display:flex;gap:10px;flex-wrap:wrap}
.es .chip{border:1.5px solid #2c2a34;background:#17161c;border-radius:999px;padding:10px 16px;font-weight:600;font-size:14px;min-height:44px}
.es .chip.on{border-color:#7e3bed;background:#1e1730}
.es .sw{width:38px;height:38px;border-radius:50%;border:3px solid #111015;box-shadow:0 0 0 1.5px #3a3744;transition:transform .2s}
.es .sw.on{transform:scale(1.15);box-shadow:0 0 0 2px #fff}
.es .up{display:flex;align-items:center;gap:14px;border:1.5px dashed #3a3744;border-radius:16px;padding:14px;cursor:pointer;transition:border-color .2s}
.es .up:hover{border-color:#7e3bed}
.es .ai{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;border:0;border-radius:14px;padding:14px;font-weight:800;font-size:15px;color:#0c0b0f;background:linear-gradient(110deg,#c6ff34,#a77bff,#7e3bed,#c6ff34);background-size:300% 100%;animation:esg 6s linear infinite;min-height:50px}
.es .ai:disabled{opacity:.45;cursor:not-allowed;animation:none}
@keyframes esg{to{background-position:300% 0}}
@keyframes esspin{to{transform:rotate(360deg)}}
@keyframes esin{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes esscan{0%{top:0}100%{top:100%}}
.es .in{animation:esin .45s cubic-bezier(.2,.7,.2,1) both}
.es .foot{display:flex;gap:10px;padding:14px 24px 70px;border-top:1px solid #24222b}
.es .bt{border:0;border-radius:999px;padding:14px 20px;font-weight:800;font-size:15px;min-height:50px;transition:transform .2s,filter .2s}
.es .bt:hover{transform:translateY(-2px);filter:brightness(1.08)}
.es .main{display:flex;flex-direction:column;height:100vh;position:sticky;top:0;min-width:0;background:radial-gradient(ellipse 60% 50% at 50% 0%,rgba(126,59,237,.16),transparent 70%),#0c0b0f}
.es .bar{display:flex;align-items:center;justify-content:center;gap:6px;padding:14px;flex-wrap:wrap}
.es .tb{width:44px;height:44px;border-radius:12px;border:0;background:transparent;color:#cfcbd8;display:flex;align-items:center;justify-content:center;transition:background-color .2s,color .2s}
.es .tb:hover{background:#1d1b23}.es .tb.on{background:#f2f0f6;color:#0c0b0f}
.es .sep{width:1px;height:26px;background:#2c2a34;margin:0 8px}
.es .stage{flex:1;min-height:0;display:flex;align-items:flex-start;justify-content:center;overflow:hidden;padding:6px 20px 20px}
.es .ring{position:relative;width:170px;height:170px;border-radius:50%;background:conic-gradient(from 0deg,hsl(0 85% 52%),hsl(60 85% 52%),hsl(120 85% 45%),hsl(180 85% 45%),hsl(240 85% 58%),hsl(300 85% 52%),hsl(360 85% 52%));-webkit-mask:radial-gradient(circle,transparent 52%,#000 53%);mask:radial-gradient(circle,transparent 52%,#000 53%);touch-action:none;cursor:crosshair}
.es .mtabs{display:none}
.es .ov{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(6,5,9,.72);backdrop-filter:blur(8px);animation:esin .25s both}
.es .md{width:100%;max-width:520px;max-height:calc(100vh - 36px);overflow-y:auto;background:#15141a;border:1px solid #2c2a34;border-radius:24px;padding:24px}
@media (max-width:900px){
.es{grid-template-columns:1fr}
.es .side,.es .main{position:relative;height:auto;min-height:calc(100vh - 64px)}
.es .mtabs{display:flex;position:sticky;top:0;z-index:30;background:#0c0b0f;border-bottom:1px solid #24222b;padding:10px;gap:8px}
.es .mtabs button{flex:1;border:0;border-radius:12px;padding:12px;font-weight:800;background:#17161c;min-height:46px}
.es .mtabs button.on{background:#7e3bed;color:#fff}
.es .hide-m{display:none !important}
.es .side[data-tab="ver"],.es .main[data-tab="montar"]{display:none}
.es .stage{min-height:calc(100vh - 140px)}
}
`;

function HueRing({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [h, s, l] = hexToHsl(value);
  const pick = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    const deg = (Math.atan2(x, -y) * 180) / Math.PI;
    onChange(hslToHex((deg + 360) % 360, Math.max(55, s || 80), l > 85 || l < 15 ? 52 : l));
  };
  const a = ((h - 90) * Math.PI) / 180;
  return (
    <div style={{ position: 'relative', width: 170, height: 170 }}>
      <div
        ref={ref}
        className="ring"
        role="slider"
        aria-label="Anel de cores"
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(h)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') onChange(hslToHex((h + 8) % 360, Math.max(55, s), l));
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') onChange(hslToHex((h + 352) % 360, Math.max(55, s), l));
        }}
        onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); pick(e); }}
        onPointerMove={(e) => { if (e.buttons) pick(e); }}
      />
      <span style={{ position: 'absolute', left: 85 + Math.cos(a) * 70 - 11, top: 85 + Math.sin(a) * 70 - 11, width: 22, height: 22, borderRadius: '50%', border: '3px solid #fff', background: value, boxShadow: '0 2px 10px rgba(0,0,0,.5)', pointerEvents: 'none' }} />
      <span style={{ position: 'absolute', left: 45, top: 45, width: 80, height: 80, borderRadius: '50%', background: value, boxShadow: 'inset 0 0 0 3px rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: l > 60 ? '#111' : '#fff', pointerEvents: 'none' }}>{value.toUpperCase()}</span>
    </div>
  );
}

function CMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.67} viewBox="0 0 120 80" aria-hidden="true">
      <polygon points="34,14 34,28 16,40 34,52 34,66 0,46 0,34" fill="#a77bff" />
      <path d="M73 25 A18 18 0 1 0 73 55" fill="none" stroke="#fff" strokeWidth="13" />
      <polygon points="86,14 86,28 104,40 86,52 86,66 120,46 120,34" fill="#a77bff" />
    </svg>
  );
}

export default function Estudio() {
  const [cfg, setCfg] = useState<Cfg>(loadCfg);
  const [step, setStep] = useState(0);
  const [device, setDevice] = useState<Device>('desktop');
  const [nonce, setNonce] = useState(0);
  const [tab, setTab] = useState<'montar' | 'ver'>('montar');
  const [aiState, setAiState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [found, setFound] = useState<string[]>([]);
  const [modal, setModal] = useState(false);
  const [shot, setShot] = useState<{ blob: Blob | null; url: string | null; busy: boolean }>({ blob: null, url: null, busy: false });
  const [box, setBox] = useState({ w: 900, h: 700 });
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => saveCfg(cfg), [cfg]);
  useEffect(() => {
    document.title = 'Estúdio <Code> Labs — Seu site com a sua cara';
    if (window.innerWidth < 900) setDevice('phone');
  }, []);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth - 40, h: el.clientHeight - 26 }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [tab]);

  const up = useCallback((patch: Partial<Cfg>) => setCfg((c) => ({ ...c, ...patch })), []);
  const d = DEVICES[device];
  const bezel = device === 'desktop' ? 0 : device === 'phone' ? 12 : 16;
  const chrome = device === 'desktop' ? 40 : 0;
  const scale = Math.min(1, (box.w - bezel * 2) / d.w, device === 'desktop' ? 10 : (box.h - bezel * 2) / d.h);
  const frameH = device === 'desktop' ? Math.max(500, Math.round((box.h - chrome) / scale)) : d.h;
  const tpl = byId(cfg.template);
  const typeLabel = TYPES.find((t) => t.id === cfg.type)?.label || '';

  const chooseType = (t: TypeId) => {
    const first = forType(t)[0];
    up({ type: t, template: first.id, colors: aiState === 'done' || cfg.colors.length > 1 ? cfg.colors : [cfg.colors[0] || first.color] });
  };

  const onLogo = async (file?: File | null) => {
    if (!file) return;
    const url = await fileToDataUrl(file, 480, 'image/png');
    up({ logo: url });
    setAiState('idle');
    setFound([]);
  };
  const onPhoto = async (file?: File | null) => {
    if (!file) return;
    up({ photo: await fileToDataUrl(file, 1600, 'image/jpeg') });
  };
  const runAi = async () => {
    if (!cfg.logo) return;
    setAiState('busy');
    const [pal] = await Promise.all([extractPalette(cfg.logo, 4), new Promise((r) => setTimeout(r, 1500))]);
    setFound(pal);
    if (pal.length) up({ colors: pal.slice(0, 2) });
    setAiState('done');
  };

  const message = `Olá, <Code> Labs! Montei uma prévia no Estúdio do site de vocês e quero um orçamento.\n\nNegócio: ${cfg.name.trim() || 'a definir'}\nO que preciso: ${typeLabel}\nModelo: ${tpl.name} (${cfg.look})\nCor principal: ${cfg.colors[0]}\n${cfg.logo ? 'Já tenho logo.' : 'Ainda não tenho logo.'}\n\nVou mandar a imagem da prévia aqui na conversa.`;

  const openQuote = async () => {
    setModal(true);
    trackEvent('estudio_quote', 'estudio');
    trackLead({
      empresa: cfg.name.trim() || 'Sem nome (Estúdio)', interesse: typeLabel, origem: 'estudio', modelo: tpl.id, cores: cfg.colors,
      resumo: `Montou um site no Estúdio (modelo ${tpl.name}, estilo ${cfg.look}) e pediu orçamento.`,
      respostas: [{ k: 'Modelo escolhido', v: `${tpl.name} (${typeLabel})` }, { k: 'Estilo', v: cfg.look === 'escuro' ? 'Escuro e marcante' : 'Claro e leve' }, { k: 'Cor principal', v: cfg.colors[0] }, { k: 'Enviou logo', v: cfg.logo ? 'Sim' : 'Não' }, { k: 'Frase de destaque', v: cfg.slogan || '—' }],
    });
    if (shot.url) URL.revokeObjectURL(shot.url);
    setShot({ blob: null, url: null, busy: true });
    const f = frameRef.current;
    const blob = f ? await captureFrame(f, d.w, Math.min(d.h, 1000)) : null;
    setShot({ blob, url: blob ? URL.createObjectURL(blob) : null, busy: false });
  };
  const openNewTab = () => window.open(window.location.pathname + '#/previa', '_blank', 'noopener');
  const reset = () => {
    setCfg({ ...DEFAULT_CFG, colors: [TEMPLATES[0].color] });
    setStep(0);
    setAiState('idle');
    setFound([]);
  };

  const canNext = step !== 0 || cfg.name.trim().length > 0;
  const fileName = `site-${slug(cfg.name)}.png`;

  const panel = (
    <aside className="side" data-tab={tab}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 24px 0' }}>
        <CMark />
        <div><div className="wide" style={{ fontWeight: 900, fontSize: 16 }}>Estúdio &lt;Code&gt; Labs</div><div style={{ fontSize: 12, color: '#a9a5b4' }}>Seu site com a sua cara</div></div>
      </div>
      <div className="steps" role="tablist" aria-label="Etapas">
        {STEPS.map((s, i) => <button key={s} role="tab" aria-selected={i === step} aria-label={`Etapa ${i + 1}: ${s}`} className={'st' + (i === step ? ' on' : i < step ? ' done' : '')} onClick={() => (i === 0 || cfg.name.trim()) && setStep(i)} />)}
      </div>
      <div className="scroll">
        <div key={step} className="in">
          <div className="lbl">ETAPA {step + 1} DE 5 · {STEPS[step].toUpperCase()}</div>

          {step === 0 && (
            <>
              <h2>Como se chama o seu negócio?</h2>
              <p className="hint">É o nome que vai aparecer no topo do seu site.</p>
              <label className="flab" htmlFor="es-name">Nome do negócio *</label>
              <input id="es-name" className="fld" value={cfg.name} maxLength={40} onChange={(e) => up({ name: e.target.value })} placeholder="Ex.: Doces da Ana" autoFocus />
              <label className="flab" htmlFor="es-slogan">Frase de destaque (opcional)</label>
              <input id="es-slogan" className="fld" value={cfg.slogan} maxLength={70} onChange={(e) => up({ slogan: e.target.value })} placeholder="Ex.: O doce que faz o seu dia" />
              <p className="hint" style={{ marginTop: 10 }}>Se deixar em branco, a gente coloca uma frase de exemplo.</p>
            </>
          )}

          {step === 1 && (
            <>
              <h2>O que você precisa?</h2>
              <p className="hint">Escolha o tipo. Dá para trocar a qualquer momento.</p>
              {TYPES.map((t) => (
                <button key={t.id} className={'opt' + (cfg.type === t.id ? ' on' : '')} onClick={() => chooseType(t.id)} aria-pressed={cfg.type === t.id}>
                  <span className="oic"><Icon name={t.icon} /></span>
                  <span><b style={{ display: 'block', fontSize: 16 }}>{t.label}</b><span style={{ fontSize: 13, color: '#a9a5b4', lineHeight: 1.45 }}>{t.desc}</span></span>
                </button>
              ))}
            </>
          )}

          {step === 2 && (
            <>
              <h2>Escolha o modelo e o estilo</h2>
              <p className="hint">Modelos prontos da &lt;Code&gt; Labs para {typeLabel.toLowerCase()}.</p>
              {forType(cfg.type).map((t) => (
                <button key={t.id} className={'opt' + (cfg.template === t.id ? ' on' : '')} onClick={() => up({ template: t.id })} aria-pressed={cfg.template === t.id}>
                  <span className="oic" style={{ background: t.color, color: '#111' }}><Icon name="sparkle" /></span>
                  <span><b style={{ display: 'block', fontSize: 16 }}>{t.name}</b><span style={{ fontSize: 13, color: '#a9a5b4' }}>{t.desc}</span></span>
                </button>
              ))}
              <div className="flab">Estilo</div>
              <div className="row">
                {(['claro', 'escuro'] as const).map((lk) => (
                  <button key={lk} className={'chip' + (cfg.look === lk ? ' on' : '')} onClick={() => up({ look: lk })} aria-pressed={cfg.look === lk} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: lk === 'claro' ? '#f5f3ee' : '#111114', border: '1px solid #3a3744' }} />{lk === 'claro' ? 'Claro e leve' : 'Escuro e marcante'}
                  </button>
                ))}
              </div>
              <p className="hint" style={{ marginTop: 16 }}>Novos modelos entram aqui com frequência.</p>
            </>
          )}

          {step === 3 && (
            <>
              <h2>Agora, a sua cara</h2>
              <p className="hint">Coloque sua logo, escolha as cores e, se quiser, uma foto do seu negócio.</p>

              <div className="flab">Sua logo</div>
              <label className="up">
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => onLogo(e.target.files?.[0])} />
                <span style={{ width: 56, height: 56, borderRadius: 14, background: cfg.logo ? '#fff' : '#1f1d26', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>{cfg.logo ? <img src={cfg.logo} alt="Sua logo" style={{ maxWidth: '90%', maxHeight: '90%' }} /> : <Icon name="plus" />}</span>
                <span><b style={{ display: 'block' }}>{cfg.logo ? 'Trocar logo' : 'Enviar logo'}</b><span style={{ fontSize: 12, color: '#a9a5b4' }}>PNG ou JPG. A imagem fica só no seu navegador.</span></span>
              </label>
              {cfg.logo && <button className="chip" style={{ marginTop: 8, fontSize: 13 }} onClick={() => { up({ logo: null }); setAiState('idle'); setFound([]); }}>Remover logo</button>}

              <div style={{ marginTop: 16 }}>
                <button className="ai" onClick={runAi} disabled={!cfg.logo || aiState === 'busy'}>
                  {aiState === 'busy' ? <><span style={{ width: 18, height: 18, borderRadius: '50%', border: '3px solid rgba(0,0,0,.25)', borderTopColor: '#0c0b0f', animation: 'esspin .7s linear infinite' }} />Analisando sua logo…</> : <><Icon name="sparkle" fill size={18} />Paleta automática · &lt;Code&gt; AI</>}
                </button>
                <p className="hint" style={{ marginTop: 8, marginBottom: 0 }}>{cfg.logo ? 'Lê as cores da sua logo e monta a paleta do site.' : 'Envie a logo para gerar a paleta automática.'}</p>
                {aiState === 'done' && (
                  <div className="in" style={{ marginTop: 10 }}>
                    {found.length ? (
                      <>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>Cores encontradas. Toque para usar como principal:</div>
                        <div className="row" style={{ marginTop: 8 }}>{found.map((c) => <button key={c} className={'sw' + (cfg.colors[0] === c ? ' on' : '')} style={{ background: c }} aria-label={`Usar ${c}`} onClick={() => up({ colors: [c, ...found.filter((x) => x !== c)].slice(0, 2) })} />)}</div>
                      </>
                    ) : <div style={{ fontSize: 13, color: '#a9a5b4' }}>Não achei cores fortes na logo. Escolha no anel abaixo.</div>}
                  </div>
                )}
              </div>

              <div className="flab" style={{ marginTop: 20 }}>Cor principal</div>
              <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
                <HueRing value={cfg.colors[0]} onChange={(hex) => up({ colors: [hex] })} />
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontSize: 12, color: '#a9a5b4', marginBottom: 8 }}>Gire no anel ou escolha uma pronta:</div>
                  <div className="row" style={{ gap: 8 }}>{PRESETS.map((c) => <button key={c} className={'sw' + (cfg.colors[0] === c ? ' on' : '')} style={{ background: c }} aria-label={`Cor ${c}`} onClick={() => up({ colors: [c] })} />)}</div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 13, color: '#a9a5b4' }}>Código:
                    <input className="fld" style={{ padding: '8px 10px', width: 110, fontSize: 13 }} value={cfg.colors[0]} onChange={(e) => /^#[0-9a-fA-F]{6}$/.test(e.target.value) && up({ colors: [e.target.value] })} />
                  </label>
                </div>
              </div>

              <div className="flab" style={{ marginTop: 20 }}>Foto principal (opcional)</div>
              <label className="up">
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => onPhoto(e.target.files?.[0])} />
                <span style={{ width: 56, height: 56, borderRadius: 14, background: '#1f1d26', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cfg.photo ? <img src={cfg.photo} alt="Sua foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icon name="plus" />}</span>
                <span><b style={{ display: 'block' }}>{cfg.photo ? 'Trocar foto' : 'Enviar uma foto'}</b><span style={{ fontSize: 12, color: '#a9a5b4' }}>Do seu produto, loja ou equipe.</span></span>
              </label>
              {cfg.photo && <button className="chip" style={{ marginTop: 8, fontSize: 13 }} onClick={() => up({ photo: null })}>Remover foto</button>}
            </>
          )}

          {step === 4 && (
            <>
              <h2>Ficou com a sua cara!</h2>
              <p className="hint">Veja no celular, no tablet e no computador pelos botões em cima da prévia. Gostou? Peça o orçamento desse site.</p>
              <div style={{ background: '#17161c', border: '1px solid #2a2832', borderRadius: 18, padding: 16, display: 'grid', gap: 10, fontSize: 14 }}>
                <div><span style={{ color: '#a9a5b4' }}>Negócio:</span> <b>{cfg.name || '—'}</b></div>
                <div><span style={{ color: '#a9a5b4' }}>Tipo:</span> <b>{typeLabel}</b></div>
                <div><span style={{ color: '#a9a5b4' }}>Modelo:</span> <b>{tpl.name} · {cfg.look}</b></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ color: '#a9a5b4' }}>Cores:</span>{cfg.colors.map((c) => <span key={c} style={{ width: 20, height: 20, borderRadius: '50%', background: c, border: '2px solid #2c2a34' }} />)}</div>
              </div>
              <button className="bt" onClick={openQuote} style={{ width: '100%', marginTop: 16, background: '#c6ff34', color: '#0c0b0f', fontSize: 16 }}>Gostei, quero o orçamento desse site</button>
              <button className="bt" onClick={openNewTab} style={{ width: '100%', marginTop: 10, background: '#1d1b23', color: '#f2f0f6' }}>Abrir meu site em tela cheia ↗</button>
              <button className="chip" onClick={reset} style={{ marginTop: 14, fontSize: 13 }}>Começar de novo</button>
              <p className="hint" style={{ marginTop: 14 }}>Textos, números e fotos são de exemplo. No projeto de verdade, tudo é feito com as informações do seu negócio.</p>
            </>
          )}
        </div>
      </div>
      <div className="foot">
        {step > 0 && <button className="bt" onClick={() => setStep(step - 1)} style={{ background: '#1d1b23', color: '#f2f0f6' }}>Voltar</button>}
        {step < 4 && <button className="bt" disabled={!canNext} onClick={() => canNext && setStep(step + 1)} style={{ flex: 1, background: canNext ? '#7e3bed' : '#2a2832', color: '#fff' }}>{canNext ? 'Continuar' : 'Digite o nome para continuar'}</button>}
        {step === 4 && <button className="bt" onClick={openQuote} style={{ flex: 1, background: '#7e3bed', color: '#fff' }}>Pedir orçamento</button>}
      </div>
    </aside>
  );

  return (
    <div className="es">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="mtabs">
        <button className={tab === 'montar' ? 'on' : ''} onClick={() => setTab('montar')}>Montar</button>
        <button className={tab === 'ver' ? 'on' : ''} onClick={() => setTab('ver')}>Ver prévia</button>
      </div>
      {panel}
      <section className="main" data-tab={tab}>
        <div className="bar">
          {(Object.keys(DEVICES) as Device[]).map((k) => (
            <button key={k} className={'tb' + (device === k ? ' on' : '')} onClick={() => setDevice(k)} aria-label={`Ver no ${DEVICES[k].label.toLowerCase()}`} aria-pressed={device === k} title={DEVICES[k].label}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={DEVICES[k].icon} /></svg>
            </button>
          ))}
          <span className="sep" />
          <button className="tb" onClick={openNewTab} aria-label="Abrir em nova guia" title="Abrir em nova guia"><Icon name="arrowUp" /></button>
          <button className="tb" onClick={() => setNonce((n) => n + 1)} aria-label="Repetir animações" title="Repetir animações"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5" /></svg></button>
          <button className="tb" onClick={openQuote} aria-label="Gerar imagem da prévia" title="Gerar imagem"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M15 9h.01" /></svg></button>
          <span className="hide-m" style={{ fontSize: 12, color: '#8b8796', marginLeft: 8 }}>{d.w} × {device === 'desktop' ? frameH : d.h}</span>
        </div>
        <div className="stage" ref={stageRef}>
          <div style={{ width: (d.w + bezel * 2) * scale, height: (frameH + bezel * 2 + chrome) * scale, flexShrink: 0, transition: 'width .45s cubic-bezier(.2,.7,.2,1),height .45s cubic-bezier(.2,.7,.2,1)' }}>
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: d.w + bezel * 2, background: device === 'desktop' ? '#1d1b23' : '#050507', padding: bezel, borderRadius: device === 'phone' ? 54 : device === 'tablet' ? 36 : 14, boxShadow: '0 0 0 2px #2c2a34, 0 40px 90px -30px rgba(0,0,0,.8)', overflow: 'hidden' }}>
              {device === 'desktop' && (
                <div style={{ height: chrome, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px' }}>
                  {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
                  <span style={{ flex: 1, maxWidth: 480, margin: '0 auto', background: '#2a2832', borderRadius: 8, padding: '5px 12px', fontSize: 13, color: '#cfcbd8', textAlign: 'center' }}>{slug(cfg.name)}.com.br</span>
                </div>
              )}
              <div style={{ borderRadius: device === 'phone' ? 42 : device === 'tablet' ? 22 : 0, overflow: 'hidden', position: 'relative' }}>
                <SiteFrame ref={frameRef} cfg={cfg} width={d.w} height={frameH} nonce={nonce} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {modal && (
        <div className="ov" role="dialog" aria-modal="true" aria-label="Pedir orçamento">
          <div className="md in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div><div className="lbl">QUASE LÁ</div><h2 style={{ fontSize: 24 }}>Mande o seu site para a gente</h2></div>
              <button className="tb" onClick={() => setModal(false)} aria-label="Fechar" style={{ background: '#1d1b23' }}>✕</button>
            </div>
            <div style={{ marginTop: 10, borderRadius: 16, overflow: 'hidden', background: '#0c0b0f', border: '1px solid #2c2a34', minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {shot.busy && <div style={{ padding: 40, textAlign: 'center', color: '#a9a5b4', fontSize: 14 }}><span style={{ display: 'inline-block', width: 26, height: 26, borderRadius: '50%', border: '3px solid #2c2a34', borderTopColor: '#a77bff', animation: 'esspin .8s linear infinite' }} /><br />Gerando a imagem da sua prévia…</div>}
              {!shot.busy && shot.url && <img src={shot.url} alt="Imagem da prévia do seu site" style={{ width: '100%', display: 'block', maxHeight: 280, objectFit: 'cover', objectPosition: 'top' }} />}
              {!shot.busy && !shot.url && <div style={{ padding: 30, fontSize: 14, color: '#a9a5b4', textAlign: 'center' }}>Não consegui gerar a imagem neste navegador. Você pode mandar um print da prévia.</div>}
            </div>
            <ol style={{ margin: '16px 0 0', paddingLeft: 20, color: '#cfcbd8', fontSize: 14, lineHeight: 1.7 }}>
              <li>Baixe a imagem do seu site.</li>
              <li>Abra o WhatsApp: a mensagem já vai pronta.</li>
              <li>Anexe a imagem na conversa e envie.</li>
            </ol>
            <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
              {canShareFile(shot.blob) && <button className="bt" onClick={() => shot.blob && shareFile(shot.blob, message)} style={{ background: '#7e3bed', color: '#fff' }}>Compartilhar imagem + mensagem</button>}
              <button className="bt" disabled={!shot.blob} onClick={() => shot.blob && downloadBlob(shot.blob, fileName)} style={{ background: '#1d1b23', color: '#f2f0f6', opacity: shot.blob ? 1 : 0.5 }}>1. Baixar a imagem</button>
              <a className="bt" href={waLink(SITE.whatsapp, message)} target="_blank" rel="noopener" onClick={() => shot.blob && downloadBlob(shot.blob, fileName)} style={{ background: '#c6ff34', color: '#0c0b0f', textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Icon name="chat" size={18} />2. Abrir o WhatsApp com a mensagem</a>
            </div>
            <p className="hint" style={{ marginTop: 12, marginBottom: 0, fontSize: 12 }}>Sua logo e fotos ficam só no seu navegador. Nada é enviado sem você mandar.</p>
          </div>
        </div>
      )}
    </div>
  );
}
