import React, { createContext, useContext, useRef, useState } from 'react';
import { Linking, Platform, Pressable, Text, View, type GestureResponderEvent, type TextProps, type ViewStyle, type StyleProp, type TextStyle } from 'react-native';
import { C, FONT, web } from './theme';
import type { LegalTab } from './LegalConfig';

/** Texto base: Arial, como o `font-family` do :root da referência. */
export const T = React.forwardRef<any, TextProps>(function T({ style, ...rest }, ref) {
  return <Text ref={ref} {...rest} style={[{ fontFamily: FONT }, style]} />;
});

type Nav = {
  scrollTo: (id: string) => void;
  register: (id: string, y: number) => void;
  reduced: boolean;
  toast: (msg: string) => void;
  openPrivacy: (tab?: LegalTab) => void;
  openCookiePrefs: () => void;
  chooseService: (service: string) => void;
};
export const NavContext = createContext<Nav>({
  scrollTo: () => {},
  register: () => {},
  reduced: false,
  toast: () => {},
  openPrivacy: () => {},
  openCookiePrefs: () => {},
  chooseService: () => {},
});
export const useNav = () => useContext(NavContext);

/** Seção com âncora (id) registrada para a navegação interna. */
export function Section({ id, style, children }: { id: string; style?: StyleProp<ViewStyle>; children: React.ReactNode }) {
  const { register } = useNav();
  return (
    <View nativeID={id} style={style} onLayout={(e) => register(id, e.nativeEvent.layout.y)}>
      {children}
    </View>
  );
}

const transition = (reduced: boolean, props: string, ms: number) =>
  reduced ? {} : web({ transitionProperty: props, transitionDuration: `${ms}ms`, transitionTimingFunction: 'ease' });

/** Âncora interna (<a href="#id">) com rolagem suave e compensação do cabeçalho. */
export function Anchor({
  to,
  style,
  hoverStyle,
  children,
  onNavigate,
  label,
  testID,
}: {
  to: string;
  style?: StyleProp<TextStyle>;
  hoverStyle?: StyleProp<TextStyle>;
  children: React.ReactNode;
  onNavigate?: () => void;
  label?: string;
  testID?: string;
}) {
  const { scrollTo, reduced } = useNav();
  const [hover, setHover] = useState(false);
  return (
    <T
      testID={testID}
      role="link"
      accessibilityLabel={label}
      {...(Platform.OS === 'web' ? ({ href: `#${to}` } as any) : {})}
      onPress={(e: GestureResponderEvent) => {
        (e as any)?.preventDefault?.();
        onNavigate?.();
        scrollTo(to);
      }}
      {...({ onHoverIn: () => setHover(true), onHoverOut: () => setHover(false) } as any)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      style={[transition(reduced, 'color', 200), style, hover && hoverStyle]}
    >
      {children}
    </T>
  );
}

/** .button da referência (lima, secundário ou azul), com hover e foco visível. */
export function Button({
  label,
  onPress,
  variant = 'lime',
  style,
  textStyle,
  to,
  testID,
  disabled,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'lime' | 'blue';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  to?: string;
  testID?: string;
  disabled?: boolean;
}) {
  const { scrollTo, reduced } = useNav();
  const base = variant === 'blue' ? C.blue : C.lime;
  const hoverBg = variant === 'blue' ? '#1429df' : '#e2ff88';
  return (
    <Pressable
      testID={testID}
      disabled={disabled}
      role={to ? 'link' : 'button'}
      {...(Platform.OS === 'web' && to ? ({ href: `#${to}` } as any) : {})}
      onPress={(e) => {
        (e as any)?.preventDefault?.();
        if (to) scrollTo(to);
        onPress?.();
      }}
      style={(state: any) => [
        {
          minHeight: 52,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 16,
          paddingHorizontal: 25,
          borderWidth: 1,
          borderColor: 'transparent',
          borderRadius: 7,
          backgroundColor: state.hovered ? hoverBg : base,
          alignSelf: 'flex-start',
        },
        transition(reduced, 'background-color, transform', 200),
        state.hovered && variant === 'lime' ? { transform: [{ translateY: -2 }] } : null,
        state.focused ? web({ outlineWidth: 2, outlineStyle: 'solid', outlineColor: C.lime, outlineOffset: 5 }) : null,
        style,
      ]}
    >
      <T
        style={[
          { color: variant === 'blue' ? '#fff' : C.ink, fontSize: 14, fontWeight: '700', letterSpacing: -0.015 * 14 },
          textStyle,
        ]}
      >
        {label}
      </T>
    </Pressable>
  );
}

/** .text-link: sublinhado próprio (border-bottom) e cor lima no hover. */
export function TextLink({
  to,
  label,
  style,
  textStyle,
  hoverColor = C.lime,
  onPress,
  testID,
}: {
  to: string;
  label: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  hoverColor?: string;
  onPress?: () => void;
  testID?: string;
}) {
  const { scrollTo, reduced } = useNav();
  return (
    <Pressable
      testID={testID}
      role="link"
      {...(Platform.OS === 'web' ? ({ href: `#${to}` } as any) : {})}
      onPress={(e) => {
        (e as any)?.preventDefault?.();
        onPress?.();
        scrollTo(to);
      }}
      style={(s: any) => [
        { alignSelf: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#686d5f', paddingBottom: 5 },
        s.focused ? web({ outlineWidth: 2, outlineStyle: 'solid', outlineColor: C.lime, outlineOffset: 5 }) : null,
        style,
      ]}
    >
      {(s: any) => (
        <T style={[{ fontSize: 14, color: C.paper }, transition(reduced, 'color', 200), textStyle, s.hovered && { color: hoverColor }]}>
          {label}
        </T>
      )}
    </Pressable>
  );
}

export const openExternal = (url: string) => {
  if (Platform.OS === 'web') window.open(url, '_blank', 'noopener,noreferrer');
  else Linking.openURL(url);
};

export function useStableRef<T>(v: T) {
  const r = useRef(v);
  r.current = v;
  return r;
}
