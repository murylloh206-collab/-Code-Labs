import React, { useState } from 'react';
import { Aurora, BASE_CSS, Brand, FloatCta, Marquee, Split, Icon, PhotoOr, PoweredBy, displayName, fonts, type TplProps } from './kit';

export const css = fonts('Anton', 'Poppins:wght@400;500;600;700') + BASE_CSS + `
body{font-family:'Poppins',system-ui,sans-serif}
.w{max-width:1200px;margin:0 auto;padding:0 26px}
.dis{font-family:'Anton',Impact,sans-serif;font-weight:400;text-transform:uppercase;letter-spacing:.005em;line-height:.95}
.nav{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 0}
.nav nav{display:flex;gap:26px;font-weight:500;font-size:15px}.nav nav a{text-decoration:none;opacity:.8}.nav nav a:hover{opacity:1;color:var(--p-text)}
.b{display:inline-flex;align-items:center;gap:10px;border-radius:999px;padding:14px 24px;font-weight:700;font-size:15px;border:0;text-decoration:none}
.hg{display:grid;grid-template-columns:1fr 1.05fr;gap:20px;align-items:center;padding:30px 0 60px}
.cats{display:flex;gap:10px;flex-wrap:wrap}
.cat{border:1.5px solid var(--line);background:var(--card);border-radius:999px;padding:10px 18px;font-weight:600;font-size:14px;transition:all .25s}
.cat.on{background:var(--p);color:var(--on-p);border-color:var(--p)}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:26px}
.it{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:14px;display:flex;flex-direction:column}
.plate{height:150px;border-radius:16px;background:var(--soft);display:flex;align-items:center;justify-content:center;overflow:hidden}
.plate svg{transition:transform .5s cubic-bezier(.2,.7,.2,1)}.it:hover .plate svg{transform:scale(1.1) rotate(-6deg)}
.add{width:40px;height:40px;border-radius:12px;border:0;background:var(--p);color:var(--on-p);display:flex;align-items:center;justify-content:center;transition:transform .2s}.add:active{transform:scale(.9)}
.combo{display:grid;grid-template-columns:1.1fr 1fr;align-items:center;gap:20px;background:var(--ink);color:var(--on-ink);border-radius:28px;padding:36px 40px;overflow:hidden;position:relative}
.feat{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.cartb{position:fixed;right:22px;bottom:22px;z-index:20;display:flex;align-items:center;gap:10px;background:var(--ink);color:var(--on-ink);border-radius:999px;padding:12px 18px 12px 14px;font-weight:700;box-shadow:0 16px 30px -12px rgba(0,0,0,.45)}
@media (max-width:860px){.hg,.combo{grid-template-columns:1fr}.grid{grid-template-columns:repeat(2,1fr)}.feat{grid-template-columns:repeat(2,1fr)}.nav nav{display:none}.h1{font-size:64px !important}.vis{height:340px !important}}
@media (max-width:420px){.grid{grid-template-columns:1fr}}
`;

function Burger({ size = 380 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.82} viewBox="0 0 400 330" aria-hidden="true">
      <ellipse cx="200" cy="312" rx="170" ry="16" fill="rgba(0,0,0,.18)" />
      <path d="M40 150 C40 60 360 60 360 150 Z" fill="#e7a24a" /><path d="M40 150 C40 60 360 60 360 150 Z" fill="url(#gl)" />
      {[[110, 105], [160, 88], [215, 92], [265, 104], [140, 125], [240, 126], [190, 115]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="7" ry="4" fill="#fff4dc" transform={`rotate(${i * 25} ${x} ${y})`} />)}
      <path d="M30 160 q30 22 60 0 q30 22 60 0 q30 22 60 0 q30 22 60 0 q30 22 60 0 q30 22 50 0 v14 H30z" fill="#5fae3d" />
      <rect x="42" y="172" width="316" height="18" rx="6" fill="#e64a2e" />
      <path d="M36 192 h328 l-30 26 -26-14 -28 18 -30-18 -28 18 -30-18 -28 18 -30-18 -28 18 -26-14z" fill="var(--s)" />
      <rect x="46" y="200" width="308" height="44" rx="20" fill="#5b2e1b" />
      <path d="M46 250 h308 c0 40-40 56-154 56 S46 290 46 250z" fill="#d98f3b" />
      <defs><linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".35" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient></defs>
    </svg>
  );
}

