import React, { useEffect, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { C, rem, useBreakpoints, web } from './theme';
import { Button, T, useNav } from './ui';
import type { LegalTab } from './LegalConfig';
import type { ConsentAction, CookieCategories } from './ConsentManager';

const CATEGORY_INFO: {
  key: keyof Omit<CookieCategories, 'essential'>;
  title: string;
  basis: string;
  desc: string;
}[] = [
  {
    key: 'functional',
    title: 'Funcionalidade e Preferências',
    basis: 'Base Legal: Consentimento (Art. 7º, I da LGPD)',
    desc: 'Permitem lembrar escolhas opcionais de interface e personalização. Desativados por padrão até autorização.',
  },
  {
    key: 'analytics',
    title: 'Análise de Audiência e Desempenho',
    basis: 'Base Legal: Consentimento (Art. 7º, I da LGPD)',
    desc: 'Medem visitas e desempenho das páginas de forma agregada (ex.: Google Analytics). Bloqueados tecnicamente até autorização.',
  },
  {
    key: 'marketing',
    title: 'Publicidade e Marketing',
    basis: 'Base Legal: Consentimento (Art. 7º, I da LGPD)',
    desc: 'Utilizados para mensuração de campanhas e anúncios (ex.: Pixel do Meta / Google Ads). Bloqueados tecnicamente até autorização.',
  },
];

export function CookieBanner({
  visible,
  categories,
  hasDecision,
  onDecide,
  onOpenBanner,
  onOpenLegal,
}: {
  visible: boolean;
  categories: CookieCategories;
  hasDecision: boolean;
  onDecide: (action: ConsentAction, cats: Omit<CookieCategories, 'essential'>) => void;
  onOpenBanner: () => void;
  onOpenLegal: (tab: LegalTab) => void;
}) {
  const bp = useBreakpoints();
  const { reduced } = useNav();
  const [configuring, setConfiguring] = useState(false);
  const [draft, setDraft] = useState({
    functional: categories.functional,
    analytics: categories.analytics,
    marketing: categories.marketing,
  });

  useEffect(() => {
    setDraft({
      functional: categories.functional,
      analytics: categories.analytics,
      marketing: categories.marketing,
    });
  }, [categories, visible]);

  // Quando o banner já foi respondido e está fechado, exibe o selo flutuante permanente de governança LGPD
  if (!visible) {
    const activeCount = [categories.functional, categories.analytics, categories.marketing].filter(Boolean).length;
    const statusLabel = activeCount === 0 ? 'Apenas essenciais' : activeCount === 3 ? 'Todos ativos' : `${activeCount + 1}/4 ativos`;
    return (
      <View
        style={{
          position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
          left: bp.sm ? 12 : 18,
          bottom: bp.sm ? 12 : 18,
          zIndex: 9990,
        }}
      >
        <Pressable
          testID="cookie-floating-badge"
          role="button"
          accessibilityLabel="Gerenciar cookies e privacidade LGPD"
          onPress={onOpenBanner}
          style={(s: any) => [
            {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: s.hovered ? '#22271e' : 'rgba(25,27,25,0.95)',
              borderWidth: 1,
              borderColor: '#525c46',
              borderRadius: 999,
              paddingVertical: 8,
              paddingHorizontal: 14,
              ...web({ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }),
            },
          ]}
        >
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.lime }} />
          <T style={{ color: C.paper, fontSize: rem(0.72), fontWeight: '700' }}>LGPD &amp; Cookies</T>
          <T style={{ color: '#9fa894', fontSize: rem(0.68) }}>({statusLabel})</T>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      testID="cookie-banner"
      role="dialog"
      aria-label="Controle de Privacidade e Consentimento de Cookies (LGPD)"
      style={{
        position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
        left: bp.sm ? 10 : 20,
        right: bp.sm ? 10 : 20,
        bottom: bp.sm ? 10 : 20,
        zIndex: 9999,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: '100%',
          maxWidth: 1080,
          backgroundColor: '#161915',
          borderWidth: 1,
          borderColor: '#5c6849',
          borderRadius: 12,
          padding: bp.sm ? 16 : 22,
          ...web({ boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }),
        }}
      >
        <View
          style={{
            flexDirection: bp.md ? 'column' : 'row',
            alignItems: bp.md ? 'stretch' : 'center',
            justifyContent: 'space-between',
            gap: bp.sm ? 14 : 20,
          }}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <View style={{ backgroundColor: C.lime, paddingVertical: 2, paddingHorizontal: 7, borderRadius: 4 }}>
                <T style={{ color: C.ink, fontSize: rem(0.62), fontWeight: '700', letterSpacing: 0.5 }}>CONFORMIDADE LGPD / ANPD</T>
              </View>
              <T style={{ color: C.paper, fontSize: rem(0.95), fontWeight: '700' }}>
                Controle de Cookies e Privacidade
              </T>
            </View>
            <T style={{ color: '#b8c0ad', fontSize: rem(0.78), lineHeight: rem(0.78) * 1.58 }}>
              Respeitamos sua privacidade conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Cookies estritamente necessários operam por{' '}
              <T style={{ color: '#e2e8d8', fontWeight: '700' }}>legítimo interesse</T> para segurança e funcionamento técnico. Scripts de funcionalidade, análise (ex.: Google Analytics) e publicidade (ex.: Meta Pixel) permanecem{' '}
              <T style={{ color: C.lime, fontWeight: '700' }}>bloqueados tecnicamente</T> até seu consentimento explícito. Consulte nossa{' '}
              <T role="link" onPress={() => onOpenLegal('privacidade')} style={{ color: C.lime, textDecorationLine: 'underline' }}>
                Política de Privacidade
              </T>
              ,{' '}
              <T role="link" onPress={() => onOpenLegal('cookies')} style={{ color: C.lime, textDecorationLine: 'underline' }}>
                Política &amp; Logs de Cookies
              </T>
              ,{' '}
              <T role="link" onPress={() => onOpenLegal('ropa')} style={{ color: C.lime, textDecorationLine: 'underline' }}>
                ROPA &amp; Segurança
              </T>
              ,{' '}
              <T role="link" onPress={() => onOpenLegal('titular')} style={{ color: C.lime, textDecorationLine: 'underline' }}>
                Canal do Titular (DPO)
              </T>{' '}
              e{' '}
              <T role="link" onPress={() => onOpenLegal('termos')} style={{ color: C.lime, textDecorationLine: 'underline' }}>
                Termos de Uso
              </T>
              .
            </T>
          </View>

          {!configuring && (
            <View
              style={{
                flexDirection: bp.sm ? 'column' : 'row',
                alignItems: bp.sm ? 'stretch' : 'center',
                gap: 10,
                flexShrink: 0,
              }}
            >
              <Pressable
                testID="cookie-config"
                role="button"
                onPress={() => setConfiguring(true)}
                style={(s: any) => [
                  {
                    minHeight: 42,
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderWidth: 1,
                    borderColor: '#555d4c',
                    borderRadius: 7,
                    backgroundColor: s.hovered ? '#23281f' : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  !reduced ? web({ transitionProperty: 'background-color', transitionDuration: '200ms' }) : null,
                ]}
              >
                <T style={{ color: '#d5dec8', fontSize: rem(0.76), fontWeight: '600' }}>Personalizar</T>
              </Pressable>

              <Pressable
                testID="cookie-essential"
                role="button"
                onPress={() => onDecide('reject_non_essential', { functional: false, analytics: false, marketing: false })}
                style={(s: any) => [
                  {
                    minHeight: 42,
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderWidth: 1,
                    borderColor: '#7b876b',
                    borderRadius: 7,
                    backgroundColor: s.hovered ? '#282e23' : '#1f241b',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  !reduced ? web({ transitionProperty: 'background-color', transitionDuration: '200ms' }) : null,
                ]}
              >
                <T style={{ color: C.paper, fontSize: rem(0.76), fontWeight: '700' }}>Recusar não essenciais</T>
              </Pressable>

              <Button
                label="Aceitar todos"
                testID="cookie-accept-all"
                onPress={() => onDecide('accept_all', { functional: true, analytics: true, marketing: true })}
                style={{
                  minHeight: 42,
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  alignSelf: bp.sm ? 'stretch' : 'center',
                }}
                textStyle={{ fontSize: rem(0.76) }}
              />
            </View>
          )}
        </View>

        {configuring && (
          <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: C.line, gap: 12 }}>
            {/* Estritamente necessários */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
                backgroundColor: '#1d221a',
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#31382b',
              }}
            >
              <View style={{ flex: 1 }}>
                <T style={{ color: C.paper, fontSize: rem(0.82), fontWeight: '700' }}>1. Cookies Estritamente Necessários</T>
                <T style={{ color: C.lime, fontSize: rem(0.68), marginTop: 2 }}>
                  Base Legal: Legítimo Interesse / Execução Técnica (Art. 7º, IX da LGPD)
                </T>
                <T style={{ color: '#9aa28f', fontSize: rem(0.73), marginTop: 4 }}>
                  Indispensáveis para segurança, integridade da sessão e armazenamento da prova auditável do seu consentimento.
                </T>
              </View>
              <View style={{ backgroundColor: '#283022', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 4 }}>
                <T style={{ color: C.lime, fontSize: rem(0.68), fontWeight: '700' }}>Sempre ativo</T>
              </View>
            </View>

            {/* Categorias granulares opcionais */}
            {CATEGORY_INFO.map((cat, idx) => {
              const active = draft[cat.key];
              return (
                <View
                  key={cat.key}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                    backgroundColor: '#1d221a',
                    padding: 12,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: active ? '#5c6e3b' : '#31382b',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <T style={{ color: C.paper, fontSize: rem(0.82), fontWeight: '700' }}>
                      {idx + 2}. {cat.title}
                    </T>
                    <T style={{ color: '#8295ff', fontSize: rem(0.68), marginTop: 2 }}>{cat.basis}</T>
                    <T style={{ color: '#9aa28f', fontSize: rem(0.73), marginTop: 4 }}>{cat.desc}</T>
                  </View>
                  <Pressable
                    testID={`cookie-toggle-${cat.key}`}
                    role="switch"
                    aria-checked={active}
                    onPress={() => setDraft((d) => ({ ...d, [cat.key]: !d[cat.key] }))}
                    style={{
                      width: 50,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: active ? C.lime : '#383d33',
                      padding: 3,
                      justifyContent: 'center',
                      alignItems: active ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: active ? C.ink : '#c1c5b8' }} />
                  </Pressable>
                </View>
              );
            })}

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginTop: 6 }}>
              <Pressable
                role="button"
                onPress={() => onOpenLegal('cookies')}
                style={{ paddingVertical: 6 }}
              >
                <T style={{ color: C.lime, fontSize: rem(0.74), textDecorationLine: 'underline' }}>
                  Ver registro de auditoria (logs) e detalhes técnicos
                </T>
              </Pressable>

              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <Pressable
                  role="button"
                  onPress={() => setConfiguring(false)}
                  style={{ minHeight: 40, paddingHorizontal: 12, justifyContent: 'center' }}
                >
                  <T style={{ color: '#a3a79c', fontSize: rem(0.76) }}>Voltar</T>
                </Pressable>
                {hasDecision && (
                  <Pressable
                    role="button"
                    onPress={() => {
                      setConfiguring(false);
                      onDecide('revoked', { functional: false, analytics: false, marketing: false });
                    }}
                    style={{
                      minHeight: 40,
                      paddingHorizontal: 14,
                      borderWidth: 1,
                      borderColor: '#9e4742',
                      borderRadius: 7,
                      justifyContent: 'center',
                    }}
                  >
                    <T style={{ color: '#ffb3ae', fontSize: rem(0.75), fontWeight: '700' }}>Revogar consentimento</T>
                  </Pressable>
                )}
                <Button
                  label="Salvar preferências"
                  testID="cookie-save-prefs"
                  onPress={() => {
                    setConfiguring(false);
                    onDecide('custom_preferences', draft);
                  }}
                  style={{ minHeight: 40, paddingVertical: 10, paddingHorizontal: 18 }}
                  textStyle={{ fontSize: rem(0.76) }}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
