import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { themeVars, type Cfg } from './templates/kit';
import { byId } from './templates';

/** Renderiza o modelo escolhido com as cores e dados do cliente. */
export function TemplateView({ cfg }: { cfg: Cfg }) {
  const T = byId(cfg.template);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeVars(cfg) + T.css }} />
      <T.Comp key={T.id} cfg={cfg} />
    </>
  );
}

type Props = { cfg: Cfg; width: number | string; height: number | string; nonce: number; title?: string };

/**
 * Mostra o site do cliente dentro de um iframe do tamanho do aparelho escolhido,
 * para que o layout de celular/tablet/computador funcione de verdade.
 */
export const SiteFrame = forwardRef<HTMLIFrameElement | null, Props>(function SiteFrame({ cfg, width, height, nonce, title }, ref) {
  const iref = useRef<HTMLIFrameElement>(null);
  const root = useRef<Root | null>(null);
  const cfgRef = useRef(cfg);
  cfgRef.current = cfg;
  useImperativeHandle(ref, () => iref.current as HTMLIFrameElement);

  useEffect(() => {
    const frame = iref.current;
    const doc = frame?.contentDocument;
    if (!frame || !doc) return;
    doc.open();
    doc.write('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="r"></div></body></html>');
    doc.close();
    const r = createRoot(doc.getElementById('r') as HTMLElement);
    root.current = r;
    r.render(<TemplateView cfg={cfgRef.current} />);
    return () => {
      root.current = null;
      setTimeout(() => r.unmount(), 0);
    };
  }, [nonce]);

  useEffect(() => {
    root.current?.render(<TemplateView cfg={cfg} />);
  }, [cfg]);

  useEffect(() => {
    iref.current?.contentWindow?.scrollTo({ top: 0 });
  }, [cfg.template, cfg.type]);

  return <iframe ref={iref} title={title || 'Prévia do site'} style={{ width, height, border: 0, display: 'block', background: '#fff' }} />;
});
