import React, { useState } from 'react';
import { Animated, View } from 'react-native';
import { C, clamp, gutter, rem, useBreakpoints, web, type BP } from '../theme';
import { CSS_EASE, keyframes, useLoop } from '../motion';
import { Section, T, TextLink, useNav } from '../ui';
import { Bars, Bolt, Grid, Info, Mail, Monitor } from '../icons';
import { Reveal } from '../Reveal';

function Eyebrow({ label, bp, color = C.lime, textColor = C.paper }: { label: string; bp: BP; color?: string; textColor?: string }) {
  const fs = bp.sm ? rem(0.65) : rem(0.75);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <T style={{ color, fontSize: rem(1.25), lineHeight: rem(1.25), fontWeight: '400' }}>+</T>
      <T style={{ color: textColor, fontSize: fs, letterSpacing: 0.13 * fs, fontWeight: '600', textTransform: 'uppercase' }}>
        {label}
      </T>
    </View>
  );
}

function AutoConnector({ bp, reduced }: { bp: BP; reduced: boolean }) {
  const clock = useLoop(2000, !reduced);
  const tx = keyframes(clock, [[0, 0], [1, 20]], CSS_EASE);
  return (
    <View style={{ width: bp.sm ? 45 : 20, height: 1, backgroundColor: '#67734f', position: 'relative' }}>
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          top: -2,
          width: 5,
          height: 5,
          borderRadius: 3,
          backgroundColor: C.lime,
          transform: reduced ? [] : [{ translateX: tx }],
        }}
      />
    </View>
  );
}

