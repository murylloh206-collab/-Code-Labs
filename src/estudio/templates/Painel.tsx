import React, { useEffect, useState } from 'react';
import { BASE_CSS, Icon, Logo, PoweredBy, displayName, fonts, type TplProps } from './kit';

export const css = fonts('Sora:wght@300;400;500;600;700') + BASE_CSS + `
body{font-family:'Sora',system-ui,sans-serif;background:var(--bg2)}
.app{display:grid;grid-template-columns:240px 1fr;gap:14px;max-width:1360px;margin:0 auto;padding:16px}
.sb{background:var(--card);border:1px solid var(--line);border-radius:24px;padding:18px;display:flex;flex-direction:column;gap:14px}
.tiles{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.tile{border:1px solid var(--line);background:transparent;border-radius:14px;padding:14px 8px;display:flex;flex-direction:column;align-items:center;gap:6px;font-size:12px;transition:all .25s}
.tile.on{background:var(--ink);color:var(--on-ink);border-color:var(--ink)}
.c{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:18px;position:relative;overflow:hidden}
.top{background:linear-gradient(120deg,var(--card),var(--soft));display:grid;grid-template-columns:1fr 260px;gap:10px;align-items:center}
.g3{display:grid;grid-template-columns:1fr 1.2fr .9fr;gap:14px}
.mini{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
.pill{border:1px solid var(--line);background:transparent;border-radius:999px;padding:7px 14px;font-size:12px;font-weight:600}
.pill.on{background:var(--ink);color:var(--on-ink);border-color:var(--ink)}
table{width:100%;border-collapse:collapse;font-size:13px}th{text-align:left;font-weight:500;color:var(--mut);background:var(--bg2);padding:10px}td{padding:12px 10px;border-bottom:1px solid var(--line)}
@keyframes gauge{from{stroke-dasharray:0 100}}
.bar{transform-origin:bottom;animation:grow 1.2s cubic-bezier(.2,.7,.2,1) both}
.ln{stroke-dasharray:1200;animation:draw 2s .3s cubic-bezier(.2,.7,.2,1) both}
@media (max-width:980px){.app{grid-template-columns:1fr}.sb{flex-direction:row;flex-wrap:wrap;align-items:center}.tiles{grid-template-columns:repeat(6,1fr);flex:1}.g3,.top{grid-template-columns:1fr}.mini{grid-template-columns:repeat(2,1fr)}.hide{display:none}}
@media (max-width:520px){.tiles{grid-template-columns:repeat(3,1fr)}}
.toast{position:fixed;right:18px;bottom:18px;z-index:60;display:flex;gap:12px;align-items:center;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:12px 16px 14px;box-shadow:0 24px 50px -18px rgba(0,0,0,.4);overflow:hidden;max-width:300px;animation:tin .6s cubic-bezier(.2,.9,.3,1.3) both,tout .5s 3.6s ease-in forwards}
.tbar{position:absolute;left:0;bottom:0;height:3px;width:100%;background:var(--p);transform-origin:0 50%;animation:tb 4s linear both}
@keyframes tin{from{transform:translateX(120%) scale(.9);opacity:0}}
@keyframes tout{to{transform:translateY(20px) scale(.95);opacity:0}}
@keyframes tb{from{transform:scaleX(1)}to{transform:scaleX(0)}}
@media (max-width:700px){.toast{left:12px;right:12px;max-width:none}}
`;

