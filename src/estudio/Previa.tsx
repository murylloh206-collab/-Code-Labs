import React, { useEffect, useState } from 'react';
import { SiteFrame } from './Frame';
import { loadCfg, STORE_KEY } from './Estudio';

/** Site montado no Estúdio, em tela cheia (aberto em nova guia). */
export default function Previa() {
  const [cfg, setCfg] = useState(loadCfg);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    document.title = `${cfg.name || 'Seu site'} · prévia do Estúdio <Code> Labs`;
    const onStorage = (e: StorageEvent) => { if (e.key === STORE_KEY) setCfg(loadCfg()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [cfg.name]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0c0b0f' }}>
      <SiteFrame cfg={cfg} width="100%" height="100%" nonce={0} title={`Prévia do site ${cfg.name}`} />
      {!hide && (
        <div style={{ position: 'fixed', left: '50%', bottom: 64, transform: 'translateX(-50%)', zIndex: 10, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(12,11,15,.92)', backdropFilter: 'blur(10px)', color: '#f2f0f6', borderRadius: 999, padding: '8px 8px 8px 18px', fontFamily: 'system-ui,sans-serif', fontSize: 13, boxShadow: '0 16px 40px -12px rgba(0,0,0,.6)', maxWidth: 'calc(100vw - 24px)' }}>
          <span>Prévia feita no <b>Estúdio &lt;Code&gt; Labs</b></span>
          <a href="#/estudio" style={{ background: '#c6ff34', color: '#0c0b0f', textDecoration: 'none', fontWeight: 800, borderRadius: 999, padding: '10px 16px', whiteSpace: 'nowrap' }}>Editar / orçamento</a>
          <button onClick={() => setHide(true)} aria-label="Esconder barra" style={{ border: 0, background: 'transparent', color: '#a9a5b4', width: 36, height: 36, cursor: 'pointer' }}>✕</button>
        </div>
      )}
    </div>
  );
}