function Dish({ kind }: { kind: number }) {
  const shapes = [
    <g key="b"><path d="M14 46 C14 18 86 18 86 46 Z" fill="#e7a24a" /><rect x="12" y="48" width="76" height="8" rx="3" fill="#5fae3d" /><rect x="14" y="56" width="72" height="12" rx="6" fill="#5b2e1b" /><path d="M14 70 h72 c0 12-10 16-36 16S14 82 14 70z" fill="#d98f3b" /></g>,
    <g key="f"><path d="M26 40 l8 46 h32 l8-46z" fill="var(--p)" />{[30, 38, 46, 54, 62].map((x, i) => <rect key={i} x={x} y={14 + (i % 2) * 6} width="6" height="34" rx="2" fill="#f2c14e" />)}</g>,
    <g key="d"><rect x="32" y="20" width="36" height="66" rx="8" fill="var(--s)" /><rect x="32" y="34" width="36" height="14" fill="rgba(255,255,255,.5)" /><rect x="52" y="6" width="4" height="18" fill="#333" /></g>,
    <g key="s"><path d="M20 50 a30 30 0 0 0 60 0z" fill="#f2c14e" /><circle cx="40" cy="44" r="10" fill="#e64a2e" /><circle cx="60" cy="40" r="9" fill="#5fae3d" /><circle cx="50" cy="32" r="8" fill="#f6e3b4" /></g>,
  ];
  return <svg width="110" height="100" viewBox="0 0 100 92" aria-hidden="true">{shapes[kind % 4]}</svg>;
}

const MENU = [
  { c: 'Lanches', n: 'Clássico da casa', d: 'Pão brioche, blend 160g, queijo e molho especial.', p: 32, k: 0 },
  { c: 'Lanches', n: 'Duplo cheddar', d: 'Dois blends, muito cheddar e cebola caramelizada.', p: 39, k: 0 },
  { c: 'Porções', n: 'Batata rústica', d: 'Crocante por fora, macia por dentro.', p: 22, k: 1 },
  { c: 'Bebidas', n: 'Refrigerante lata', d: 'Gelado, 350 ml.', p: 7, k: 2 },
  { c: 'Porções', n: 'Salada da casa', d: 'Folhas, tomate, milho e molho da casa.', p: 24, k: 3 },
  { c: 'Lanches', n: 'Frango crocante', d: 'Filé empanado, maionese verde e alface.', p: 30, k: 0 },
  { c: 'Bebidas', n: 'Suco natural', d: 'Laranja ou limão, 500 ml.', p: 12, k: 2 },
  { c: 'Porções', n: 'Anéis de cebola', d: 'Empanados e sequinhos.', p: 21, k: 1 },
];

