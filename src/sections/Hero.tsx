import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, View } from 'react-native';
import { C, FONT, MONO, clamp, gutter, rem, useBreakpoints, web, type BP } from '../theme';
import { CSS_EASE, CSS_EASE_IN_OUT, LINEAR, NATIVE_DRIVER, keyframes, useInView, useLoop } from '../motion';
import { Anchor, Button, Section, T, TextLink, useNav } from '../ui';
import { Globe } from '../icons';

const deg = (v: Animated.AnimatedInterpolation<number>) =>
  v.interpolate({ inputRange: [-360, 360], outputRange: ['-360deg', '360deg'] });

/** Animação de entrada do .reveal (opacity 0→1, translateY 18px→0, .8s ease, fill both). */
function useEntrance(delay: number, reduced: boolean) {
  const p = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  const done = useRef(false);
  useEffect(() => {
    if (reduced) {
      p.stopAnimation();
      p.setValue(1);
      return;
    }
    if (done.current) return;
    const a = Animated.timing(p, { toValue: 1, duration: 800, delay, easing: CSS_EASE, useNativeDriver: NATIVE_DRIVER });
    a.start(({ finished }) => {
      if (finished) done.current = true;
    });
    return () => a.stop();
  }, [reduced, delay, p]);
  return p;
}

/** Comprimento de arco da elipse para reproduzir offset-distance (velocidade constante). */
function ellipsePath(w: number, h: number, n = 120) {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2; // começa à direita e segue no sentido horário (como o offset-path medido)
    pts.push([w / 2 + (w / 2) * Math.cos(a), h / 2 + (h / 2) * Math.sin(a)]);
  }
  const len = [0];
  for (let i = 1; i <= n; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = len[n];
  return { input: len.map((l) => l / total), xs: pts.map((p) => p[0]), ys: pts.map((p) => p[1]) };
}

function Orbital({ back, bp, running, reduced }: { back?: boolean; bp: BP; running: boolean; reduced: boolean }) {
  const w = back ? (bp.sm ? 275 : 340) : bp.sm ? 330 : 410;
  const h = back ? (bp.sm ? 290 : 365) : bp.sm ? 230 : 290;
  const left = back ? (bp.sm ? 55 : 85) : bp.sm ? 16 : 40;
  const top = back ? (bp.sm ? 23 : bp.md ? 0 : 52) : bp.sm ? 46 : bp.md ? 40 : 89;
  const animated = !back && !reduced;
  const clock = useLoop(16000, animated && running);
  const path = useMemo(() => ellipsePath(w, h), [w, h]);
  const dot = { position: 'absolute' as const, width: 8, height: 8, borderRadius: 4, backgroundColor: C.lime, ...web({ boxShadow: '0 0 20px #d5ff5166' }) };
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left,
        top,
        width: w,
        height: h,
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: back ? '#53604a55' : '#65735466',
        transform: [{ rotate: back ? '37deg' : '-30deg' }],
        ...web({ borderRadius: '50%' }),
      }}
    >
      {animated ? (
        <Animated.View
          style={[
            dot,
            {
              left: -5,
              top: -5,
              transform: [
                { translateX: clock.interpolate({ inputRange: path.input, outputRange: path.xs }) },
                { translateY: clock.interpolate({ inputRange: path.input, outputRange: path.ys }) },
              ],
            },
          ]}
        />
      ) : (
        <View style={[dot, { left: 15, top: 70 }]} />
      )}
    </View>
  );
}

function Trail({ start, offset, wide, running }: { start: string; offset: number; wide?: boolean; running: boolean }) {
  const clock = useLoop(7000, running);
  const x = keyframes(clock, [[0, -55], [0.85, 210], [1, 210]], LINEAR, offset);
  const y = keyframes(clock, [[0, 25], [0.85, -182], [1, -182]], LINEAR, offset);
  const o = keyframes(clock, [[0, 0], [0.15, 0.55], [0.68, 0.35], [0.85, 0], [1, 0]], LINEAR, offset);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: start as any,
        bottom: '13%',
        width: wide ? 110 : 76,
        height: 1,
        opacity: o,
        transform: [{ translateX: x }, { translateY: y }, { rotate: '-38deg' }],
        ...web({ backgroundImage: `linear-gradient(90deg, transparent, ${wide ? '#8290ff' : C.lime})` }),
      }}
    />
  );
}

