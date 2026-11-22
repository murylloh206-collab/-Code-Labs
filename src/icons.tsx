import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

type P = { size?: number; color?: string; width?: number; stroke?: number };

const S = ({ size = 24, color = 'currentColor', stroke = 1.3, children }: P & { children: React.ReactNode }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke}>
    {children}
  </Svg>
);

export const Globe = (p: P) => (
  <S {...p} stroke={1.5}>
    <Circle cx="12" cy="12" r="9" />
    <Ellipse cx="12" cy="12" rx="4" ry="9" />
    <Path d="M3 12h18" />
  </S>
);
export const Monitor = (p: P) => (
  <S {...p}>
    <Rect x="3" y="4" width="18" height="14" rx="2" />
    <Path d="M3 8h18M9 21h6M12 18v3" />
  </S>
);
export const Grid = (p: P) => (
  <S {...p}>
    <Rect x="3" y="3" width="7" height="7" rx="1" />
    <Rect x="14" y="3" width="7" height="7" rx="1" />
    <Rect x="3" y="14" width="7" height="7" rx="1" />
    <Rect x="14" y="14" width="7" height="7" rx="1" />
  </S>
);
export const Bolt = (p: P) => (
  <S {...p}>
    <Path d="m13 2-8 12h6l-1 8 9-13h-7z" />
  </S>
);
export const Mail = (p: P) => (
  <S {...p} stroke={1.4}>
    <Rect x="4" y="5" width="16" height="14" rx="2" />
    <Path d="m4 7 8 6 8-6" />
  </S>
);
export const Bars = (p: P) => (
  <S {...p} stroke={1.4}>
    <Path d="M5 20V10M12 20V4M19 20V7" />
  </S>
);
export const Info = (p: P) => (
  <S {...p} stroke={1.5}>
    <Circle cx="12" cy="12" r="9" />
    <Path d="M12 10v7m0-10v1" />
  </S>
);
export const Chat = (p: P) => (
  <S {...p}>
    <Path d="M20 11a8 8 0 0 1-8 8H5l-3 3V11a9 9 0 0 1 18 0Z" />
    <Path d="M7 10h8M7 14h5" />
  </S>
);
export const Layout = (p: P) => (
  <S {...p}>
    <Path d="M4 4h16v16H4zM4 10h16M10 10v10" />
  </S>
);
export const Code = (p: P) => (
  <S {...p}>
    <Path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18" />
  </S>
);
export const Upload = (p: P) => (
  <S {...p}>
    <Path d="M12 3v13m-5-8 5-5 5 5M4 15v6h16v-6" />
  </S>
);
export const Site = (p: P) => (
  <S {...p}>
    <Rect x="3" y="4" width="18" height="15" rx="2" />
    <Path d="M3 9h18M8 6.5h.1M11 6.5h.1" />
  </S>
);
export const Help = (p: P) => (
  <S {...p}>
    <Circle cx="12" cy="12" r="9" />
    <Path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3v1" />
  </S>
);