export default function Painel({ cfg }: TplProps) {
  const name = displayName(cfg);
  const [tile, setTile] = useState(0);
  const [tab, setTab] = useState(0);
  const [hover, setHover] = useState(9);
  const tiles = [['home', 'Painel'], ['users', 'Clientes'], ['calendar', 'Agenda'], ['box', 'Pedidos'], ['chart', 'Relatórios'], ['gear', 'Ajustes']];
  const data = [42, 48, 45, 58, 52, 61, 57, 66, 63, 72, 68, 75];
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const pts = data.map((v, i) => [i * (600 / 11), 190 - (v - 30) * 3.6]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(0) + ' ' + p[1].toFixed(0)).join(' ');
  const agenda = [
    [['Reunião com cliente novo', 'Apresentação da proposta', '09:00 - 09:30'], ['Retorno de orçamento', 'Ligar para confirmar', '14:00 - 14:15']],
    [['Separar pedidos do dia', '12 pedidos em aberto', 'Até 11:00'], ['Atualizar estoque', 'Conferir entradas', 'Até 17:00']],
    [['Promoção de fim de mês', 'Divulgar no Instagram', 'Sexta'], ['Aniversário de cliente', 'Enviar cupom', 'Sábado']],
  ][tab];
  const gauge = 0.8;
  const feed = [
    ['users', 'Novo cliente cadastrado', 'Mariana Costa acabou de entrar'],
    ['box', 'Pedido recebido', '#3571 · 2 itens · R$ 148,00'],
    ['calendar', 'Agendamento confirmado', 'Hoje às 15:30 com Ricardo'],
    ['bell', 'Meta do mês', 'Você já bateu 80% da meta'],
  ];
  const [ev, setEv] = useState(-1);
  useEffect(() => {
    const t = window.setInterval(() => setEv((e) => (e + 1) % feed.length), 4200);
    const f = window.setTimeout(() => setEv(0), 2600);
    return () => { window.clearInterval(t); window.clearTimeout(f); };
  }, []);
  return (
    <div className="app">
      <aside className="sb a1">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Logo cfg={cfg} size={34} /><b className="hide" style={{ fontSize: 15 }}>{cfg.logo ? '' : name}</b></div>
        <label className="hide" style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--line)', borderRadius: 12, padding: '9px 12px', fontSize: 13, color: 'var(--mut)' }}><Icon name="search" size={16} /><input placeholder="Buscar" style={{ border: 0, background: 'transparent', outline: 'none', width: '100%' }} /></label>
        <div className="tiles">{tiles.map(([i, l], k) => <button key={l} className={'tile' + (tile === k ? ' on' : '')} onClick={() => setTile(k)}><Icon name={i} size={18} />{l}</button>)}</div>
        <div className="hide" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--ink)', color: 'var(--on-ink)', borderRadius: 14, padding: 10 }}>
          <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--p)', color: 'var(--on-p)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>AD</span>
          <div style={{ fontSize: 12 }}><b>Administrador</b><div style={{ opacity: 0.7 }}>{name}</div></div>
        </div>
      </aside>

      <main style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
        <section className="c top a2">
          <div>
            <div style={{ fontSize: 13, color: 'var(--mut)' }}>Início / Painel</div>
            <h1 style={{ fontSize: 36, fontWeight: 400, margin: '14px 0 4px' }}>Bom dia, {name}</h1>
            <div style={{ color: 'var(--mut)', fontSize: 14 }}>{cfg.slogan || 'Aqui está o resumo do seu negócio hoje.'}</div>
            <div style={{ display: 'flex', gap: 30, marginTop: 24, flexWrap: 'wrap' }}>
              {[['users', '432', 'Clientes'], ['box', '24', 'Pedidos hoje'], ['chart', '8%', 'Crescimento'], ['calendar', '6', 'Agendamentos']].map(([i, n, l]) => <div key={l}><span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}><Icon name={i} size={16} style={{ color: 'var(--mut)' }} /><b style={{ fontSize: 30, fontWeight: 500 }}>{n}</b></span><div style={{ fontSize: 13, color: 'var(--mut)' }}>{l}</div></div>)}
            </div>
          </div>
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <svg viewBox="0 0 200 120" width="240" aria-hidden="true">
              <path d="M20 110 A80 80 0 0 1 180 110" fill="none" stroke="var(--line)" strokeWidth="14" strokeLinecap="round" />
              <path d="M20 110 A80 80 0 0 1 180 110" fill="none" stroke="var(--p)" strokeWidth="14" strokeLinecap="round" pathLength={100} strokeDasharray={`${gauge * 100} 100`} style={{ animation: 'gauge 1.8s .4s cubic-bezier(.2,.7,.2,1) both' }} />
            </svg>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 58 }}><b style={{ fontSize: 30, fontWeight: 500 }}>80%</b><div style={{ fontSize: 12, color: 'var(--mut)' }}>Satisfação dos clientes</div></div>
          </div>
        </section>

        <section className="g3">
          <div className="c a3">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><b>Agenda</b><Icon name="calendar" size={18} /></div>
            <div style={{ display: 'flex', gap: 6, margin: '14px 0' }}>{['Reuniões', 'Tarefas', 'Eventos'].map((t, i) => <button key={t} className={'pill' + (tab === i ? ' on' : '')} onClick={() => setTab(i)}>{t}</button>)}</div>
            {agenda.map(([t, d, h], i) => (
              <div key={tab + t} className="a1" style={{ borderRadius: 16, padding: 14, marginTop: 8, background: i === 0 ? 'linear-gradient(180deg,var(--soft),var(--card))' : 'var(--bg2)', border: '1px solid var(--line)', animationDelay: `${i * 0.08}s` }}>
                <b style={{ fontSize: 14 }}>{t}</b><div style={{ fontSize: 12, color: 'var(--mut)', marginTop: 4 }}>{d}</div>
                <span style={{ display: 'inline-block', marginTop: 10, fontSize: 11, border: '1px solid var(--line)', borderRadius: 999, padding: '4px 10px' }}>{h}</span>
              </div>
            ))}
          </div>
          <div className="c a4">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><div><b style={{ fontSize: 30, fontWeight: 500 }}>{data[hover]}%</b><div style={{ fontSize: 12, color: 'var(--mut)' }}>Meta de vendas · {months[hover]}</div></div><span style={{ width: 38, height: 38, borderRadius: 12, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="arrowUp" size={16} /></span></div>
            <svg viewBox="0 0 600 200" preserveAspectRatio="none" style={{ width: '100%', height: 180, marginTop: 14, overflow: 'visible' }} onMouseLeave={() => setHover(9)}>
              <line x1="0" y1="110" x2="600" y2="110" stroke="var(--line)" strokeDasharray="5 6" />
              <path className="ln" d={line} fill="none" stroke="var(--p)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
              <circle cx={pts[hover][0]} cy={pts[hover][1]} r="7" fill="var(--p)" stroke="var(--card)" strokeWidth="3" style={{ transition: 'all .25s' }} />
              {pts.map((p, i) => <rect key={i} x={p[0] - 25} y="0" width="50" height="200" fill="transparent" onMouseEnter={() => setHover(i)} />)}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--mut)' }}>{months.filter((_, i) => i % 2 === 0).map((m) => <span key={m}>{m}</span>)}</div>
          </div>
          <div className="c a5">
            <b>Pedidos por canal</b><div style={{ fontSize: 12, color: 'var(--mut)', marginTop: 4 }}>Últimos 30 dias</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 190, marginTop: 14 }}>
              {[[49, 'Site', 'var(--p)'], [31, 'WhatsApp', 'var(--s)'], [20, 'Loja', 'var(--ink)']].map(([v, l, c], i) => (
                <div key={l as string} className="bar" style={{ flex: 1, height: `${(v as number) * 1.8 + 20}%`, maxHeight: '100%', background: c as string, borderRadius: 14, color: i === 0 ? 'var(--on-p)' : i === 1 ? 'var(--on-s)' : 'var(--on-ink)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: 8, fontSize: 11, animationDelay: `${0.3 + i * 0.12}s` }}>
                  <span style={{ background: 'rgba(255,255,255,.25)', borderRadius: 999, padding: '3px 7px' }}>{v}%</span><span>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mini">
          {[['Novos clientes', '12'], ['Orçamentos', '8'], ['Entregas', '19'], ['Retornos', '5'], ['Avaliações', '4,9']].map(([l, n], i) => (
            <div key={l} className="c lift" style={{ padding: 14, animation: `up .6s ${0.4 + i * 0.06}s both` }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--p)', display: 'block' }} />
              <div style={{ fontSize: 11, color: 'var(--mut)', marginTop: 10 }}>{l}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}><b style={{ fontSize: 20, fontWeight: 500 }}>{n}</b><Icon name="arrowUp" size={14} /></div>
            </div>
          ))}
        </section>

        <section className="c a5" style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}><b>Clientes recentes</b><span style={{ fontSize: 12, color: 'var(--mut)' }}>Dados de exemplo</span></div>
          <table>
            <thead><tr><th>NOME</th><th>CÓDIGO</th><th>SERVIÇO</th><th>STATUS</th><th>DATA</th></tr></thead>
            <tbody>
              {[['Mariana Costa', '#3564', 'Pedido recorrente', 'Ativo', 'Hoje'], ['Ricardo Alves', '#3565', 'Orçamento', 'Em análise', 'Ontem'], ['Júlia Prado', '#3566', 'Entrega', 'Concluído', '20/11']].map((r) => (
                <tr key={r[1]}>{r.map((c, j) => <td key={j}>{j === 0 ? <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--soft)', color: 'var(--p-text)', fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.split(' ').map((w) => w[0]).join('')}</span>{c}</span> : j === 3 ? <span style={{ color: 'var(--p-text)', fontWeight: 600 }}>{c}</span> : c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </section>
        <div style={{ color: 'var(--mut)' }}><PoweredBy accent="var(--p)" /></div>
      </main>
      {ev >= 0 && (
        <div key={ev} data-nofx="" className="toast">
          <span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--p)', color: 'var(--on-p)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={feed[ev][0]} size={18} /></span>
          <div><b style={{ fontSize: 13 }}>{feed[ev][1]}</b><div style={{ fontSize: 12, color: 'var(--mut)', marginTop: 2 }}>{feed[ev][2]}</div></div>
          <i className="tbar" />
        </div>
      )}
    </div>
  );
}