function HeroArt({ bp, reduced, entrance }: { bp: BP; reduced: boolean; entrance: Animated.Value }) {
  const ref = useRef<View>(null);
  const inView = useInView(ref);
  const running = inView && !reduced;
  const clock = useLoop(7000, running);
  const labelClock = useLoop(7000, running);

  const sTx = keyframes(clock, [[0, 0], [0.5, 10], [1, 0]], CSS_EASE_IN_OUT);
  const sTy = keyframes(clock, [[0, 0], [0.5, -14], [1, 0]], CSS_EASE_IN_OUT);
  const sRy = deg(keyframes(clock, [[0, -16], [0.5, -10], [1, -16]], CSS_EASE_IN_OUT));
  const sRz = deg(keyframes(clock, [[0, -9], [0.5, -6], [1, -9]], CSS_EASE_IN_OUT));
  const lTx = keyframes(labelClock, [[0, 0], [0.5, -4], [1, 0]], CSS_EASE_IN_OUT);
  const lTy = keyframes(labelClock, [[0, 0], [0.5, 5], [1, 0]], CSS_EASE_IN_OUT);
  const lR = deg(keyframes(labelClock, [[0, 7], [0.5, 6], [1, 7]], CSS_EASE_IN_OUT));

  const height = bp.sm ? 340 : bp.md ? 390 : 490;
  const chromeSize = bp.sm ? 250 : bp.lg ? 300 : 335;
  const angleSize = bp.sm ? 135 : bp.lg ? 155 : 170;

  // Na referência, a animação .reveal (fill: both) substitui o `transform: scale(...)` da arte.
  // Com movimento normal a escala some; com movimento reduzido ela vale. Reproduzimos as duas situações.
  const scale = bp.xl ? 1.08 : bp.sm ? 0.85 : bp.md ? 0.9 : bp.lg ? 0.85 : 1;
  const transform: any[] = reduced
    ? scale !== 1
      ? [{ scale }]
      : []
    : [{ translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }];

  const sizeStyle = bp.sm
    ? { marginTop: 5, marginHorizontal: -23, width: bp.width - 40 + 46, alignSelf: 'center' as const }
    : bp.md
      ? { width: 500, maxWidth: '100%' as const, alignSelf: 'center' as const }
      : bp.lg
        ? { marginLeft: -60, ...web({ transformOrigin: 'center right' }) }
        : {};

  const angle = {
    fontFamily: FONT,
    fontSize: angleSize,
    lineHeight: angleSize,
    fontWeight: '800' as const,
    color: C.lime,
    ...web({ filter: 'drop-shadow(3px 5px 0 #8eae30) drop-shadow(8px 11px 0 #46591a)' }),
  };

  return (
    <Animated.View
      ref={ref as any}
      testID="hero-art"
      role="img"
      aria-label="Escultura da identidade Code Labs com C metálico e sinais de código em verde lima"
      style={[
        {
          height,
          position: 'relative',
          opacity: reduced ? 1 : entrance,
          transform,
          ...web({ isolation: 'isolate', backgroundImage: 'radial-gradient(ellipse at 55% 55%, #242f6b44, transparent 67%)' }),
        },
        sizeStyle,
        !bp.md && { flex: 1 },
      ]}
    >
      {!reduced && (
        <View pointerEvents="none" style={{ position: 'absolute', top: '10%', bottom: '10%', left: '1%', right: '1%', overflow: 'hidden' }}>
          <Trail start="2%" offset={1 / 7} running={running} />
          <Trail start="28%" offset={5 / 7} wide running={running} />
          <Trail start="53%" offset={3 / 7} running={running} />
        </View>
      )}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 45,
          right: -50,
          bottom: -10,
          left: -5,
          ...web({
            backgroundImage: 'linear-gradient(#47504324 1px,transparent 1px),linear-gradient(90deg,#47504324 1px,transparent 1px)',
            backgroundSize: '45px 45px',
            transform: 'perspective(650px) rotateX(45deg) rotateZ(-18deg)',
            maskImage: 'radial-gradient(ellipse,black,transparent 69%)',
            WebkitMaskImage: 'radial-gradient(ellipse,black,transparent 69%)',
          }),
        }}
      />
      <View style={{ position: 'absolute', top: bp.md ? 12 : 27, left: 35, right: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
        {['CODE LABS / DIGITAL CRAFT', 'FEITO PARA EVOLUIR'].map((t, i) => (
          <T key={t} style={{ fontFamily: MONO, fontSize: bp.sm ? rem(0.58) : rem(0.65), color: i ? C.lime : '#828b78', letterSpacing: 0.09 * (bp.sm ? rem(0.58) : rem(0.65)) }}>
            {t}
          </T>
        ))}
      </View>
      <Orbital back bp={bp} running={running} reduced={reduced} />
      <Orbital bp={bp} running={running} reduced={reduced} />
      <Animated.View
        testID="floating-label"
        style={{
          position: 'absolute',
          top: bp.sm ? 32 : bp.md ? 35 : 90,
          right: bp.sm ? 3 : bp.lg ? 0 : -6,
          zIndex: 2,
          backgroundColor: C.blue,
          borderWidth: 1,
          borderColor: '#6575ff',
          paddingVertical: bp.sm ? 10 : 12,
          paddingHorizontal: bp.sm ? 12 : 17,
          transform: reduced ? [{ rotate: '7deg' }] : [{ translateX: lTx }, { translateY: lTy }, { rotate: lR }],
          ...web({ boxShadow: '0 7px 0 #0b154d' }),
        }}
      >
        <T style={{ color: C.paper, fontSize: bp.sm ? rem(0.55) : rem(0.67), letterSpacing: 0.1 * (bp.sm ? rem(0.55) : rem(0.67)) }}>
          SUA IDEIA. NOSSO PRÓXIMO PROJETO.
        </T>
      </Animated.View>
      <Animated.View
        testID="sculpture"
        style={{
          position: 'absolute',
          top: bp.md ? 48 : 85,
          bottom: bp.md ? 48 : 85,
          left: bp.lg ? 0 : 15,
          right: bp.lg ? 0 : 5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          transform: reduced
            ? [{ perspective: 900 }, { rotateY: '-16deg' }, { rotateZ: '-9deg' }]
            : [{ perspective: 900 }, { translateX: sTx }, { translateY: sTy }, { rotateY: sRy }, { rotateZ: sRz }],
        }}
      >
        <T style={angle}>{'<'}</T>
        <T
          style={{
            fontFamily: FONT,
            fontSize: chromeSize,
            lineHeight: chromeSize,
            fontWeight: '900',
            letterSpacing: -0.15 * chromeSize,
            paddingRight: 0.09 * chromeSize,
            color: 'transparent',
            ...web({
              backgroundImage: 'linear-gradient(125deg,#f9fff8 8%,#d4dccb 28%,#727e70 40%,#ffffff 50%,#eef1e6 58%,#5b6954 79%,#ced7c4 91%)',
              backgroundClip: 'text',
              filter: 'drop-shadow(1px 2px 0 #919c84) drop-shadow(4px 6px 0 #5c6651) drop-shadow(9px 12px 0 #303b2a) drop-shadow(0 35px 20px #0008)',
            }),
          }}
        >
          C
        </T>
        <T style={[angle, { marginLeft: 16 }]}>{'>'}</T>
      </Animated.View>
      <View
        style={{
          position: 'absolute',
          bottom: bp.sm ? 2 : bp.md ? 14 : 35,
          left: bp.sm ? 15 : bp.md ? 20 : 40,
          right: bp.sm ? 5 : bp.md ? 10 : 0,
          borderWidth: 1,
          borderColor: '#535a4655',
          backgroundColor: '#1b2119db',
          paddingVertical: bp.sm ? 13 : 17,
          paddingHorizontal: bp.sm ? 15 : 21,
          borderRadius: 8,
          transform: [{ rotate: '-4deg' }],
          flexDirection: 'row',
          alignItems: 'center',
          gap: bp.sm ? 12 : 22,
          ...web({ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: '0 12px 45px #0005' }),
        }}
      >
        <T style={{ fontFamily: MONO, color: C.lime, fontSize: rem(1.5) }}>+</T>
        <T style={{ fontFamily: MONO, color: '#949c8b', fontSize: bp.sm ? rem(0.62) : rem(0.74), lineHeight: 1.6 * (bp.sm ? rem(0.62) : rem(0.74)), flexShrink: 1 }}>
          const próximoPasso = <T style={{ fontFamily: MONO, color: '#d5e5c1' }}>'ir além';</T>
          {'\n'}feitoCom(estratégia, design, código);
        </T>
        <T style={{ fontFamily: MONO, color: C.lime, marginLeft: 'auto', fontSize: bp.sm ? rem(0.53) : rem(0.62), alignSelf: 'flex-start', ...web({ whiteSpace: 'nowrap' }) }}>
          {'<Code> Labs'}
        </T>
      </View>
    </Animated.View>
  );
}