function ServiceCard({
  bp,
  featured,
  order,
  category,
  icon,
  title,
  body,
  visual,
  linkLabel,
  linkTo,
  serviceChoice,
}: {
  bp: BP;
  featured?: boolean;
  order: number;
  category: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  visual: React.ReactNode;
  linkLabel: string;
  linkTo: string;
  serviceChoice?: string;
}) {
  const { reduced, chooseService } = useNav();
  const [hovered, setHovered] = useState(false);

  const isTabletSplit = bp.md && !bp.sm;
  const pad = bp.sm ? 26 : bp.md ? 27 : bp.lg ? 22 : 29;
  const h3Size = bp.sm ? rem(2.2) : bp.md ? rem(2) : bp.lg ? rem(1.65) : rem(2);
  const catSize = rem(0.69);

  return (
    <Reveal order={order} style={!bp.md ? { flex: featured ? 1.28 : 1 } : undefined}>
      <View
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        style={[
          {
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            minHeight: bp.sm ? 415 : bp.md ? undefined : 440,
            borderWidth: 1,
            borderColor: featured ? C.lime : hovered ? '#86916d' : C.line,
            backgroundColor: featured ? C.lime : '#181b17',
            borderRadius: 10,
            padding: pad,
            transform: hovered && !reduced ? [{ translateY: -5 }] : [],
            ...(!reduced ? web({ transitionProperty: 'border-color, transform', transitionDuration: '300ms' }) : {}),
          },
        ]}
      >
        {/* Category */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <T
            style={{
              color: featured ? '#171b10' : C.paper,
              fontSize: catSize,
              textTransform: 'uppercase',
              letterSpacing: 0.12 * catSize,
            }}
          >
            {category}
          </T>
          {icon}
        </View>

        {isTabletSplit ? (
          <View style={{ flexDirection: 'row', gap: 25, alignItems: 'center', marginTop: 0 }}>
            <View style={{ flex: 1 }}>
              <T
                role="heading"
                aria-level={3}
                style={{
                  color: featured ? '#171b10' : C.paper,
                  fontSize: h3Size,
                  lineHeight: h3Size * 1.1,
                  marginTop: 21,
                  letterSpacing: -0.05 * h3Size,
                  fontWeight: '500',
                }}
              >
                {title}
              </T>
              <T style={{ color: featured ? '#515f32' : '#a6ac9b', fontSize: rem(1), lineHeight: rem(1) * 1.6, marginTop: 15 }}>
                {body}
              </T>
            </View>
            <View style={{ flex: 1 }}>{visual}</View>
          </View>
        ) : (
          <>
            <T
              role="heading"
              aria-level={3}
              style={{
                color: featured ? '#171b10' : C.paper,
                fontSize: h3Size,
                lineHeight: h3Size * 1.1,
                marginTop: bp.sm ? 20 : 21,
                letterSpacing: -0.05 * h3Size,
                fontWeight: '500',
              }}
            >
              {title}
            </T>
            <T
              style={{
                color: featured ? '#515f32' : '#a6ac9b',
                fontSize: rem(1),
                lineHeight: rem(1) * 1.6,
                marginTop: 16,
                maxWidth: bp.sm ? '100%' : 280,
              }}
            >
              {body}
            </T>
            {visual}
          </>
        )}

        <TextLink
          to={linkTo}
          label={linkLabel}
          onPress={serviceChoice ? () => chooseService(serviceChoice) : undefined}
          hoverColor={featured ? '#263eff' : C.lime}
          style={{
            marginTop: isTabletSplit ? 0 : 'auto',
            paddingTop: bp.sm ? 20 : 22,
          }}
          textStyle={{
            fontSize: rem(0.8),
            color: featured ? '#171b10' : C.paper,
          }}
        />
      </View>
    </Reveal>
  );
}

export function Services() {
  const bp = useBreakpoints();
  const { reduced } = useNav();
  const padV = bp.md ? 70 : bp.lg ? 85 : 110;
  const h2Size = bp.sm ? rem(2.55) : bp.md ? rem(2.9) : clamp(rem(2.2), bp.vw(4.4), rem(4.25));

  return (
    <Section id="solucoes" style={{ paddingVertical: padV }}>
      <View style={{ paddingHorizontal: gutter(bp) }}>
        <View style={{ width: '100%', maxWidth: 1320, alignSelf: 'center' }}>
          <Reveal>
            <View
              style={{
                flexDirection: bp.md ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: bp.md ? 'flex-start' : 'flex-end',
                gap: bp.md ? 0 : 60,
                marginBottom: bp.md ? 30 : 45,
              }}
            >
              <View>
                <Eyebrow label="O que fazemos" bp={bp} />
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
                  Seu negócio tem um desafio.{'\n'}A gente constrói a solução.
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
                Do primeiro site ao sistema que conecta toda a operação. O projeto começa pelo que sua empresa precisa resolver.
              </T>
            </View>
          </Reveal>

          <View style={{ flexDirection: bp.md ? 'column' : 'row', gap: 16 }}>
            <ServiceCard
              bp={bp}
              featured
              order={0}
              category="Presença que gera interesse"
              icon={<Monitor size={23} color="#171b10" />}
              title={'Sites &\nexperiências digitais.'}
              body="Apresente seu valor com clareza e transforme visitas em boas conversas de negócio."
              linkLabel="Quero um site para minha empresa"
              linkTo="orcamento"
              serviceChoice="Site ou landing page"
              visual={
                <View
                  aria-hidden={true}
                  style={{
                    marginTop: 25,
                    marginBottom: -8,
                    backgroundColor: '#f7f9f0',
                    borderWidth: 1,
                    borderColor: '#161f1533',
                    borderRadius: 7,
                    height: bp.sm ? 130 : 125,
                    paddingVertical: 10,
                    paddingHorizontal: 13,
                    transform: [{ rotate: '-3deg' }],
                    ...web({ boxShadow: '10px 10px 0 #536b262b' }),
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderBottomWidth: 1,
                      borderBottomColor: '#d6dcc9',
                      paddingBottom: 6,
                    }}
                  >
                    <T style={{ color: '#20281a', fontSize: rem(0.5) }}>Sua marca</T>
                    <T style={{ color: '#20281a', fontSize: rem(0.5), marginLeft: 'auto' }}>MENU +</T>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', height: 88 }}>
                    <View style={{ flex: 1 }}>
                      <T style={{ color: '#20281a', fontSize: rem(0.9), lineHeight: rem(0.9) * 1.05, fontWeight: '700', letterSpacing: -0.06 * rem(0.9) }}>
                        Uma presença.{'\n'}Novas possibilidades.
                      </T>
                      <View style={{ backgroundColor: C.blue, width: 57, height: 13, borderRadius: 2, marginTop: 9 }} />
                    </View>
                    <View
                      style={{
                        width: 95,
                        height: 67,
                        backgroundColor: C.blue,
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 5,
                        borderBottomRightRadius: 40,
                        borderBottomLeftRadius: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <T style={{ fontSize: 53, fontWeight: '900', color: C.lime, lineHeight: 56 }}>C</T>
                    </View>
                  </View>
                </View>
              }
            />

            <ServiceCard
              bp={bp}
              order={1}
              category="Gestão com clareza"
              icon={<Grid size={23} color={C.paper} />}
              title={'CRMs &\nsistemas de gestão.'}
              body="Clientes, vendas e rotinas em um sistema que acompanha o jeito de trabalhar da sua equipe."
              linkLabel="Entender o que um CRM pode fazer"
              linkTo="crm"
              visual={
                <View
                  aria-hidden={true}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 7,
                    marginTop: bp.sm ? 24 : 30,
                    marginBottom: bp.sm ? 8 : 0,
                    height: bp.sm ? 80 : 94,
                  }}
                >
                  {[
                    { bg: '#404d30', count: 2 },
                    { bg: '#4d5c2d', count: 1 },
                    { bg: C.lime, count: 2 },
                  ].map((col, idx) => (
                    <View
                      key={idx}
                      style={{
                        height: '100%',
                        flex: 1,
                        backgroundColor: '#22271e',
                        borderWidth: 1,
                        borderColor: '#465139',
                        borderRadius: 4,
                        paddingVertical: 10,
                        paddingHorizontal: 7,
                      }}
                    >
                      <View style={{ width: '60%', height: 4, backgroundColor: '#717e5c', marginBottom: 12 }} />
                      {Array.from({ length: col.count }).map((_, j) => (
                        <View key={j} style={{ backgroundColor: col.bg, height: 18, borderRadius: 2, marginTop: 6 }} />
                      ))}
                    </View>
                  ))}
                </View>
              }
            />

            <ServiceCard
              bp={bp}
              order={2}
              category="Menos trabalho repetitivo"
              icon={<Bolt size={23} color={C.paper} />}
              title={'Automações &\nintegrações.'}
              body="Conecte ferramentas, organize fluxos e devolva tempo à equipe para cuidar do que faz a diferença."
              linkLabel="Quero simplificar minha operação"
              linkTo="orcamento"
              serviceChoice="Automação ou integração"
              visual={
                <View
                  aria-hidden={true}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: bp.sm ? 'flex-start' : 'center',
                    gap: 12,
                    height: bp.sm ? 80 : 94,
                    marginTop: bp.sm ? 24 : 30,
                    marginBottom: bp.sm ? 8 : 0,
                  }}
                >
                  <View
                    style={{
                      width: bp.sm ? 60 : 48,
                      height: bp.sm ? 55 : 48,
                      borderWidth: 1,
                      borderColor: '#64734d',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                    }}
                  >
                    <Mail size={22} color={C.paper} />
                  </View>
                  <AutoConnector bp={bp} reduced={reduced} />
                  <View
                    style={{
                      width: bp.sm ? 60 : 48,
                      height: bp.sm ? 55 : 48,
                      borderWidth: 1,
                      borderColor: '#5f71ff',
                      backgroundColor: C.blue,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                    }}
                  >
                    <T style={{ color: C.paper, fontSize: 16 }}>{'<C>'}</T>
                  </View>
                  <AutoConnector bp={bp} reduced={reduced} />
                  <View
                    style={{
                      width: bp.sm ? 60 : 48,
                      height: bp.sm ? 55 : 48,
                      borderWidth: 1,
                      borderColor: '#64734d',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                    }}
                  >
                    <Bars size={22} color={C.paper} />
                  </View>
                </View>
              }
            />
          </View>

          <View
            style={{
              marginTop: 22,
              flexDirection: 'row',
              gap: 10,
              justifyContent: bp.sm ? 'flex-start' : 'center',
              alignItems: 'center',
            }}
          >
            <Info size={16} color="#8b9380" />
            <T
              style={{
                color: '#8b9380',
                fontSize: bp.sm ? rem(0.64) : rem(0.75),
                lineHeight: (bp.sm ? rem(0.64) : rem(0.75)) * 1.7,
                flexShrink: 1,
              }}
            >
              Cada solução é desenhada conforme o escopo. Você não precisa chegar com todas as respostas.
            </T>
          </View>
        </View>
      </View>
    </Section>
  );
}

