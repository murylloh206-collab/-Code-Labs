import React from 'react';
import { Image, View } from 'react-native';
import { C, clamp, gutter, rem, useBreakpoints } from '../theme';
import { Section, T, TextLink } from '../ui';
import { Reveal } from '../Reveal';

const PRINCIPLES = [
  'Seu contexto orienta cada decisão.',
  'Design e desenvolvimento pensados juntos.',
  'Clareza para construir uma parceria de verdade.',
];

export function About() {
  const bp = useBreakpoints();
  const padV = bp.md ? 70 : bp.lg ? 85 : 110;
  const h2Size = bp.sm ? rem(2.7) : bp.md ? rem(3.2) : bp.lg ? rem(3.2) : clamp(rem(2.5), bp.vw(4), rem(3.9));
  const eyebrowSize = bp.sm ? rem(0.65) : rem(0.75);
  const topSize = bp.sm ? rem(0.5) : rem(0.64);

  return (
    <Section id="sobre" style={{ paddingVertical: padV }}>
      <View style={{ paddingHorizontal: gutter(bp) }}>
        <View
          style={{
            width: '100%',
            maxWidth: 1320,
            alignSelf: 'center',
            flexDirection: bp.md ? 'column' : 'row',
            gap: bp.md ? 40 : bp.lg ? 50 : 100,
            alignItems: 'center',
          }}
        >
          <Reveal style={!bp.md ? { flex: 1 } : { width: '100%', maxWidth: 550 }}>
            <View
              style={{
                backgroundColor: C.blue,
                aspectRatio: 1,
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                source={require('../../assets/images/about-logo.png')}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
                accessibilityLabel="Logotipo original Code Labs em branco e lima sobre azul elétrico"
              />
              <View
                style={{
                  position: 'absolute',
                  top: bp.sm ? 20 : 25,
                  left: bp.sm ? 22 : 27,
                  right: bp.sm ? 22 : 27,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <T style={{ color: C.paper, fontSize: topSize, letterSpacing: 0.1 * topSize }}>INDEPENDENTES POR NATUREZA.</T>
                <T style={{ color: C.paper, fontSize: topSize, letterSpacing: 0.1 * topSize }}>CODE / CREATE / EVOLVE</T>
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: bp.sm ? 20 : 25,
                  left: bp.sm ? 22 : 27,
                  right: bp.sm ? 22 : 27,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}
              >
                <T
                  style={{
                    color: C.paper,
                    fontSize: bp.sm ? rem(1.2) : rem(1.45),
                    letterSpacing: -0.04 * (bp.sm ? rem(1.2) : rem(1.45)),
                    lineHeight: (bp.sm ? rem(1.2) : rem(1.45)) * 1.1,
                    fontWeight: '500',
                    maxWidth: bp.sm ? 150 : 180,
                  }}
                >
                  Um laboratório.{'\n'}Muitas possibilidades.
                </T>
                <T style={{ color: C.lime, fontSize: rem(1.4) }}>✳</T>
              </View>
            </View>
          </Reveal>

          <Reveal style={!bp.md ? { flex: 1 } : { width: '100%' }}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <T style={{ color: C.lime, fontSize: rem(1.25), lineHeight: rem(1.25) }}>+</T>
                <T style={{ color: C.paper, fontSize: eyebrowSize, letterSpacing: 0.13 * eyebrowSize, fontWeight: '600', textTransform: 'uppercase' }}>
                  Muito prazer, Code Labs.
                </T>
              </View>
              <T
                role="heading"
                aria-level={2}
                style={{
                  color: C.paper,
                  fontSize: h2Size,
                  lineHeight: h2Size * 1.06,
                  letterSpacing: -0.055 * h2Size,
                  fontWeight: '500',
                  marginTop: 23,
                  marginBottom: 26,
                  maxWidth: bp.md ? 600 : undefined,
                }}
              >
                A gente gosta de código.{'\n'}Mas começa{'\n'}escutando você.
              </T>
              <T style={{ color: C.muted, fontSize: rem(1), lineHeight: rem(1) * 1.65, maxWidth: bp.md ? 620 : undefined }}>
                A Code Labs é um estúdio de desenvolvimento que une estratégia, design e tecnologia para transformar necessidades de negócio em experiências digitais.
              </T>
              <T style={{ color: C.muted, fontSize: rem(1), lineHeight: rem(1) * 1.65, marginTop: 16, maxWidth: bp.md ? 620 : undefined }}>
                Nosso intuito é simples: aproximar empresas de uma tecnologia que faça sentido no dia a dia. Para apresentar melhor uma marca, organizar a gestão ou tirar uma ideia do papel.
              </T>

              <View style={{ borderTopWidth: 1, borderTopColor: C.line, marginTop: 30 }}>
                {PRINCIPLES.map((text) => (
                  <View
                    key={text}
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      paddingVertical: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: C.line,
                      alignItems: 'center',
                    }}
                  >
                    <T style={{ color: C.lime, width: 22, fontSize: rem(0.86) }}>+</T>
                    <T style={{ color: '#c8cfbd', fontSize: rem(0.86), flex: 1 }}>{text}</T>
                  </View>
                ))}
              </View>

              <TextLink to="orcamento" label="Vamos conhecer o seu desafio" style={{ marginTop: 28 }} />
            </View>
          </Reveal>
        </View>
      </View>
    </Section>
  );
}

