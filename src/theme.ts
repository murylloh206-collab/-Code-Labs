import { Platform, useWindowDimensions } from 'react-native';

export const C = {
  ink: '#101110',
  panel: '#191b19',
  line: '#30332e',
  paper: '#f2f3ee',
  muted: '#a3a79c',
  blue: '#2038ff',
  lime: '#d5ff51',
};

export const FONT = 'Arial, Helvetica, sans-serif';
export const MONO = 'Consolas, monospace';
export const REM = 16;
export const rem = (n: number) => n * REM;

/** Estilos que só existem no navegador (CSS), ignorados no nativo. */
export const web = (s: Record<string, unknown>): any => (Platform.OS === 'web' ? s : {});

/** Mesmos pontos de quebra do HTML de referência (max-width inclusivo). */
export function useBreakpoints() {
  const { width, height } = useWindowDimensions();
  return {
    width,
    height,
    xl: width >= 1600,
    lg: width <= 1100,
    md: width <= 800,
    sm: width <= 480,
    vw: (n: number) => (width * n) / 100,
  };
}
export type BP = ReturnType<typeof useBreakpoints>;

export const clamp = (min: number, v: number, max: number) => Math.min(max, Math.max(min, v));

/** Espaço horizontal do .container: min(1320px, 100% - 112px) / 64px / 40px. */
export function gutter(bp: BP) {
  return bp.md ? 20 : bp.lg ? 32 : 56;
}

