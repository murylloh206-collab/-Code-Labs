import React from 'react';
import { Aurora, BASE_CSS, Brand, FloatCta, Marquee, Split, Icon, PhotoOr, PoweredBy, displayName, fonts, type TplProps } from './kit';

export const css = fonts('DM+Sans:wght@400;500;700;800') + BASE_CSS + `
body{font-family:'DM Sans',system-ui,sans-serif}
.w{max-width:1200px;margin:0 auto;padding:0 28px}
.hero{background:radial-gradient(ellipse 70% 60% at 80% 20%,color-mix(in srgb,var(--p) 22%,transparent),transparent 60%),linear-gradient(180deg,var(--ink),color-mix(in srgb,var(--ink) 70%,var(--bg)));color:var(--on-ink);padding-bottom:90px}
.nav{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px 0}
.links{display:flex;gap:6px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:999px;padding:6px}
.links a{padding:9px 16px;border-radius:999px;text-decoration:none;font-size:14px;opacity:.85}.links a:hover{background:rgba(255,255,255,.08);opacity:1}
.pill{display:inline-flex;align-items:center;gap:10px;border-radius:999px;padding:13px 20px;font-weight:700;font-size:15px;border:0;text-decoration:none}
.hg{display:grid;grid-template-columns:1.05fr 1fr;gap:30px;align-items:center;padding-top:40px}
.h1{font-size:60px;line-height:1.05;letter-spacing:-.02em;margin:18px 0 0;font-weight:700}
.phone{position:absolute;width:230px;border-radius:34px;background:#0c0c0f;padding:9px;box-shadow:0 40px 80px -30px rgba(0,0,0,.7)}
.scr{border-radius:26px;background:#fff;color:#141416;overflow:hidden;height:440px}
.strip{display:grid;grid-template-columns:.9fr 2fr;gap:18px;margin-top:-56px;position:relative}
.svc3{display:grid;grid-template-columns:repeat(3,1fr);background:var(--ink);color:var(--on-ink);border-radius:22px;padding:14px}
.svc3>div{padding:20px;border-radius:16px}.svc3>div:hover{background:rgba(255,255,255,.05)}
.ab{display:grid;grid-template-columns:1fr 1fr;gap:44px;align-items:center;padding:96px 0 40px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;padding:40px 0 80px}
.stats>div{border-top:2px solid var(--line);padding-top:18px;position:relative}
.stats>div:before{content:"";position:absolute;top:-2px;left:0;width:56px;height:2px;background:var(--p)}
.sg{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.chip{display:inline-flex;border-radius:999px;padding:7px 14px;font-size:13px;font-weight:600;background:var(--soft);color:var(--p-text);border:1px solid color-mix(in srgb,var(--p) 30%,transparent)}
@media (max-width:860px){.hg,.ab,.strip{grid-template-columns:1fr}.links{display:none}.h1{font-size:40px}.svc3,.sg{grid-template-columns:1fr}.stats{grid-template-columns:repeat(2,1fr)}.vis{height:430px !important}.strip{margin-top:-40px}}
`;

