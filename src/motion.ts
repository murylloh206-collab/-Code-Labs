import { useEffect, useRef, useState, type RefObject } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform } from 'react-native';

export const NATIVE_DRIVER = Platform.OS !== 'web';

/** Curvas CSS usadas na referência. */
export const CSS_EASE = Easing.bezier(0.25, 0.1, 0.25, 1);
export const CSS_EASE_IN_OUT = Easing.bezier(0.42, 0, 0.58, 1);
export const LINEAR = (t: number) => t;

const webMedia = (q: string) =>
  Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(q)
    : null;

/** prefers-reduced-motion (web) / "Reduzir movimento" do sistema (nativo), reagindo a mudanças. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => webMedia('(prefers-reduced-motion: reduce)')?.matches ?? false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => alive && setReduced(v));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => setReduced(v));
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);
  return reduced;
}

/** (hover: hover) — só dispositivos com mouse pausam a faixa ao passar o cursor. */
export function useCanHover() {
  const [can, setCan] = useState(() => webMedia('(hover: hover)')?.matches ?? false);
  useEffect(() => {
    const m = webMedia('(hover: hover)');
    if (!m) return;
    const on = () => setCan(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return can;
}

/**
 * Visibilidade na tela (IntersectionObserver no navegador). No nativo assume visível.
 * once=true desliga o observador após a primeira entrada, como na referência.
 */
export function useInView(ref: RefObject<any>, { threshold = 0, once = false } = {}) {
  const [inView, setInView] = useState(Platform.OS !== 'web');
  useEffect(() => {
    const el = ref.current as Element | null;
    if (Platform.OS !== 'web' || !el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (once) {
            if (e.isIntersecting) {
              setInView(true);
              io.disconnect();
            }
          } else setInView(e.isIntersecting);
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, once]);
  return inView;
}

/**
 * Relógio de um loop infinito (0 → 1), equivalente a `animation: X <dur> infinite`.
 * Pausar preserva a fase (animation-play-state: paused). A limpeza do efeito para a
 * animação, então montar/desmontar ou navegar não duplica temporizadores.
 */
export function useLoop(duration: number, running: boolean) {
  const value = useRef(new Animated.Value(0)).current;
  const phase = useRef(0);
  useEffect(() => {
    if (!running) return;
    let cancelled = false;
    let anim: Animated.CompositeAnimation | null = null;
    const run = (from: number) => {
      value.setValue(from);
      anim = Animated.timing(value, {
        toValue: 1,
        duration: Math.max(1, duration * (1 - from)),
        easing: LINEAR,
        useNativeDriver: NATIVE_DRIVER,
        isInteraction: false,
      });
      anim.start(({ finished }) => {
        if (finished && !cancelled) run(0);
      });
    };
    run(phase.current >= 1 ? 0 : phase.current);
    return () => {
      cancelled = true;
      anim?.stop();
      value.stopAnimation((v) => {
        phase.current = v;
      });
    };
  }, [running, duration, value]);
  return value;
}

type Frame = [number, number];

/** Valor de keyframes CSS no instante t∈[0,1] com a curva aplicada a cada intervalo. */
function sample(frames: Frame[], ease: (t: number) => number, t: number) {
  if (t <= frames[0][0]) return frames[0][1];
  for (let i = 1; i < frames.length; i++) {
    const [t1, v1] = frames[i];
    const [t0, v0] = frames[i - 1];
    if (t <= t1) {
      const local = t1 === t0 ? 1 : (t - t0) / (t1 - t0);
      return v0 + (v1 - v0) * ease(local);
    }
  }
  return frames[frames.length - 1][1];
}

/**
 * Interpolação que reproduz @keyframes. `offset` é a fração do ciclo já percorrida
 * no início (equivale a animation-delay negativo).
 */
export function keyframes(
  progress: Animated.Value,
  frames: Frame[],
  ease: (t: number) => number = LINEAR,
  offset = 0,
  steps = 72,
) {
  const inputs = new Set<number>();
  for (let i = 0; i <= steps; i++) inputs.add(i / steps);
  for (const [t] of frames) inputs.add(((t - offset) % 1 + 1) % 1);
  const wrap = offset > 0 ? 1 - offset : null;
  const list = [...inputs].sort((a, b) => a - b);
  const inputRange: number[] = [];
  const outputRange: number[] = [];
  for (const p of list) {
    if (wrap !== null && Math.abs(p - wrap) < 1e-9) {
      inputRange.push(p - 1e-6);
      outputRange.push(sample(frames, ease, 1));
      inputRange.push(p);
      outputRange.push(sample(frames, ease, 0));
      continue;
    }
    const shifted = (p + offset) % 1 || (p === 1 ? (offset ? offset : 1) : 0);
    inputRange.push(p);
    outputRange.push(sample(frames, ease, p === 1 && !offset ? 1 : shifted));
  }
  return progress.interpolate({ inputRange, outputRange });
}

