import React, { useEffect, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { C, rem, useBreakpoints, web } from './theme';
import { Button, T, useNav } from './ui';
import type { LegalTab } from './LegalConfig';

export const COOKIE_STORAGE_KEY = 'codelabs_cookie_consent_v1';

export type CookieConsent = {
  version: 1;
  timestamp: string;
  essential: true;
  analytics: boolean;
};

export function loadCookieConsent(): CookieConsent | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(COOKIE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 1 && typeof parsed.analytics === 'boolean') return parsed;
  } catch {
    // ignore storage access errors
  }
  return null;
}

export function saveCookieConsent(analytics: boolean): CookieConsent {
  const consent: CookieConsent = {
    version: 1,
    timestamp: new Date().toISOString(),
    essential: true,
    analytics,
  };
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(consent));
    } catch {
      // ignore storage errors
    }
  }
  return consent;
}

export function CookieBanner({
  visible,
  initialAnalytics,
  onSave,
  onOpenLegal,
}: {
  visible: boolean;
  initialAnalytics: boolean;
  onSave: (analytics: boolean) => void;
  onOpenLegal: (tab: LegalTab) => void;
}) {
  const bp = useBreakpoints();
  const { reduced } = useNav();
  const [configuring, setConfiguring] = useState(false);
  const [analytics, setAnalytics] = useState(initialAnalytics);

  useEffect(() => {
    setAnalytics(initialAnalytics);
  }, [initialAnalytics, visible]);

  if (!visible) return null;

  return (
    <View
      testID="cookie-banner"
      role="dialog"
      aria-label="Aviso e preferências de cookies"
      style={{
        position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
        left: bp.sm ? 12 : 24,
        right: bp.sm ? 12 : 24,
        bottom: bp.sm ? 12 : 24,
        zIndex: 90,
        alignItems: 'center',
        pointerEvents: 'box-none',
      }}
    >
      <View
        style={{
          width: '100%',
          maxWidth: 980,
          backgroundColor: '#191b19',
          borderWidth: 1,
          borderColor: '#485041',
          borderRadius: 12,
          padding: bp.sm ? 18 : 24,
          ...web({ boxShadow: '0 20px 50px rgba(0,0,0,0.65)' }),
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
            <T style={{ color: C.paper, fontSize: rem(0.95), fontWeight: '700', marginBottom: 6 }}>
              Sua privacidade e uso de cookies (LGPD)
            </T>
            <T style={{ color: '#b4bca9', fontSize: rem(0.8), lineHeight: rem(0.8) * 1.6 }}>
              Utilizamos cookies estritamente necessários para o funcionamento do site e, somente com o seu consentimento, cookies opcionais de preferências e análise. Você pode aceitar todos, manter apenas os essenciais ou ajustar suas escolhas a qualquer momento. Leia nossa{' '}
              <T
                role="link"
                onPress={() => onOpenLegal('privacidade')}
                style={{ color: C.lime, textDecorationLine: 'underline' }}
              >
                Política de Privacidade
              </T>
              ,{' '}
              <T
                role="link"
                onPress={() => onOpenLegal('cookies')}
                style={{ color: C.lime, textDecorationLine: 'underline' }}
              >
                Política de Cookies
              </T>{' '}
              e{' '}
              <T
                role="link"
                onPress={() => onOpenLegal('termos')}
                style={{ color: C.lime, textDecorationLine: 'underline' }}
              >
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
                style={{
                  minHeight: 42,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <T style={{ color: '#c8cfbd', fontSize: rem(0.78), textDecorationLine: 'underline' }}>Preferências</T>
              </Pressable>
              <Pressable
                testID="cookie-essential"
                role="button"
                onPress={() => onSave(false)}
                style={(s: any) => [
                  {
                    minHeight: 42,
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderWidth: 1,
                    borderColor: '#55594e',
                    borderRadius: 7,
                    backgroundColor: s.hovered ? '#252820' : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  !reduced ? web({ transitionProperty: 'background-color', transitionDuration: '200ms' }) : null,
                ]}
              >
                <T style={{ color: C.paper, fontSize: rem(0.78), fontWeight: '700' }}>Apenas essenciais</T>
              </Pressable>
              <Button
                label="Aceitar todos"
                testID="cookie-accept-all"
                onPress={() => onSave(true)}
                style={{
                  minHeight: 42,
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  alignSelf: bp.sm ? 'stretch' : 'center',
                }}
                textStyle={{ fontSize: rem(0.78) }}
              />
            </View>
          )}
        </View>

        {configuring && (
          <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: C.line, gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <View style={{ flex: 1 }}>
                <T style={{ color: C.paper, fontSize: rem(0.82), fontWeight: '700' }}>Estritamente necessários</T>
                <T style={{ color: '#9aa28f', fontSize: rem(0.74), marginTop: 3 }}>
                  Garantem a navegação básica, segurança e o registro da sua escolha de consentimento. Sempre ativos.
                </T>
              </View>
              <View style={{ backgroundColor: '#283022', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 4 }}>
                <T style={{ color: C.lime, fontSize: rem(0.7), fontWeight: '700' }}>Sempre ativo</T>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <View style={{ flex: 1 }}>
                <T style={{ color: C.paper, fontSize: rem(0.82), fontWeight: '700' }}>Preferências e análise</T>
                <T style={{ color: '#9aa28f', fontSize: rem(0.74), marginTop: 3 }}>
                  Permitem compreender o uso do site de forma agregada para melhorar desempenho e experiência. Opcionais.
                </T>
              </View>
              <Pressable
                testID="cookie-toggle-analytics"
                role="switch"
                aria-checked={analytics}
                onPress={() => setAnalytics((v) => !v)}
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: analytics ? C.lime : '#383d33',
                  padding: 3,
                  justifyContent: 'center',
                  alignItems: analytics ? 'flex-end' : 'flex-start',
                }}
              >
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: analytics ? C.ink : '#c1c5b8' }} />
              </Pressable>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 6 }}>
              <Pressable
                role="button"
                onPress={() => setConfiguring(false)}
                style={{ minHeight: 40, paddingHorizontal: 14, justifyContent: 'center' }}
              >
                <T style={{ color: '#a3a79c', fontSize: rem(0.78) }}>Voltar</T>
              </Pressable>
              <Button
                label="Salvar preferências"
                testID="cookie-save-prefs"
                onPress={() => {
                  setConfiguring(false);
                  onSave(analytics);
                }}
                style={{ minHeight: 40, paddingVertical: 10, paddingHorizontal: 18 }}
                textStyle={{ fontSize: rem(0.78) }}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