export default function Consultoria({ cfg }: TplProps) {
  const name = displayName(cfg);
  const services = [
    { i: 'chart', t: 'Planejamento', d: 'Entendemos o seu momento e traçamos o melhor caminho.' },
    { i: 'users', t: 'Atendimento próximo', d: 'Você fala direto com quem resolve, sem enrolação.' },
    { i: 'shield', t: 'Segurança', d: 'Processos claros, combinados por escrito.' },
  ];
  return (
    <>
      <section className="hero hasaur">
        <Aurora />
        <div className="w">
          <header className="nav a1">
            <Brand cfg={cfg} />
            <nav className="links"><a href="#inicio">Início</a><a href="#sobre">Sobre</a><a href="#servicos">Serviços</a><a href="#contato">Contato</a></nav>
            <a className="pill btn" href="#contato" style={{ background: '#fff', color: '#121214' }}>Fale conosco <Icon name="arrow" size={16} /></a>
          </header>
          <div className="hg" id="inicio">
            <div>
              <span className="chip a1" style={{ background: 'rgba(255,255,255,.06)', color: 'var(--p)' }}>Bem-vindo à {name}</span>
              <h1 className="h1"><Split text={cfg.slogan || 'Experiência que vira resultado para o seu negócio'} /></h1>
              <p className="a3" style={{ fontSize: 17, lineHeight: 1.6, opacity: 0.78, maxWidth: 470, marginTop: 18 }}>Atendimento sob medida, do primeiro contato à entrega. Conte o que você precisa e a gente cuida do resto.</p>
              <div className="a4" style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 28, flexWrap: 'wrap' }}>
                <a className="pill btn" href="#contato" style={{ background: 'var(--p)', color: 'var(--on-p)' }}>Começar agora <Icon name="arrow" size={16} /></a>
                <span style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', color: '#121214', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="play" fill size={16} /></span>
              </div>
              <div className="a5" style={{ display: 'flex', gap: 28, marginTop: 34, alignItems: 'center', flexWrap: 'wrap' }}>
                <div><div style={{ color: 'var(--p)', letterSpacing: 2 }}>★★★★★</div><div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>Clientes satisfeitos</div></div>
                <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,.15)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ display: 'flex' }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid var(--ink)', marginLeft: i ? -10 : 0, background: `color-mix(in srgb,var(--p) ${40 + i * 20}%,#fff)` }} />)}</span>
                  <span style={{ fontSize: 13, opacity: 0.8 }}>Equipe pronta<br />para te atender</span>
                </div>
              </div>
            </div>
            <div className="vis zm" style={{ position: 'relative', height: 500 }}>
              <PhotoOr cfg={cfg} style={{ borderRadius: 28, position: 'absolute', inset: 0 }} fallback={
                <>
                  <div className="phone flr" style={{ left: '22%', top: 0, zIndex: 2 }}>
                    <div className="scr">
                      <div style={{ background: 'var(--p)', color: 'var(--on-p)', padding: '26px 18px 30px' }}>
                        <div style={{ fontSize: 12, opacity: 0.8 }}>Resultado do mês</div>
                        <div style={{ fontSize: 30, fontWeight: 800 }}>+38%</div>
                      </div>
                      <svg viewBox="0 0 200 110" style={{ width: '100%', display: 'block', marginTop: 12 }} aria-hidden="true">
                        <path d="M0 90 C30 80 40 50 70 58 S110 30 130 40 170 10 200 18" fill="none" stroke="var(--p)" strokeWidth="4" strokeDasharray="1200" style={{ animation: 'draw 2.4s .6s both' }} />
                      </svg>
                      {[60, 82, 45].map((w, i) => <div key={i} style={{ margin: '12px 16px 0', height: 34, borderRadius: 10, background: '#f2f2f4', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}><span style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--p)' }} /><span style={{ height: 6, width: `${w}%`, background: '#dedee3', borderRadius: 4 }} /></div>)}
                    </div>
                  </div>
                  <div className="phone fl" style={{ left: '46%', top: 70, transform: 'rotate(8deg)', opacity: 0.95 }}>
                    <div className="scr" style={{ background: '#f6f6f8' }} />
                  </div>
                </>
              } />
              <div className="fl" style={{ position: 'absolute', right: '2%', bottom: 20, zIndex: 3, background: 'var(--p)', color: 'var(--on-p)', borderRadius: 18, padding: '18px 22px', textAlign: 'center', animationDelay: '1s' }}>
                <div style={{ fontSize: 34, fontWeight: 800 }}>10+</div><div style={{ fontSize: 12 }}>Anos de experiência</div>
              </div>
            </div>
          </div>
        </div>
        <Marquee words={['Atendimento próximo', 'Processos claros', 'Resultados reais', name, 'Equipe dedicada', 'Metas combinadas']} speed={34} style={{ marginTop: 56, fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,.88)', borderTop: '1px solid rgba(255,255,255,.12)', borderBottom: '1px solid rgba(255,255,255,.12)', padding: '18px 0' }} />
      </section>

      <div className="w strip">
        <div className="lift rv" style={{ borderRadius: 22, overflow: 'hidden', minHeight: 170, background: 'var(--s)', color: 'var(--on-s)', padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
          <span className="sp" style={{ position: 'absolute', right: -30, top: -30, width: 120, height: 120, borderRadius: '50%', border: '18px solid rgba(255,255,255,.25)' }} />
          <div style={{ fontWeight: 700, fontSize: 18 }}>Como funciona?</div><div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>Saiba mais →</div>
        </div>
        <div className="svc3 rv">
          {services.map((s) => (
            <div key={s.t}>
              <span style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--p)', color: 'var(--on-p)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={s.i} /></span>
              <div style={{ fontWeight: 700, fontSize: 18, marginTop: 14 }}>{s.t}</div>
              <div style={{ fontSize: 14, opacity: 0.75, marginTop: 6, lineHeight: 1.5 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      <section className="w ab" id="sobre">
        <div className="rv" style={{ borderRadius: 24, overflow: 'hidden', height: 340, background: 'linear-gradient(135deg,var(--soft),var(--bg2))', position: 'relative' }}>
          <PhotoOr cfg={cfg} fallback={<><span className="fl" style={{ position: 'absolute', left: '12%', top: '18%', width: 160, height: 160, borderRadius: '50%', background: 'var(--p)', opacity: 0.85 }} /><span className="flr" style={{ position: 'absolute', right: '14%', bottom: '14%', width: 200, height: 120, borderRadius: 24, background: 'var(--s)', opacity: 0.9 }} /></>} />
        </div>
        <div className="rv">
          <span className="chip">Sobre nós</span>
          <h2 style={{ fontSize: 38, lineHeight: 1.12, margin: '14px 0 0', fontWeight: 700 }}>A {name} é parceira de quem quer crescer com segurança</h2>
          <p style={{ color: 'var(--mut)', lineHeight: 1.65, marginTop: 14 }}>Somos um time que trabalha perto de você, com processos simples e transparentes. Cada cliente recebe um plano feito para a sua realidade.</p>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', background: 'var(--ink)', color: 'var(--on-ink)', borderRadius: 999, padding: '8px 8px 8px 20px' }}>
            <span style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}><Icon name="check" size={16} style={{ color: 'var(--p)' }} />Resultados reais, metas claras</span>
            <a className="pill btn" href="#contato" style={{ background: 'var(--p)', color: 'var(--on-p)', padding: '10px 16px', fontSize: 13 }}>Saiba mais</a>
          </div>
        </div>
      </section>

      <section className="w stats">
        {[['10+', 'Anos de mercado'], ['500+', 'Clientes atendidos'], ['98%', 'Recomendariam'], ['24h', 'Para responder']].map(([n, l]) => (
          <div key={l} className="rv"><div style={{ fontSize: 46, fontWeight: 700 }}>{n}</div><div style={{ color: 'var(--mut)', fontSize: 14 }}>{l}</div></div>
        ))}
      </section>

      <section id="servicos" style={{ background: 'var(--bg2)', padding: '80px 0' }}>
        <div className="w">
          <span className="chip rv">Nossos serviços</span>
          <h2 className="rv" style={{ fontSize: 38, margin: '14px 0 30px', fontWeight: 700, maxWidth: 620 }}>Soluções para cada etapa do seu crescimento</h2>
          <div className="sg">
            {['Estratégia', 'Gestão', 'Acompanhamento'].map((t, i) => (
              <div key={t} className="lift rv" style={{ borderRadius: 22, overflow: 'hidden', background: 'var(--card)', border: '1px solid var(--line)' }}>
                <div style={{ height: 170, background: `linear-gradient(${120 + i * 40}deg,var(--p),var(--s))`, position: 'relative' }}><span className="fl" style={{ position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 16, background: 'rgba(255,255,255,.3)', animationDelay: `${i * 0.5}s` }} /></div>
                <div style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><b style={{ fontSize: 17 }}>{t}</b><Icon name="arrowUp" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" className="w" style={{ padding: '70px 28px' }}>
        <div className="rv" style={{ background: 'var(--p)', color: 'var(--on-p)', borderRadius: 28, padding: '44px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div><div style={{ fontSize: 32, fontWeight: 800 }}>Vamos conversar?</div><div style={{ opacity: 0.85, marginTop: 6 }}>Fale com a {name} e tire suas dúvidas.</div></div>
          <a className="pill btn" href="#contato" style={{ background: 'var(--ink)', color: 'var(--on-ink)', animation: 'pulse 2.4s infinite' }}><Icon name="chat" size={18} /> Chamar no WhatsApp</a>
        </div>
      </section>
      <FloatCta />
      <footer style={{ background: 'var(--ink)', color: 'var(--on-ink)' }}>
        <div className="w" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 28px', gap: 16, flexWrap: 'wrap' }}>
          <Brand cfg={cfg} size={32} />
          <span style={{ opacity: 0.7, fontSize: 13 }}>© {new Date().getFullYear()} {name}. Todos os direitos reservados.</span>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.1)' }}><PoweredBy accent="var(--p)" /></div>
      </footer>
    </>
  );
}
