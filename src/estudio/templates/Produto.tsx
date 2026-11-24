import React, { useState } from 'react';
import { Aurora, BASE_CSS, Brand, FloatCta, Marquee, Split, Icon, PhotoOr, PoweredBy, displayName, fonts, type TplProps } from './kit';

export const css = fonts('Inter+Tight:wght@400;500;600;700;800') + BASE_CSS + `
body{font-family:'Inter Tight',system-ui,sans-serif}
.w{max-width:1200px;margin:0 auto;padding:0 26px;position:relative;z-index:1}
.out{-webkit-text-stroke:1.5px var(--fg);color:transparent;font-size:clamp(40px,7vw,86px);font-weight:800;letter-spacing:-.03em;text-transform:uppercase}
.out+.out,.outl .mq-t span{font-size:clamp(44px,8vw,92px);font-weight:800;letter-spacing:-.03em;text-transform:uppercase;-webkit-text-stroke:1.5px var(--fg);color:transparent}.outl .mq-t span:nth-child(3n){color:var(--p);-webkit-text-stroke:0}
.nav{display:flex;align-items:center;justify-content:space-between;padding:22px 0}
.nav nav{display:flex;gap:30px;font-size:13px;letter-spacing:.08em;font-weight:600}.nav nav a{text-decoration:none;opacity:.7}.nav nav a:hover{opacity:1}
.hero{display:grid;grid-template-columns:230px 1fr 230px;gap:20px;align-items:center;padding:20px 0 40px}
.side{display:flex;flex-direction:column;gap:14px}
.card{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:18px}
.big{font-size:118px;font-weight:800;letter-spacing:-.05em;line-height:.9;text-align:center;margin:0}
.obj{position:relative;height:420px;display:flex;align-items:flex-end;justify-content:center}
.dev{width:220px;height:380px;border-radius:44px;background:linear-gradient(145deg,color-mix(in srgb,var(--p) 85%,#fff),var(--p) 45%,color-mix(in srgb,var(--p) 55%,#000));box-shadow:inset 0 0 0 6px rgba(255,255,255,.25),inset -18px -30px 60px rgba(0,0,0,.25),0 50px 80px -30px color-mix(in srgb,var(--p) 70%,#000);position:relative}
.dev:after{content:"";position:absolute;left:16%;top:6%;width:28%;height:60%;border-radius:40px;background:linear-gradient(180deg,rgba(255,255,255,.55),transparent);filter:blur(2px)}
.bento{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.bx{border-radius:28px;padding:28px;min-height:320px;position:relative;overflow:hidden;display:flex;flex-direction:column}
.spec{display:grid;grid-template-columns:repeat(4,1fr);background:var(--ink);color:var(--on-ink);border-radius:24px}
.spec>div{padding:26px;border-left:1px solid rgba(255,255,255,.1)}.spec>div:first-child{border:0}
.q{width:100%;text-align:left;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px 20px;font-weight:600;font-size:16px;display:flex;justify-content:space-between;gap:12px;align-items:center}
.b{display:inline-flex;align-items:center;gap:10px;border-radius:999px;padding:14px 24px;font-weight:700;border:0;text-decoration:none}
@media (max-width:900px){.hero{grid-template-columns:1fr}.hero>div:nth-child(2){order:-1}.dev{width:170px;height:290px;border-radius:36px}.side{flex-direction:row;flex-wrap:wrap}.side>*{flex:1;min-width:150px}.big{font-size:68px}.bento,.spec{grid-template-columns:1fr 1fr}.nav nav{display:none}.obj{height:360px}}
@media (max-width:520px){.bento,.spec{grid-template-columns:1fr}}
`;

