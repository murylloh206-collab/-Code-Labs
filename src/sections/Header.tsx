import React, { useEffect, useState } from 'react';
import { Image, Platform, Pressable, View } from 'react-native';
import { C, gutter, rem, useBreakpoints, web } from '../theme';
import { Anchor, Button, T, useNav } from '../ui';

export const LINKS: [string, string][] = [
  ['solucoes', 'O que fazemos'],
  ['crm', 'Por que um CRM?'],
  ['sobre', 'O laboratório'],
  ['processo', 'Nosso processo'],
];

export function Wordmark({ to = 'inicio' }: { to?: string }) {
  const bp = useBreakpoints();
  const fs = bp.sm ? rem(1) : bp.md ? rem(1.15) : rem(1.32);
  return (
    <Anchor to={to} label="Code Labs, início" testID="wordmark" style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: bp.sm ? 4 : 10 }}>
        <Image source={require('../../assets/images/brand-mark.png')} style={{ width: 46, height: 28 }} resizeMode="stretch" accessibilityIgnoresInvertColors />
        <T style={{ color: C.paper, fontSize: fs, fontWeight: '700', letterSpacing: -0.055 * fs, ...web({ whiteSpace: 'nowrap' }) }}>
          Code <T style={{ fontWeight: '400', color: '#aeb2a6' }}>Labs</T>
        </T>
      </View>
    </Anchor>
  );
}

export function Header({ height }: { height: number }) {
  const bp = useBreakpoints();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!bp.md) setOpen(false);
  }, [bp.md]);
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const links = (mobile: boolean) =>
    LINKS.map(([id, label]) => (
      <Anchor
        key={id}
        to={id}
        onNavigate={close}
        style={[{ fontSize: rem(0.875), color: '#c1c5b8' }, mobile && { padding: 14 }]}
        hoverStyle={{ color: '#fff' }}
      >
        {label}
      </Anchor>
    ));

  return (
    <View
      role="banner"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        backgroundColor: 'rgba(16,17,16,.94)',
        borderBottomWidth: 1,
        borderBottomColor: C.line,
        ...web({ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }),
      }}
    >
      <View style={{ paddingHorizontal: gutter(bp) }}>
        <View
          style={{
            width: '100%',
            maxWidth: 1320,
            alignSelf: 'center',
            height: height - 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: bp.sm ? 12 : bp.md ? 15 : 30,
          }}
        >
          <Wordmark />
          {!bp.md && (
            <View role="navigation" aria-label="Navegação principal" style={{ flexDirection: 'row', alignItems: 'center', gap: bp.lg ? 19 : 30 }}>
              {links(false)}
            </View>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: bp.sm ? 12 : 15, marginLeft: bp.md ? 'auto' : 0 }}>
            <Button
              label="Vamos criar juntos"
              to="orcamento"
              testID="nav-cta"
              style={bp.sm ? { minHeight: 40, paddingVertical: 11, paddingHorizontal: 13 } : { minHeight: 42, paddingVertical: 12, paddingHorizontal: 19 }}
              textStyle={{ fontSize: bp.sm ? rem(0.64) : rem(0.8) }}
            />
            {bp.md && (
              <Pressable
                testID="menu-toggle"
                accessibilityLabel={open ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={open}
                onPress={() => setOpen((o) => !o)}
                style={{
                  width: bp.sm ? 36 : 44,
                  minWidth: bp.sm ? 36 : 44,
                  height: bp.sm ? 40 : 44,
                  borderWidth: 1,
                  borderColor: C.line,
                  borderRadius: 5,
                  justifyContent: 'center',
                }}
              >
                {[0, 1].map((i) => (
                  <View key={i} style={{ height: 1, width: 19, marginVertical: 5, alignSelf: 'center', backgroundColor: '#fff' }} />
                ))}
              </Pressable>
            )}
          </View>
        </View>
      </View>
      {bp.md && open && (
        <View
          role="navigation"
          testID="mobile-menu"
          style={{
            position: 'absolute',
            top: 74,
            left: 0,
            right: 0,
            backgroundColor: '#161a12',
            borderBottomWidth: 1,
            borderBottomColor: '#454d3b',
            padding: 23,
          }}
        >
          {links(true)}
        </View>
      )}
    </View>
  );
}

export function useHeaderHeight() {
  const bp = useBreakpoints();
  return bp.md ? 75 : 89;
}

export function SkipLink() {
  const { scrollTo } = useNav();
  const [focus, setFocus] = useState(false);
  if (Platform.OS !== 'web') return null;
  return (
    <Pressable
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onPress={() => scrollTo('conteudo')}
      style={{ position: 'absolute', top: focus ? 10 : -60, left: 20, zIndex: 100, backgroundColor: C.lime, padding: 12 }}
    >
      <T style={{ color: '#000', fontSize: 16 }}>Pular para o conteúdo</T>
    </Pressable>
  );
}

