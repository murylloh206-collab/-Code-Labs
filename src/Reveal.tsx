import React, { useEffect, useRef } from 'react';
import { Animated, Easing, type StyleProp, type ViewStyle } from 'react-native';
import { NATIVE_DRIVER, useInView } from './motion';
import { useNav } from './ui';

const REVEAL_EASE = Easing.bezier(0.18, 0.72, 0.22, 1);

/**
 * Reproduz o revealSections da referência:
 * IntersectionObserver (threshold: 0.06, once), WAAPI:
 *   from { opacity: 0.3, translate: '-8px 18px' }
 *   to   { opacity: 1, translate: '0 0' }
 *   duration: 540ms, delay: order * 65ms, easing: cubic-bezier(.18,.72,.22,1)
 * Com prefers-reduced-motion: reduce, permanece imediatamente visível sem animação.
 */
export function Reveal({
  order = 0,
  style,
  children,
}: {
  order?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  const ref = useRef<any>(null);
  const { reduced } = useNav();
  const inView = useInView(ref, { threshold: 0.06, once: true });
  const prog = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  const started = useRef(false);

  useEffect(() => {
    if (reduced) {
      prog.stopAnimation();
      prog.setValue(1);
      started.current = true;
      return;
    }
    if (!inView || started.current) return;
    started.current = true;
    const anim = Animated.timing(prog, {
      toValue: 1,
      duration: 540,
      delay: order * 65,
      easing: REVEAL_EASE,
      useNativeDriver: NATIVE_DRIVER,
      isInteraction: false,
    });
    anim.start();
    return () => anim.stop();
  }, [inView, reduced, order, prog]);

  return (
    <Animated.View
      ref={ref}
      style={[
        style,
        !reduced && {
          opacity: prog.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
          transform: [
            { translateX: prog.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) },
            { translateY: prog.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

