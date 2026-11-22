import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { C, gutter, rem, useBreakpoints } from '../theme';
import { Anchor, T, useNav } from '../ui';

export function Footer() {
  const bp = useBreakpoints();
  const { openPrivacy } = useNav();
  const year = new Date().getFullYear();

  const taglineSize = bp.sm ? rem(1.8) : bp.md ? rem(1.4) : rem(2.2);
  const bottomSize = bp.sm ? rem(0.56) : rem(0.65);

  return (
    <View
      role="contentinfo"
      style={{
        backgroundColor: '#fff',
        paddingTop: 55,
        paddingBottom: 22,
        borderTopWidth: 1,
        borderTopColor: '#dce1d4',
      }}
    >
      <View style={{ paddingHorizontal: gutter(bp) }}>
        <View style={{ width: '100%', maxWidth: 1320, alignSelf: 'center' }}>
          <View
            style={{
              flexDirection: bp.sm ? 'column' : 'row',
              justifyContent: 'space-between',
              gap: bp.sm ? 0 : 30,
              alignItems: 'flex-start',
            }}
          >
            <T
              style={{
                color: '#171b14',
                fontSize: taglineSize,
                lineHeight: taglineSize * 1.15,
                letterSpacing: -0.05 * taglineSize,
              }}
            >
              Sua próxima fase,{'\n'}em código.
            </T>

            <View
              style={{
                flexDirection: 'row',
                gap: bp.md ? 35 : 55,
                marginTop: bp.sm ? 35 : 0,
                width: bp.sm ? '100%' : undefined,
                justifyContent: bp.sm ? 'space-between' : 'flex-start',
              }}
            >
              <View style={{ gap: 14 }}>
                <T style={{ color: '#808a76', fontSize: rem(0.63), letterSpacing: 0.1 * rem(0.63), textTransform: 'uppercase', marginBottom: 5 }}>
                  Explore o laboratório
                </T>
                {[
                  ['solucoes', 'Nossas soluções'],
                  ['crm', 'Entenda o CRM'],
                  ['sobre', 'Sobre a Code Labs'],
                ].map(([to, label]) => (
                  <Anchor key={to} to={to} style={{ color: '#647058', fontSize: rem(0.875) }} hoverStyle={{ color: C.blue }}>
                    {label}
                  </Anchor>
                ))}
              </View>
              <View style={{ gap: 14 }}>
                <T style={{ color: '#808a76', fontSize: rem(0.63), letterSpacing: 0.1 * rem(0.63), textTransform: 'uppercase', marginBottom: 5 }}>
                  Vamos conversar
                </T>
                {[
                  ['orcamento', 'Começar um projeto'],
                  ['processo', 'Como trabalhamos'],
                ].map(([to, label]) => (
                  <Anchor key={to} to={to} style={{ color: '#647058', fontSize: rem(0.875) }} hoverStyle={{ color: C.blue }}>
                    {label}
                  </Anchor>
                ))}
              </View>
            </View>
          </View>

          <View
            style={{
              width: bp.sm ? undefined : '100%',
              maxWidth: bp.sm ? undefined : 620,
              marginHorizontal: bp.sm ? -15 : 'auto',
              marginTop: bp.sm ? 28 : 30,
              marginBottom: 15,
              alignSelf: bp.sm ? 'stretch' : 'center',
            }}
          >
            <Image
              source={require('../../assets/images/footer-signature.jpg')}
              style={{ width: '100%', aspectRatio: 1600 / 533 }}
              resizeMode="contain"
              accessibilityLabel="Powered By Code Labs — assinatura original da marca"
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 20,
              borderTopWidth: 1,
              borderTopColor: '#dce1d4',
              paddingTop: 20,
            }}
          >
            <T style={{ color: '#78836c', fontSize: bottomSize, lineHeight: bp.sm ? bottomSize * 1.6 : undefined, flexShrink: 1 }}>
              © {year} Code Labs. Ideias que viram possibilidades.
            </T>
            <Pressable testID="privacy-open" role="button" onPress={openPrivacy}>
              <T style={{ color: '#78836c', fontSize: bottomSize, textDecorationLine: 'underline', lineHeight: bp.sm ? bottomSize * 1.6 : undefined }}>
                Privacidade nesta prévia
              </T>
            </Pressable>
            <T style={{ color: '#78836c', fontSize: bottomSize, lineHeight: bp.sm ? bottomSize * 1.6 : undefined, flexShrink: 1, textAlign: 'right' }}>
              Design &amp; desenvolvimento com intenção.
            </T>
          </View>
        </View>
      </View>
    </View>
  );
}

