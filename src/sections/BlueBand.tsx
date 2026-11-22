import React, { useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { C, clamp, rem, useBreakpoints, web } from '../theme';
import { useCanHover, useInView, useLoop } from '../motion';
import { T, useNav } from '../ui';

const ITEMS = [
  'Da presença digital à operação.',
  'Da sua ideia ao próximo nível.',
  'Tudo começa com uma conversa.',
];

export function BlueBand() {
  const bp = useBreakpoints();
  const { reduced } = useNav();
  const canHover = useCanHover();
  const ref = useRef<any>(null);
  const inView = useInView(ref);
  const [hovered, setHovered] = useState(false);
  const [seqWidth, setSeqWidth] = useState(0);

  const running = !reduced && inView && !(canHover && hovered) && seqWidth > 0;
  const clock = useLoop(36000, running);

  const fontSize = bp.md ? rem(0.9) : rem(1.1);
  const gap = clamp(24, bp.vw(3), 54);
  const padX = clamp(12, bp.vw(1.5), 27);

  const renderSeq = (key: string, measure?: boolean) => (
    <View
      key={key}
      onLayout={measure ? (e) => setSeqWidth(e.nativeEvent.layout.width) : undefined}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        minWidth: bp.width,
        gap,
        paddingHorizontal: padX,
        flexShrink: 0,
      }}
    >
      {ITEMS.map((text) => (
        <React.Fragment key={text}>
          <T
            style={{
              color: C.paper,
              fontSize,
              letterSpacing: -0.02 * fontSize,
              ...web({ whiteSpace: 'nowrap' }),
            }}
          >
            {text}
          </T>
          <T style={{ color: C.lime, fontSize: rem(1.5), fontWeight: '400', ...web({ whiteSpace: 'nowrap' }) }}>
            ✳
          </T>
        </React.Fragment>
      ))}
    </View>
  );

  const tx = clock.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -seqWidth],
  });

  return (
    <View
      ref={ref}
      testID="blue-band"
      aria-hidden={true}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={{
        backgroundColor: C.blue,
        paddingVertical: bp.md ? 20 : 25,
        overflow: 'hidden',
      }}
    >
      {reduced ? (
        <View
          testID="band-track"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: bp.md ? 25 : 40,
            minWidth: '100%',
          }}
        >
          {renderSeq('single')}
        </View>
      ) : (
        <Animated.View
          testID="band-track"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            transform: [{ translateX: seqWidth > 0 ? tx : 0 }],
            ...web({ width: 'max-content' }),
          }}
        >
          {renderSeq('a', true)}
          {renderSeq('b')}
        </Animated.View>
      )}
    </View>
  );
}