export default function Produto({ cfg }: TplProps) {
  const name = displayName(cfg);
  const [open, setOpen] = useState(0);
  const faq = [
    ['Como faço o meu pedido?', 'É só tocar em "Quero o meu", escolher a opção e finalizar pelo WhatsApp. Simples assim.'],
    ['Vocês entregam na minha cidade?', 'Entregamos na região e enviamos para todo o Brasil. O prazo aparece antes de você confirmar.'],
    ['Tem garantia?', 'Sim. Se algo não estiver certo, a gente resolve com você.'],
  ];
  return (
    <>
      <div style={{ position: 'relative', height: 0 }}><Aurora style={{ inset: '0 0 auto 0', height: 900 }} /></div>
      <div className="w">
        <header className="nav a1"><Brand cfg={cfg} /><nav><a href="#produto">PRODUTO</a><a href="#recursos">RECURSOS</a><a href="#duvidas">DÚVIDAS</a></nav><a className="b btn" href="#comprar" style={{ background: 'var(--fg)', color: 'var(--bg)', padding: '10px 18px', fontSize: 14 }}>Comprar</a></header>
        <section className="hero" id="produto">
          <div className="side">
            <div className="card a2"><div style={{ fontWeight: 600 }}>Feito para<br />durar.</div><div style={{ textAlign: 'right', marginTop: 8 }}><Icon name="arrowUp" size={18} /></div></div>
            <div className="card a3" style={{ background: 'var(--ink)', color: 'var(--on-ink)', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ width: 52, height: 52, borderRadius: '50%', background: '#fff', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 2.2s infinite' }}><Icon name="play" fill size={18} /></span></div>
            <p className="a4" style={{ fontSize: 14, color: 'var(--mut)', lineHeight: 1.6, margin: 0 }}>{cfg.slogan || `A ${name} junta qualidade, design e praticidade para o seu dia a dia.`}</p>
            <a className="b btn a5" href="#comprar" style={{ background: 'var(--p)', color: 'var(--on-p)', alignSelf: 'flex-start' }}>Quero o meu <Icon name="arrow" size={16} /></a>
          </div>
          <div>
            <h1 className="big"><Split text={name} delay={0.2} step={0.12} /></h1>
            <p className="a2" style={{ textAlign: 'center', fontSize: 19, marginTop: 10, color: 'var(--mut)' }}>Pensado para tudo o que você ama.</p>
            <div className="obj zm">
              <span className="sp" style={{ position: 'absolute', bottom: 10, width: 420, maxWidth: '96%', height: 120, borderRadius: '50%', border: '2px dashed color-mix(in srgb,var(--p) 50%,transparent)' }} />
              <span style={{ position: 'absolute', bottom: 0, width: 360, maxWidth: '90%', height: 50, borderRadius: '50%', background: 'radial-gradient(closest-side,rgba(0,0,0,.25),transparent)' }} />
              <div className="fl" style={{ position: 'relative', marginBottom: 26 }}>
                <PhotoOr cfg={cfg} style={{ width: 300, height: 360, borderRadius: 36 }} fallback={<div className="dev" />} />
              </div>
            </div>
          </div>
          <div className="side">
            <div className="card a3"><Icon name="leaf" size={20} /><div style={{ fontWeight: 600, marginTop: 10 }}>Responsável com o planeta.</div><div style={{ fontSize: 12, color: 'var(--mut)', marginTop: 4 }}>Embalagem reciclável.</div></div>
            <div className="card a4"><div style={{ fontSize: 40, fontWeight: 700 }}>100%</div><div style={{ fontWeight: 600 }}>Garantia.</div><div style={{ fontSize: 12, color: 'var(--mut)', marginTop: 4 }}>Satisfação ou troca.</div></div>
            <div className="a5" style={{ textAlign: 'center' }}><span style={{ width: 74, height: 74, borderRadius: '50%', border: '1.5px solid var(--line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="plus" size={26} /></span><div style={{ fontWeight: 600, marginTop: 8 }}>Por que a {name}?</div></div>
          </div>
        </section>
      </div>

      <Marquee words={['Novo', 'Qualidade', name, 'Entrega rápida', 'Garantia', 'Design único']} speed={30} style={{ margin: '10px 0 30px', padding: '10px 0' }} className="outl" />
      <section id="recursos" className="w" style={{ padding: '60px 26px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 30 }}>
          <h2 className="rv" style={{ fontSize: 54, lineHeight: 1, margin: 0, fontWeight: 700, letterSpacing: '-.03em' }}>Inovação.<br />Em cada <span style={{ color: 'var(--mut)' }}>detalhe.</span></h2>
          <p className="rv" style={{ maxWidth: 340, color: 'var(--mut)', margin: 0 }}>Desempenho, acabamento e cuidado que você percebe no primeiro uso.</p>
        </div>
        <div className="bento">
          <div className="bx lift rv" style={{ background: 'var(--ink)', color: 'var(--on-ink)' }}><b style={{ fontSize: 22 }}>Design que encaixa.</b><span style={{ opacity: 0.7, marginTop: 6 }}>Materiais premium, acabamento impecável.</span><span className="fl" style={{ position: 'absolute', right: -30, bottom: -30, width: 200, height: 200, borderRadius: 40, background: 'linear-gradient(135deg,var(--p),var(--s))', transform: 'rotate(18deg)' }} /></div>
          <div className="bx lift rv" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}><b style={{ fontSize: 22 }}>Qualidade de verdade.</b><span style={{ color: 'var(--mut)', marginTop: 6 }}>Cada detalhe testado antes de chegar até você.</span><span className="sp" style={{ position: 'absolute', right: 30, bottom: 30, width: 130, height: 130, borderRadius: '50%', border: '22px solid var(--p)', borderRightColor: 'transparent' }} /></div>
          <div className="bx lift rv" style={{ background: 'var(--ink)', color: 'var(--on-ink)' }}><b style={{ fontSize: 22 }}>Dura o dia todo.</b><span style={{ opacity: 0.7, marginTop: 6 }}>Mais energia para o que importa.</span><span style={{ position: 'absolute', left: '50%', bottom: 50, transform: 'translateX(-50%)', color: 'var(--p)', filter: 'drop-shadow(0 0 18px var(--p))' }}><Icon name="bolt" size={80} stroke={1.5} /></span></div>
        </div>
      </section>

      <section className="w rv" style={{ paddingBottom: 60 }}>
        <div className="spec">{[['#1', 'Mais vendido da região'], ['5k+', 'Clientes felizes'], ['4,9★', 'Avaliação média'], ['2 anos', 'De garantia']].map(([n, l]) => <div key={l}><div style={{ fontSize: 34, fontWeight: 800, color: 'var(--p)' }}>{n}</div><div style={{ opacity: 0.75, fontSize: 14 }}>{l}</div></div>)}</div>
      </section>

      <section id="duvidas" className="w" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 30, paddingBottom: 70 }}>
        <div className="rv"><h2 style={{ fontSize: 44, margin: 0, lineHeight: 1 }}>Dúvidas?<br /><span style={{ color: 'var(--p-text)' }}>Respondidas.</span></h2><p style={{ color: 'var(--mut)' }}>Ainda ficou alguma? Fale com a gente.</p></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faq.map(([q, a], i) => (
            <div key={q} className="rv">
              <button className="q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>{q}<span style={{ transition: 'transform .3s', transform: open === i ? 'rotate(45deg)' : 'none', color: 'var(--p-text)' }}><Icon name="plus" /></span></button>
              {open === i && <div className="a1" style={{ padding: '12px 20px', color: 'var(--mut)', lineHeight: 1.6 }}>{a}</div>}
            </div>
          ))}
        </div>
      </section>

      <FloatCta label="Quero o meu" />
      <footer id="comprar" style={{ background: 'var(--ink)', color: 'var(--on-ink)', overflow: 'hidden' }}>
        <div className="w" style={{ padding: '50px 26px 0', display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div><div style={{ fontSize: 30, fontWeight: 700 }}>Pronto para ter o seu?</div><div style={{ opacity: 0.7 }}>Garanta agora com condições especiais.</div></div>
          <a className="b btn" href="#comprar" style={{ background: 'var(--p)', color: 'var(--on-p)', animation: 'pulse 2.4s infinite' }}>Quero o meu <Icon name="arrow" size={16} /></a>
        </div>
        <div className="w" style={{ fontSize: 'clamp(60px,14vw,180px)', fontWeight: 800, letterSpacing: '-.05em', lineHeight: 1, marginTop: 30, background: 'linear-gradient(180deg,rgba(255,255,255,.5),rgba(255,255,255,.04))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', whiteSpace: 'nowrap', overflow: 'hidden' }}>{name}</div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.1)' }}><PoweredBy accent="var(--p)" /></div>
      </footer>
    </>
  );
}
