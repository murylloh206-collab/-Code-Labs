import React, { useState } from 'react';
import { Aurora, BASE_CSS, Brand, FloatCta, Marquee, Split, Icon, PhotoOr, PoweredBy, displayName, fonts, type TplProps } from './kit';

export const css = fonts('Archivo:wdth,wght@75..125,400..900') + BASE_CSS + `
body{font-family:'Archivo',system-ui,sans-serif}
.w{max-width:1240px;margin:0 auto;padding:0 26px}
.ann{background:var(--ink);color:var(--on-ink);font-size:12px;letter-spacing:.12em;overflow:hidden;padding:9px 0}
.nav{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:18px 0;gap:16px}
.nav nav{display:flex;gap:24px;font-weight:700;font-size:13px;letter-spacing:.04em}.nav nav a{text-decoration:none}.nav nav a:hover{color:var(--p-text)}
.ico{display:flex;gap:16px;justify-content:flex-end;align-items:center}
.hero{position:relative;height:560px;overflow:hidden;background:linear-gradient(120deg,var(--bg2),var(--soft))}
.ht{position:absolute;left:0;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;z-index:2}
.H{font-stretch:115%;font-weight:900;font-size:76px;line-height:.92;letter-spacing:-.02em;margin:0;text-transform:uppercase}
.b{display:inline-flex;align-items:center;gap:8px;border-radius:999px;padding:14px 26px;font-weight:700;font-size:14px;letter-spacing:.05em;border:0;text-decoration:none}
.cats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.cat{height:380px;border-radius:6px;position:relative;overflow:hidden;display:flex;align-items:flex-end;padding:22px}
.cat .g{position:absolute;inset:0;transition:transform .7s cubic-bezier(.2,.7,.2,1)}.cat:hover .g{transform:scale(1.06)}
.prods{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.pc .im{height:320px;border-radius:6px;background:var(--bg2);position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden}
.pc .im svg{transition:transform .6s cubic-bezier(.2,.7,.2,1)}.pc:hover .im svg{transform:scale(1.08) translateY(-6px)}
.tag{position:absolute;left:12px;top:12px;font-size:11px;font-weight:800;padding:5px 9px;border-radius:4px}
.bag{position:absolute;right:12px;bottom:12px;width:40px;height:40px;border-radius:50%;border:0;background:var(--ink);color:var(--on-ink);display:flex;align-items:center;justify-content:center;transition:transform .2s}.bag:hover{transform:scale(1.1)}
.sz{display:flex;gap:4px;margin-top:8px}.sz span{border:1px solid var(--line);font-size:11px;padding:3px 7px}
.split{display:grid;grid-template-columns:1fr 1fr;min-height:420px}
@media (max-width:860px){.nav nav{display:none}.nav{grid-template-columns:auto 1fr}.nav>div:first-child{display:none}.H{font-size:46px}.hero{height:520px}.cats,.split{grid-template-columns:1fr}.cat{height:240px}.prods{grid-template-columns:repeat(2,1fr)}.pc .im{height:230px}}
.outm .mq-t span{font-stretch:125%;font-size:clamp(40px,7vw,82px);font-weight:900;letter-spacing:-.02em;text-transform:uppercase;-webkit-text-stroke:1.5px var(--fg);color:transparent}.outm .mq-t span:nth-child(2n){color:var(--p);-webkit-text-stroke:0}
`;

function Garment({ k, color }: { k: number; color: string }) {
  const d = [
    'M30 20 L50 10 Q60 22 70 10 L90 20 L104 46 L88 54 L84 44 L84 112 L36 112 L36 44 L32 54 L16 46 Z',
    'M46 10 Q60 20 74 10 L78 40 Q96 90 100 116 L20 116 Q24 90 42 40 Z',
    'M36 10 L84 10 L88 116 L66 116 L60 50 L54 116 L32 116 Z',
    'M28 26 Q60 8 92 26 L96 60 L80 64 L80 112 L40 112 L40 64 L24 60 Z',
  ][k % 4];
  return (
    <svg width="150" height="170" viewBox="0 0 120 124" aria-hidden="true">
      <ellipse cx="60" cy="118" rx="38" ry="5" fill="rgba(0,0,0,.12)" />
      <path d={d} fill={color} />
      <path d={d} fill="url(#sh)" />
      <defs><linearGradient id="sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".28" /><stop offset=".6" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".18" /></linearGradient></defs>
    </svg>
  );
}

