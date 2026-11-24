/**
 * Entrada WEB do site (Expo usa este arquivo no navegador; o App.tsx continua valendo no app nativo).
 * Site novo: Ref. 1 "Criativo" (violeta) — src/site/
 * Mantém o banner de cookies, a central de privacidade (LGPD) e os registros de consentimento.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useReducedMotion } from './src/motion';
import { NavContext } from './src/ui';
import { PrivacyModal, Toast } from './src/PrivacyModal';
import { CookieBanner } from './src/CookieBanner';
import {
  applyTechnicalCookieBlocking,
  loadCurrentConsent,
  recordConsentDecision,
  type ConsentAction,
  type CookieCategories,
} from './src/ConsentManager';
import type { LegalTab } from './src/LegalConfig';
import { FAVICON_DATA_URI } from './src/faviconData';
import Site from './src/site/Site';

const DEFAULT_CATEGORIES: CookieCategories = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export default function App() {
  const reduced = useReducedMotion();
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('privacidade');
  const [consentRecord, setConsentRecord] = useState(() => loadCurrentConsent());
  const [cookieBannerVisible, setCookieBannerVisible] = useState(() => loadCurrentConsent() === null);
  const [cookieCategories, setCookieCategories] = useState<CookieCategories>(
    () => loadCurrentConsent()?.categories ?? DEFAULT_CATEGORIES,
  );

  // Bloqueio técnico de cookies não essenciais logo na montagem
  useEffect(() => {
    const existing = loadCurrentConsent();
    if (existing) {
      setConsentRecord(existing);
      setCookieCategories(existing.categories);
      applyTechnicalCookieBlocking(existing.categories);
    } else {
      applyTechnicalCookieBlocking(DEFAULT_CATEGORIES);
      setCookieBannerVisible(true);
    }
  }, []);

  // Metadados, favicon da logo e estilo base do documento
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = 'pt-BR';
    document.querySelectorAll('link[rel*="icon"]').forEach((el) => el.remove());
    for (const rel of ['icon', 'shortcut icon', 'apple-touch-icon']) {
      const link = document.createElement('link');
      link.rel = rel;
      link.type = 'image/png';
      link.href = FAVICON_DATA_URI;
      document.head.appendChild(link);
    }
    const style = document.createElement('style');
    style.id = 'codelabs-web-base';
    style.textContent = `
      html { height: auto !important; overflow-y: auto !important; color-scheme: light; scroll-behavior: smooth; }
      body { margin: 0; height: auto !important; overflow: visible !important; -webkit-font-smoothing: antialiased; }
      #root { height: auto !important; min-height: 100vh; display: block !important; }
      ::selection { background: #7e3bed; color: #ffffff; }
      @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
    `;
    document.getElementById(style.id)?.remove();
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(''), 4500);
  }, []);

  const openPrivacy = useCallback((tab: LegalTab = 'privacidade') => {
    setLegalTab(tab);
    setLegalOpen(true);
  }, []);

  const openCookiePrefs = useCallback(() => setCookieBannerVisible(true), []);

  const handleCookieDecision = useCallback(
    (action: ConsentAction, partial: Omit<CookieCategories, 'essential'>) => {
      const rec = recordConsentDecision(action, partial);
      setConsentRecord(rec);
      setCookieCategories(rec.categories);
      setCookieBannerVisible(false);
      if (action === 'accept_all') {
        toast(`Consentimento registrado (${rec.consentId}): todos os cookies autorizados.`);
      } else if (action === 'reject_non_essential' || action === 'revoked') {
        toast(`Registro (${rec.consentId}): apenas cookies estritamente necessários ativos.`);
      } else {
        toast(`Preferências personalizadas salvas (${rec.consentId}).`);
      }
    },
    [toast],
  );

  const handleRevokeConsent = useCallback(() => {
    handleCookieDecision('revoked', { functional: false, analytics: false, marketing: false });
  }, [handleCookieDecision]);

  const scrollTo = useCallback(
    (id: string) => {
      if (id === 'inicio') {
        window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
        return;
      }
      document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    },
    [reduced],
  );

  const nav = useMemo(
    () => ({
      scrollTo,
      register: () => {},
      reduced,
      toast,
      openPrivacy,
      openCookiePrefs,
      chooseService: () => {},
    }),
    [scrollTo, reduced, toast, openPrivacy, openCookiePrefs],
  );

  return (
    <NavContext.Provider value={nav as any}>
      <Site onLegal={(tab) => openPrivacy(tab as LegalTab)} onCookies={openCookiePrefs} />
      <View pointerEvents="box-none">
        <CookieBanner
          visible={cookieBannerVisible}
          categories={cookieCategories}
          hasDecision={Boolean(consentRecord)}
          onDecide={handleCookieDecision}
          onOpenBanner={() => setCookieBannerVisible(true)}
          onOpenLegal={openPrivacy}
        />
        <PrivacyModal
          visible={legalOpen}
          tab={legalTab}
          onChangeTab={setLegalTab}
          onClose={() => setLegalOpen(false)}
          onOpenCookiePrefs={openCookiePrefs}
          onRevokeConsent={handleRevokeConsent}
        />
        <Toast message={toastMsg} />
      </View>
    </NavContext.Provider>
  );
}