function ScrollHint({ bp, reduced }: { bp: BP; reduced: boolean }) {
  const clock = useLoop(2000, !reduced);
  const ty = keyframes(clock, [[0, 0], [0.5, 9], [1, 0]], CSS_EASE);
  const op = keyframes(clock, [[0, 0.4], [0.5, 1], [1, 0.4]], CSS_EASE);
  return (
    <Anchor to="solucoes" label="Conheça nossas soluções" testID="scroll-hint">
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: bp.sm ? 7 : 12 }}>
        <View style={{ width: 23, height: 30, borderWidth: 1, borderColor: '#4e5648', borderRadius: 13 }}>
          <Animated.View
            style={{ position: 'absolute', left: 9, top: 5, width: 2, height: 6, backgroundColor: C.lime, opacity: reduced ? 1 : op, transform: reduced ? [] : [{ translateY: ty }] }}
          />
        </View>
        {!bp.sm && <T style={{ color: '#a1a695', fontSize: bp.md ? rem(0.6) : rem(0.72) }}>CONHEÇA O LAB</T>}
      </View>
    </Anchor>
  );
}

export function Hero() {
  const bp = useBreakpoints();
  const { reduced } = useNav();
  const copyIn = useEntrance(0, reduced);
  const artIn = useEntrance(120, reduced);

  const h1 = bp.sm ? rem(3.45) : bp.md ? clamp(rem(3.4), bp.vw(9.7), rem(5.8)) : bp.lg ? bp.vw(5.8) : clamp(rem(3.5), bp.vw(6.1), rem(5.8));
  const top = bp.md ? rem(0.58) : rem(0.69);
  const desc = bp.sm ? rem(0.9) : bp.md ? rem(0.96) : rem(1);
  const disc = bp.sm ? rem(0.57) : bp.md ? rem(0.64) : rem(0.72);

  return (
    <Section id="inicio" style={{ overflow: 'hidden' }}>
      <View nativeID="conteudo" style={{ paddingHorizontal: gutter(bp) }}>
        <View style={{ width: '100%', maxWidth: 1320, alignSelf: 'center' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: bp.md ? 25 : 34 }}>
            <T style={{ color: '#959b8c', fontSize: top, letterSpacing: (bp.md ? 0.08 : 0.1) * top }}>ESTÚDIO INDEPENDENTE DE TECNOLOGIA</T>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Globe size={14} color="#959b8c" />
              {!bp.sm && <T style={{ color: '#959b8c', fontSize: top, letterSpacing: (bp.md ? 0.08 : 0.1) * top }}>BRASIL · IDEIAS SEM FRONTEIRAS</T>}
            </View>
          </View>

          <View
            style={{
              flexDirection: bp.md ? 'column' : 'row',
              alignItems: bp.md ? 'stretch' : 'center',
              gap: bp.md ? 0 : 18,
              minHeight: bp.md ? undefined : bp.xl ? 720 : bp.lg ? 580 : 654,
              paddingTop: bp.sm ? 36 : bp.md ? 42 : 60,
              paddingBottom: bp.md ? 20 : 64,
            }}
          >
            <Animated.View
              testID="hero-copy"
              style={[
                { zIndex: 2, opacity: copyIn, transform: [{ translateY: copyIn.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }] },
                !bp.md && { flex: 1.08 },
              ]}
            >
              <T
                role="heading"
                aria-level={1}
                testID="hero-h1"
                style={{
                  color: C.paper,
                  fontSize: h1,
                  lineHeight: h1 * (bp.sm ? 1.025 : 1.03),
                  letterSpacing: -0.065 * h1,
                  fontWeight: '500',
                  maxWidth: bp.md ? 690 : 760,
                }}
              >
                Código que{'\n'}coloca seu{'\n'}negócio <T style={{ color: C.lime }}>à frente.</T>
              </T>
              <T style={{ color: '#aaafa2', fontSize: desc, lineHeight: desc * 1.65, maxWidth: bp.md ? 480 : 450, marginTop: bp.md ? 24 : 29 }}>
                Sites que posicionam. Sistemas que simplificam.{'\n'}Tecnologia sob medida para a próxima fase{'\n'}da sua empresa.
              </T>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: bp.sm ? 20 : 28, marginTop: bp.sm ? 26 : 30 }}>
                <Button
                  label="Tirar minha ideia do papel"
                  to="orcamento"
                  testID="hero-cta"
                  style={bp.sm ? { paddingHorizontal: 19 } : undefined}
                  textStyle={bp.sm ? { fontSize: rem(0.78) } : undefined}
                />
                <TextLink to="solucoes" label="Explorar soluções" textStyle={{ fontSize: bp.sm ? rem(0.74) : rem(0.875) }} />
              </View>
              <T
                style={{
                  color: '#858c7b',
                  fontSize: bp.sm ? rem(0.61) : rem(0.69),
                  lineHeight: (bp.sm ? rem(0.61) : rem(0.69)) * 1.65,
                  marginTop: 18,
                  letterSpacing: 0.02 * (bp.sm ? rem(0.61) : rem(0.69)),
                }}
              >
                Da primeira conversa ao seu projeto no ar.
              </T>
            </Animated.View>
            <HeroArt bp={bp} reduced={reduced} entrance={artIn} />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 24,
              paddingBottom: bp.md ? 20 : 29,
              borderTopWidth: 1,
              borderTopColor: C.line,
              gap: bp.md ? 20 : 0,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                flexWrap: bp.md ? 'wrap' : 'nowrap',
                columnGap: bp.sm ? 9 : bp.md ? 12 : bp.lg ? 15 : 25,
                rowGap: bp.sm ? 9 : bp.md ? 12 : 0,
                maxWidth: bp.sm ? '75%' : bp.md ? '70%' : undefined,
              }}
            >
              {['Estratégia digital', 'Design de experiência', 'Desenvolvimento sob medida'].map((t) => (
                <T key={t} style={{ color: '#a1a695', fontSize: disc }}>
                  <T style={{ color: '#788369' }}>+</T>
                  <T>{bp.sm ? ' ' : '  '}</T>
                  {t}
                </T>
              ))}
            </View>
            <ScrollHint bp={bp} reduced={reduced} />
          </View>
        </View>
      </View>
    </Section>
  );
}
