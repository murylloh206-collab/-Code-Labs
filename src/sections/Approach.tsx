import React from 'react';
import { View } from 'react-native';
import { C, clamp, gutter, rem, useBreakpoints } from '../theme';
import { Section, T } from '../ui';
import { Chat, Code, Layout, Upload } from '../icons';
import { Reveal } from '../Reveal';

const STEPS = [
  {
    Icon: Chat,
    title: 'A gente escuta.',
    body: 'Conhecemos sua empresa, os desafios de hoje e o que você quer alcançar.',
    small: 'Contexto & diagnóstico',
  },
  {
    Icon: Layout,
    title: 'Dá forma à ideia.',
    body: 'Definimos escopo, experiência e proposta. Você visualiza a direção do projeto.',
    small: 'Estratégia & protótipo',
  },
  {
    Icon: Code,
    title: 'Constrói junto.',
    body: 'Desenvolvemos e validamos os fluxos, com espaço para acompanhar e alinhar.',
    small: 'Desenvolvimento & validação',
  },
  {
    Icon: Upload,
    title: 'Prepara o próximo passo.',
    body: 'Organizamos a entrega e combinamos os caminhos para manter e evoluir a solução.',
    small: 'Lançamento & evolução',
  },
];

export function Approach() {
  const bp = useBreakpoints();
  const h2Size = bp.sm ? rem(2.55) : bp.md ? rem(2.9) : clamp(rem(2.2), bp.vw(4.4), rem(4.25));
  const eyebrowSize = bp.sm ? rem(0.65) : rem(0.75);
  const smallSize = bp.sm ? rem(0.55) : rem(0.64);

  const renderStep = (s: (typeof STEPS)[number], idx: number) => (
    <Reveal key={s.title} order={idx} style={{ flex: 1 }}>
      <View style={{ borderTopWidth: 1, borderTopColor: '#4e5744', paddingTop: 20 }}>
        <View
          style={{
            width: 38,
            height: 38,
            borderWidth: 1,
            borderColor: '#566148',
            borderRadius: 19,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: bp.sm ? 20 : 27,
          }}
        >
          <s.Icon size={18} color={C.lime} />
        </View>
        <T
          role="heading"
          aria-level={3}
          style={{
            color: C.paper,
            fontSize: bp.sm ? rem(1.05) : rem(1.2),
            letterSpacing: -0.03 * rem(1.2),
            fontWeight: '500',
          }}
        >
          {s.title}
        </T>
        <T style={{ color: '#9ca58e', fontSize: rem(1), lineHeight: rem(1) * 1.65, marginTop: 11 }}>{s.body}</T>
        <T
          style={{
            color: '#6c785e',
            fontSize: smallSize,
            textTransform: 'uppercase',
            letterSpacing: 0.1 * smallSize,
            marginTop: 24,
            lineHeight: bp.sm ? smallSize * 1.7 : undefined,
          }}
        >
          {s.small}
        </T>
      </View>
    </Reveal>
  );

  return (
    <Section
      id="processo"
      style={{
        paddingTop: bp.md ? 65 : 80,
        paddingBottom: bp.md ? 65 : 100,
        borderTopWidth: 1,
        borderTopColor: C.line,
      }}
    >
      <View style={{ paddingHorizontal: gutter(bp) }}>
        <View style={{ width: '100%', maxWidth: 1320, alignSelf: 'center' }}>
          <Reveal>
            <View
              style={{
                flexDirection: bp.md ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: bp.md ? 'flex-start' : 'flex-end',
                gap: bp.md ? 0 : 60,
                marginBottom: bp.md ? 30 : 50,
              }}
            >
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <T style={{ color: C.lime, fontSize: rem(1.25), lineHeight: rem(1.25) }}>+</T>
                  <T style={{ color: C.paper, fontSize: eyebrowSize, letterSpacing: 0.13 * eyebrowSize, fontWeight: '600', textTransform: 'uppercase' }}>
                    Da conversa ao código
                  </T>
                </View>
                <T
                  role="heading"
                  aria-level={2}
                  style={{
                    color: C.paper,
                    fontSize: h2Size,
                    lineHeight: h2Size * 1.08,
                    letterSpacing: -0.055 * h2Size,
                    fontWeight: '500',
                    marginTop: 22,
                  }}
                >
                  Um processo claro.{'\n'}Um projeto com direção.
                </T>
              </View>
              <T
                style={{
                  color: C.muted,
                  fontSize: rem(1),
                  lineHeight: rem(1) * 1.65,
                  maxWidth: bp.md ? 440 : 320,
                  marginTop: bp.md ? 20 : 0,
                }}
              >
                Você entende o que está sendo construído e participa das decisões que importam.
              </T>
            </View>
          </Reveal>

          {bp.md ? (
            <View style={{ gap: bp.sm ? 30 : 35 }}>
              <View style={{ flexDirection: 'row', gap: bp.sm ? 20 : 35 }}>
                {renderStep(STEPS[0], 0)}
                {renderStep(STEPS[1], 1)}
              </View>
              <View style={{ flexDirection: 'row', gap: bp.sm ? 20 : 35 }}>
                {renderStep(STEPS[2], 2)}
                {renderStep(STEPS[3], 3)}
              </View>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', gap: 28 }}>
              {STEPS.map((s, idx) => renderStep(s, idx))}
            </View>
          )}
        </View>
      </View>
    </Section>
  );
}

