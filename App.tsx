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

export default function App() {
  const bp = useBreakpoints();
  const reduced = useReducedMotion();
  const headerHeight = useHeaderHeight();

  const scrollRef = useRef<any>(null);
  const positions = useRef<Record<string, number>>({});
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [toastMsg, setToastMsg] = useState('');
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [brief, setBrief] = useState<BriefState>({
    step: 1,
    service: 'Site ou landing page',
    name: '',
    company: '',
    goal: '',
  });

  // Ajusta metadados e rolagem do documento no navegador para comportamento fiel à referência.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.documentElement.lang = 'pt-BR';
    document.title = '<Code> Labs — Sua próxima fase, em código.';
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
    toastTimer.current = setTimeout(() => setToastMsg(''), 4000);
  }, []);

  const openPrivacy = useCallback(() => setPrivacyOpen(true), []);

  const chooseService = useCallback((service: string) => {
    setBrief((s) => ({ ...s, service, step: 1 }));
  }, []);

  const nav = useMemo(
    () => ({ scrollTo, register, reduced, toast, openPrivacy, chooseService }),
    [scrollTo, register, reduced, toast, openPrivacy, chooseService],
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
        <PrivacyModal visible={privacyOpen} onClose={() => setPrivacyOpen(false)} />
        <Toast message={toastMsg} />
      </View>
    </NavContext.Provider>
  );
}