export default function Delivery({ cfg }: TplProps) {
  const name = displayName(cfg);
  const [cat, setCat] = useState('Todos');
  const [cart, setCart] = useState(0);
  const [bump, setBump] = useState(0);
  const list = MENU.filter((m) => cat === 'Todos' || m.c === cat);
  const add = () => { setCart((c) => c + 1); setBump((b) => b + 1); };
  return (
    <>
      <div style={{ position: 'relative', height: 0 }}><Aurora style={{ inset: '0 0 auto 0', height: 820 }} /></div>
      <div className="w" style={{ position: 'relative', zIndex: 1 }}>
        <header className="nav a1">
          <Brand cfg={cfg} />
          <nav><a href="#cardapio">Cardápio</a><a href="#combos">Combos</a><a href="#sobre">Sobre</a><a href="#contato">Contato</a></nav>
          <a className="b btn" href="#cardapio" style={{ background: 'var(--ink)', color: 'var(--on-ink)', padding: '11px 20px' }}>Peça agora</a>
        </header>
        <section className="hg">
          <div>
            <h1 className="dis h1" style={{ fontSize: 104, margin: 0 }}>{cfg.slogan ? <Split text={cfg.slogan} /> : <><Split text="Feito" /><br /><Split text="melhor." delay={0.55} cls="shine" /></>}</h1>
            <p className="a3" style={{ fontSize: 18, fontWeight: 500, marginTop: 20, maxWidth: 430 }}>Os favoritos da {name}, preparados na hora e entregues quentinhos na sua casa.</p>
            <div className="a4" style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              <a className="b btn" href="#cardapio" style={{ background: 'var(--p)', color: 'var(--on-p)' }}>Ver cardápio</a>
              <a className="b btn" href="#contato" style={{ border: '1.5px solid var(--fg)' }}>Pedir no WhatsApp</a>
            </div>
            <div className="a5" style={{ display: 'flex', gap: 22, marginTop: 28 }}>
              {[['leaf', 'Ingredientes frescos'], ['truck', 'Entrega rápida']].map(([i, t]) => <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, fontSize: 14 }}><span style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--p)', color: 'var(--on-p)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={i} size={18} /></span>{t}</span>)}
            </div>
          </div>
          <div className="vis" style={{ position: 'relative', height: 440, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="zm" style={{ position: 'absolute', right: 0, top: '12%', width: '78%', height: '74%', background: 'var(--p)', borderRadius: '42% 58% 50% 50% / 50% 40% 60% 50%', transform: 'rotate(-8deg)' }} />
            <div className="fl" style={{ position: 'relative', width: '90%', maxWidth: 440, display: 'flex', justifyContent: 'center' }}>
              <PhotoOr cfg={cfg} style={{ borderRadius: 28, height: 360 }} fallback={<Burger size={420} />} />
            </div>
            <span className="fl" style={{ position: 'absolute', left: 0, bottom: 30, background: 'var(--card)', borderRadius: 16, padding: '12px 16px', boxShadow: '0 16px 30px -14px rgba(0,0,0,.35)', fontSize: 13, animationDelay: '1.2s' }}><b>Clássico da casa</b><br /><span style={{ color: 'var(--p-text)', fontWeight: 700 }}>R$ 32,00</span></span>
          </div>
        </section>
      </div>

      <div style={{ background: 'var(--ink)', color: 'var(--on-ink)', transform: 'rotate(-1.6deg)', margin: '30px -10px 40px', padding: '16px 0', boxShadow: '0 20px 40px -20px rgba(0,0,0,.5)', position: 'relative', zIndex: 2 }}><Marquee words={['Peça agora', 'Quentinho', 'Entrega rápida', name, 'Ingredientes frescos', 'Sabor de verdade']} speed={26} style={{ fontFamily: "Anton,sans-serif", fontSize: 34, letterSpacing: '.04em', textTransform: 'uppercase' }} /></div>
      <section id="cardapio" className="w" style={{ paddingTop: 30, paddingBottom: 60 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
          <h2 className="dis rv" style={{ fontSize: 44, margin: 0 }}>— Nosso <span style={{ color: 'var(--p-text)' }}>cardápio</span> —</h2>
          <div className="cats rv">{['Todos', 'Lanches', 'Porções', 'Bebidas'].map((c) => <button key={c} className={'cat' + (c === cat ? ' on' : '')} onClick={() => setCat(c)}>{c}</button>)}</div>
        </div>
        <div className="grid">
          {list.map((m, i) => (
            <div key={m.n} className="it lift" style={{ animation: `up .5s ${i * 0.06}s both` }}>
              <div className="plate"><Dish kind={m.k} /></div>
              <div style={{ fontWeight: 700, marginTop: 12 }}>{m.n}</div>
              <div style={{ fontSize: 13, color: 'var(--mut)', marginTop: 4, flex: 1 }}>{m.d}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <b style={{ color: 'var(--p-text)', fontSize: 17 }}>R$ {m.p},00</b>
                <button className="add" onClick={add} aria-label={`Adicionar ${m.n}`}><Icon name="plus" size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="combos" className="w" style={{ paddingBottom: 50 }}>
        <div className="combo rv">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="dis" style={{ fontSize: 64 }}>Os <span style={{ color: 'var(--p)' }}>melhores</span><br />combos</div>
            <p style={{ opacity: 0.8, marginTop: 14 }}>Lanche + porção + bebida com preço especial.</p>
            <button className="b btn" onClick={add} style={{ background: 'var(--p)', color: 'var(--on-p)', marginTop: 16 }}>Quero um combo</button>
          </div>
          <div className="fl" style={{ display: 'flex', justifyContent: 'center', gap: 0 }}><Burger size={230} /><span style={{ marginLeft: -40, marginTop: 60 }}><Dish kind={1} /></span></div>
        </div>
      </section>

      <section id="sobre" className="w feat" style={{ paddingBottom: 60 }}>
        {[['leaf', 'Ingredientes frescos', 'Comprados todo dia.'], ['truck', 'Entrega rápida', 'Quentinho até você.'], ['star', 'Sabor de verdade', 'Receitas da casa.'], ['heart', 'Preço justo', 'Qualidade que cabe no bolso.']].map(([i, t, d]) => (
          <div key={t} className="rv" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 18, padding: 18 }}>
            <span style={{ color: 'var(--p-text)' }}><Icon name={i} size={26} /></span><div><b style={{ fontSize: 14 }}>{t}</b><div style={{ fontSize: 13, color: 'var(--mut)' }}>{d}</div></div>
          </div>
        ))}
      </section>

      <FloatCta label="Pedir agora" left />
      <footer id="contato" style={{ background: 'var(--p)', color: 'var(--on-p)' }}>
        <div className="w" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap', padding: '40px 26px' }}>
          <div><div className="dis" style={{ fontSize: 40 }}>Bateu a fome?</div><div style={{ fontWeight: 600, marginTop: 6 }}>Peça pelo site ou chame a {name} no WhatsApp.</div></div>
          <a className="b btn" href="#cardapio" style={{ background: 'var(--ink)', color: 'var(--on-ink)' }}><Icon name="chat" size={18} /> Fazer pedido</a>
        </div>
        <div style={{ borderTop: '1px solid color-mix(in srgb,var(--on-p) 20%,transparent)' }}><PoweredBy /></div>
      </footer>

      <div className="cartb">
        <span key={bump} className={bump ? 'bump' : ''} style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--p)', color: 'var(--on-p)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="cart" size={17} /></span>
        {cart} {cart === 1 ? 'item' : 'itens'}
      </div>
    </>
  );
}
