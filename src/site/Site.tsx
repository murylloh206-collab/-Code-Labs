import React, { useEffect, useState } from 'react';
import Criativo from './Criativo';
import Portfolio from './Portfolio';
import Dashboard from './Dashboard';
import { SITE } from './config';
import Estudio from '../estudio/Estudio';
import Previa from '../estudio/Previa';

type Route = 'home' | 'portfolio' | 'painel' | 'estudio' | 'previa';

const TITLES: Record<Route, string> = {
  home: '<Code> Labs — Sites, cardápios online e sistemas sob medida',
  portfolio: 'Portfólio — <Code> Labs',
  painel: 'Painel de gestão (demonstração) — <Code> Labs',
  estudio: 'Estúdio <Code> Labs — Seu site com a sua cara',
  previa: 'Prévia do seu site — Estúdio <Code> Labs',
};
const BG: Record<Route, string> = { home: '#f3efe9', portfolio: '#f3efe9', painel: '#0e0c11', estudio: '#0c0b0f', previa: '#0c0b0f' };

function readRoute(): Route {
  if (typeof window === 'undefined') return 'home';
  const h = window.location.hash;
  if (h.startsWith('#/portfolio')) return 'portfolio';
  if (h.startsWith('#/painel')) return 'painel';
  if (h.startsWith('#/estudio')) return 'estudio';
  if (h.startsWith('#/previa')) return 'previa';
  return 'home';
}

type Props = { onLegal?: (tab: string) => void; onCookies?: () => void };

/** Site novo da <Code> Labs (Ref. 1): início, portfólio (#/portfolio) e painel demo (#/painel). */
export default function Site({ onLegal, onCookies }: Props) {
  const [route, setRoute] = useState<Route>(readRoute);

  useEffect(() => {
    const onHash = () => {
      const next = readRoute();
      setRoute((prev) => {
        if (prev !== next) window.scrollTo({ top: 0 });
        return next;
      });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.title = TITLES[route];
    document.documentElement.style.background = BG[route];
    document.body.style.background = BG[route];
  }, [route]);

  if (route === 'portfolio') return <Portfolio whatsapp={SITE.whatsapp} />;
  if (route === 'painel') return <Dashboard />;
  if (route === 'estudio') return <Estudio />;
  if (route === 'previa') return <Previa />;
  return <Criativo whatsapp={SITE.whatsapp} onLegal={onLegal} onCookies={onCookies} />;
}
