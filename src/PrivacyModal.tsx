import React, { useEffect } from 'react';
import { Modal, Platform, Pressable, View } from 'react-native';
import { C, rem, web } from './theme';
import { Button, T, useNav } from './ui';

export function PrivacyModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!visible || Platform.OS !== 'web') return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <Pressable
        testID="privacy-backdrop"
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.73)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          ...web({ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }),
        }}
      >
        <Pressable
          testID="privacy-dialog"
          onPress={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 570,
            borderWidth: 1,
            borderColor: '#596448',
            borderRadius: 12,
            backgroundColor: '#1a2016',
            padding: 32,
          }}
        >
          <T role="heading" aria-level={2} style={{ color: '#eef2e7', fontSize: rem(2), letterSpacing: -0.055 * rem(2), fontWeight: '500', marginBottom: 20 }}>
            Sua privacidade.
          </T>
          <T style={{ color: '#b0bba3', fontSize: rem(0.9), lineHeight: rem(0.9) * 1.65, marginVertical: 13 }}>
            Esta é uma prévia de apresentação. O formulário monta um briefing no seu navegador; ele não envia seus dados para a Code Labs.
          </T>
          <T style={{ color: '#b0bba3', fontSize: rem(0.9), lineHeight: rem(0.9) * 1.65, marginVertical: 13 }}>
            O conteúdo digitado não é salvo entre visitas. Você pode copiar ou baixar o briefing para revisar. Não usamos ferramentas de rastreamento ou cookies de publicidade nesta versão.
          </T>
          <T style={{ color: '#b0bba3', fontSize: rem(0.9), lineHeight: rem(0.9) * 1.65, marginVertical: 13 }}>
            O canal de contato e o aviso de privacidade definitivo serão configurados antes do lançamento.
          </T>
          <Button label="Entendi" testID="privacy-close" onPress={onClose} style={{ marginTop: 20 }} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function Toast({ message }: { message: string }) {
  const { reduced } = useNav();
  const visible = Boolean(message);
  return (
    <View
      testID="toast"
      role="status"
      pointerEvents="none"
      style={{
        position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
        left: 16,
        right: 16,
        bottom: 24,
        alignItems: 'center',
        zIndex: 100,
        opacity: visible ? 1 : 0,
        transform: [{ translateY: visible ? 0 : 20 }],
        ...(!reduced ? web({ transitionProperty: 'opacity, transform', transitionDuration: '250ms' }) : {}),
      }}
    >
      <View
        style={{
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderWidth: 1,
          borderColor: '#65774c',
          borderRadius: 7,
          backgroundColor: C.lime,
          ...web({ boxShadow: '0 10px 40px #0006' }),
        }}
      >
        <T style={{ color: '#1b2810', fontSize: rem(0.8) }}>{message}</T>
      </View>
    </View>
  );
}

