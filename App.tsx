import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { C, useBreakpoints, web } from './src/theme';
import { useReducedMotion } from './src/motion';
import { NavContext } from './src/ui';
import { Header, SkipLink, useHeaderHeight } from './src/sections/Header';
import { Hero } from './src/sections/Hero';
import { BlueBand } from './src/sections/BlueBand';
import { Services } from './src/sections/Services';
import { CrmSection } from './src/sections/CrmSection';
import { About } from './src/sections/About';
import { Approach } from './src/sections/Approach';
import { Brief, type BriefState } from './src/sections/Brief';
import { Faq } from './src/sections/Faq';
import { Footer } from './src/sections/Footer';
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

const DEFAULT_CATEGORIES: CookieCategories = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export default function App() {
  const bp = useBreakpoints();
  const reduced = useReducedMotion();
  const headerHeight = useHeaderHeight();

  const scrollRef = useRef<any>(null);
  const positions = useRef<Record<string, number>>({});
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [toastMsg, setToastMsg] = useState('');
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('privacidade');

  const [consentRecord, setConsentRecord] = useState(() => loadCurrentConsent());
  const [cookieBannerVisible, setCookieBannerVisible] = useState(() => loadCurrentConsent() === null);
  const [cookieCategories, setCookieCategories] = useState<CookieCategories>(
    () => loadCurrentConsent()?.categories ?? DEFAULT_CATEGORIES,
  );

  const [brief, setBrief] = useState<BriefState>({
    step: 1,
    service: 'Site ou landing page',
    name: '',
    company: '',
    goal: '',
    lgpdConsent: false,
  });

  // Aplica o bloqueio técnico de cookies não essenciais logo na montagem
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

  // Ajusta metadados, favicon da logo (substituindo qualquer cache de /favicon.ico) e rolagem no navegador
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.documentElement.lang = 'pt-BR';
    document.title = '<Code> Labs — Sua próxima fase, em código.';

    // Remove links antigos de ícone e injeta o Data URI PNG da logo + /favicon.png
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
      html { height: auto !important; overflow-y: auto !important; background: #101110; color-scheme: dark; scroll-padding-top: ${bp.md ? 80 : 92}px; }
      body { margin: 0; height: auto !important; overflow: visible !important; background: #101110; -webkit-font-smoothing: antialiased; }
      #root { height: auto !important; min-height: 100vh; display: block !important; }
      ::selection { background: #d5ff51; color: #101110; }
    `;
    const prev = document.getElementById(style.id);
    if (prev) prev.remove();
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, [bp.md]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const register = useCallback((id: string, y: number) => {
    positions.current[id] = y;
  }, []);

  const scrollTo = useCallback(
    (id: string) => {
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        if (id === 'inicio') {
          window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
          return;
        }
        const el = document.getElementById(id);
        if (el) {
          const offset = bp.md ? 80 : 92;
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
          return;
        }
      }
      const y = positions.current[id] ?? 0;
      scrollRef.current?.scrollTo({ y: Math.max(0, y - headerHeight), animated: !reduced });
    },
    [bp.md, headerHeight, reduced],
  );

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(''), 4500);
  }, []);

  const openPrivacy = useCallback((tab: LegalTab = 'privacidade') => {
    setLegalTab(tab);
    setLegalOpen(true);
  }, []);

  const openCookiePrefs = useCallback(() => {
    setCookieBannerVisible(true);
  }, []);

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

  const chooseService = useCallback((service: string) => {
    setBrief((s) => ({ ...s, service, step: 1 }));
  }, []);

  const nav = useMemo(
    () => ({ scrollTo, register, reduced, toast, openPrivacy, openCookiePrefs, chooseService }),
    [scrollTo, register, reduced, toast, openPrivacy, openCookiePrefs, chooseService],
  );

  const content = (
    <>
      <View role="main" style={{ paddingTop: Platform.OS === 'web' ? 0 : headerHeight }}>
        <Hero />
        <BlueBand />
        <Services />
        <CrmSection />
        <About />
        <Approach />
        <Brief state={brief} setState={setBrief} />
        <Faq />
      </View>
      <Footer />
    </>
  );

  return (
    <NavContext.Provider value={nav}>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: C.ink, ...web({ minHeight: '100vh' }) }}>
        <SkipLink />
        {Platform.OS === 'web' ? (
          <>
            <View style={web({ position: 'sticky', top: 0, zIndex: 40, height: headerHeight })}>
              <Header height={headerHeight} />
            </View>
            {content}
          </>
        ) : (
          <>
            <Header height={headerHeight} />
            <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
              {content}
            </ScrollView>
          </>
        )}
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