const PRODS = [
  { n: 'Camiseta essencial', p: 'R$ 79,90', o: 'R$ 99,90', t: 'OFERTA', k: 0 },
  { n: 'Vestido midi', p: 'R$ 159,90', t: 'NOVO', k: 1 },
  { n: 'Calça alfaiataria', p: 'R$ 139,90', t: 'MAIS VENDIDO', k: 2 },
  { n: 'Moletom oversized', p: 'R$ 149,90', t: 'NOVO', k: 3 },
];

export default function Moda({ cfg }: TplProps) {
  const name = displayName(cfg);
  const [bag, setBag] = useState(0);
  const [fav, setFav] = useState<Record<number, boolean>>({});
  const tones = ['var(--p)', 'var(--s)', 'var(--ink)', 'color-mix(in srgb,var(--p) 45%,#fff)'];
  return (
    <>
      <div className="ann"><div style={{ display: 'flex', gap: 60, width: 'max-content', animation: 'marq 26s linear infinite' }}>{Array.from({ length: 6 }).map((_, i) => <span key={i}>FRETE GRÁTIS ACIMA DE R$ 199 · TROCA FÁCIL EM 30 DIAS · PARCELE EM ATÉ 6X</span>)}</div></div>
      <div className="w">
        <header className="nav a1">
          <div><nav><a href="#loja">LOJA</a><a href="#novidades">NOVIDADES</a><a href="#sobre">SOBRE</a></nav></div>
          <Brand cfg={cfg} size={34} style={{ fontStretch: '120%', fontSize: 22, fontStyle: 'italic', letterSpacing: '-.02em' }} />
          <div className="ico"><Icon name="search" /><Icon name="user" /><span style={{ position: 'relative' }}><Icon name="bag" /><span key={bag} className={bag ? 'bump' : ''} style={{ position: 'absolute', right: -8, top: -8, minWidth: 18, height: 18, borderRadius: 9, background: 'var(--p)', color: 'var(--on-p)', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{bag}</span></span></div>
        </header>
      </div>

      <section className="hero">
        <Aurora />
        <div style={{ position: 'absolute', inset: 0 }}>
          <PhotoOr cfg={cfg} style={{ objectPosition: 'right center' }} fallback={
            <>
              <span className="zm" style={{ position: 'absolute', right: '6%', top: '8%', width: '44%', height: '84%', borderRadius: '50% 50% 8px 8px', background: 'linear-gradient(160deg,var(--p),var(--s))' }} />
              <div className="fl" style={{ position: 'absolute', right: '14%', top: '16%' }}><Garment k={1} color="var(--card)" /></div>
              <div className="flr" style={{ position: 'absolute', right: '30%', bottom: '8%', transform: 'scale(.8)' }}><Garment k={0} color="var(--ink)" /></div>
            </>
          } />
        </div>
        <div className="w ht" style={{ right: 0 }}>
          <h1 className="H" style={{ maxWidth: 620, color: cfg.photo ? '#fff' : 'var(--fg)', textShadow: cfg.photo ? '0 2px 30px rgba(0,0,0,.4)' : 'none' }}><Split text={cfg.slogan || 'Estilo em cada movimento'} step={0.12} /></h1>
          <p className="a3" style={{ marginTop: 16, fontSize: 17, color: cfg.photo ? '#fff' : 'var(--mut)' }}>A nova coleção da {name} chegou.</p>
          <div className="a4" style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <a className="b btn" href="#loja" style={{ background: 'var(--fg)', color: 'var(--bg)' }}>COMPRAR AGORA</a>
            <a className="b btn" href="#novidades" style={{ border: '1.5px solid currentColor', color: cfg.photo ? '#fff' : 'var(--fg)' }}>VER NOVIDADES</a>
          </div>
        </div>
      </section>

      <Marquee words={['Nova coleção', name, 'Frete grátis', 'Troca fácil', 'Edição limitada']} speed={28} style={{ padding: '22px 0 0' }} className="outm" />
      <section id="loja" className="w" style={{ padding: '60px 26px 20px' }}>
        <h2 className="rv" style={{ fontStretch: '115%', fontWeight: 900, fontSize: 32, margin: '0 0 22px' }}>COMPRE POR CATEGORIA</h2>
        <div className="cats">
          {['FEMININO', 'MASCULINO', 'ACESSÓRIOS'].map((c, i) => (
            <a key={c} href="#novidades" className="cat rv" style={{ color: '#fff', textDecoration: 'none' }}>
              <span className="g" style={{ background: `linear-gradient(${160 + i * 30}deg,${tones[i]},color-mix(in srgb,${tones[i]} 40%,#000))` }} />
              <span className="fl" style={{ position: 'absolute', left: '50%', top: '18%', transform: 'translateX(-50%)', animationDelay: `${i * 0.4}s` }}><Garment k={i + 1} color="rgba(255,255,255,.88)" /></span>
              <b style={{ position: 'relative', fontSize: 22, fontStretch: '115%' }}>{c}</b>
            </a>
          ))}
        </div>
      </section>

      <section id="novidades" className="w" style={{ padding: '50px 26px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22 }}>
          <h2 className="rv" style={{ fontStretch: '115%', fontWeight: 900, fontSize: 32, margin: 0 }}>EM ALTA AGORA</h2>
          <a href="#novidades" style={{ fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>VER TUDO →</a>
        </div>
        <div className="prods">
          {PRODS.map((p, i) => (
            <div key={p.n} className="pc rv">
              <div className="im">
                <Garment k={p.k} color={tones[i % 4]} />
                <span className="tag" style={{ background: i === 0 ? '#d93025' : 'var(--p)', color: i === 0 ? '#fff' : 'var(--on-p)' }}>{p.t}</span>
                <button onClick={() => setFav((f) => ({ ...f, [i]: !f[i] }))} aria-label="Favoritar" style={{ position: 'absolute', right: 12, top: 12, border: 0, background: 'transparent', color: fav[i] ? '#d93025' : 'var(--fg)' }}><Icon name="heart" fill={!!fav[i]} /></button>
                <button className="bag" onClick={() => setBag((b) => b + 1)} aria-label={`Adicionar ${p.n}`}><Icon name="bag" size={18} /></button>
              </div>
              <div style={{ fontWeight: 600, marginTop: 12, fontSize: 14 }}>{p.n}</div>
              <div style={{ fontSize: 14, marginTop: 4 }}><b style={{ color: p.o ? '#d93025' : 'var(--fg)' }}>{p.p}</b> {p.o && <s style={{ color: 'var(--mut)' }}>{p.o}</s>}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>{[tones[i % 4], 'var(--ink)', '#e9e6e1'].map((c, j) => <span key={j} style={{ width: 14, height: 14, borderRadius: '50%', background: c, border: '1px solid var(--line)' }} />)}</div>
              <div className="sz">{['P', 'M', 'G', 'GG'].map((s) => <span key={s}>{s}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="sobre" className="split">
        <div className="rv" style={{ background: 'linear-gradient(135deg,var(--p),var(--s))', position: 'relative', overflow: 'hidden', minHeight: 320 }}>
          <span className="sp" style={{ position: 'absolute', left: '50%', top: '50%', width: 300, height: 300, marginLeft: -150, marginTop: -150, borderRadius: '50%', border: '30px solid rgba(255,255,255,.25)', borderTopColor: 'rgba(255,255,255,.7)' }} />
        </div>
        <div className="rv" style={{ background: 'var(--bg2)', padding: '50px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', color: 'var(--mut)' }}>CONFORTO E ESTILO</div>
          <h3 style={{ fontStretch: '115%', fontWeight: 900, fontSize: 34, margin: '10px 0' }}>FEITO PARA VOCÊ</h3>
          <p style={{ color: 'var(--mut)', lineHeight: 1.6, maxWidth: 440 }}>Peças escolhidas a dedo pela {name}, com tecidos que acompanham o seu dia do começo ao fim.</p>
          <a className="b btn" href="#loja" style={{ background: 'var(--fg)', color: 'var(--bg)', alignSelf: 'flex-start', marginTop: 10 }}>COMPRAR AGORA</a>
        </div>
      </section>

      <section className="w" style={{ padding: '60px 26px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', color: 'var(--mut)' }}>DEPOIMENTOS</div>
        <h2 style={{ fontStretch: '115%', fontWeight: 900, fontSize: 32, margin: '6px 0 22px' }}>O QUE NOSSOS CLIENTES DIZEM</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
          {['Amei a qualidade!', 'Chegou super rápido', 'Caimento perfeito'].map((t) => <div key={t} className="lift rv" style={{ border: '1px solid var(--line)', padding: 22, background: 'var(--card)' }}><div style={{ color: '#e5a50a' }}>★★★★★</div><b style={{ display: 'block', marginTop: 10 }}>{t}</b><p style={{ color: 'var(--mut)', fontSize: 14, marginBottom: 0 }}>Exemplo de avaliação de cliente.</p></div>)}
        </div>
      </section>

      <FloatCta label="Chamar no WhatsApp" />
      <footer style={{ background: 'var(--ink)', color: 'var(--on-ink)' }}>
        <div className="w" style={{ padding: '34px 26px', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <Brand cfg={cfg} size={30} /><span style={{ opacity: 0.7, fontSize: 13 }}>© {new Date().getFullYear()} {name}</span>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.1)' }}><PoweredBy accent="var(--p)" /></div>
      </footer>
    </>
  );
}
