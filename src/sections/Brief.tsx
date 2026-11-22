import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, Share, TextInput, View } from 'react-native';
import { C, clamp, FONT, gutter, rem, useBreakpoints, web } from '../theme';
import { Button, openExternal, Section, T, useNav } from '../ui';
import { Bolt, Code, Grid, Help, Site } from '../icons';
import { Reveal } from '../Reveal';
import { LEGAL } from '../LegalConfig';
import { loadCurrentConsent, recordConsentDecision } from '../ConsentManager';

/**
 * Configurar o número comercial, com DDI (ex.: '5511999999999'), antes do lançamento.
 * Pode ser definido via EXPO_PUBLIC_CONTACT_WHATSAPP no ambiente de build.
 */
export const CONTACT_WHATSAPP = (process.env.EXPO_PUBLIC_CONTACT_WHATSAPP ?? '').trim();

const CHOICES = [
  { key: 'site', label: 'Site ou landing page', Icon: Site },
  { key: 'crm', label: 'CRM personalizado', Icon: Grid },
  { key: 'system', label: 'Sistema de gestão', Icon: Code },
  { key: 'auto', label: 'Automação ou integração', Icon: Bolt },
  { key: 'help', label: 'Quero descobrir a melhor solução', Icon: Help },
] as const;

const BENEFITS = [
  'Conversa inicial sem compromisso',
  'Proposta com escopo claro',
  'Solução pensada para o seu negócio',
];

export type BriefState = {
  step: 1 | 2 | 3;
  service: string;
  name: string;
  company: string;
  goal: string;
  lgpdConsent?: boolean;
  consentProtocol?: string;
};

export function Brief({
  state,
  setState,
}: {
  state: BriefState;
  setState: React.Dispatch<React.SetStateAction<BriefState>>;
}) {
  const bp = useBreakpoints();
  const { toast, reduced, openPrivacy } = useNav();
  const [error, setError] = useState('');
  const [copyFallback, setCopyFallback] = useState(false);

  const headingRef = useRef<any>(null);
  const nameRef = useRef<any>(null);
  const goalRef = useRef<any>(null);

  const h2Size = bp.sm ? rem(2.9) : bp.md ? rem(3.7) : clamp(rem(2.6), bp.vw(4.8), rem(4.75));
  const eyebrowSize = bp.sm ? rem(0.6) : rem(0.68);
  const metaSize = bp.sm ? rem(0.56) : rem(0.62);

  const briefText = () =>
    `Olá, Code Labs! Quero conversar sobre um projeto.\n\nSolução: ${state.service}\nNome: ${state.name.trim()}\nEmpresa: ${state.company.trim() || 'A definir'}\n\nMeu desafio:\n${state.goal.trim()}\n\nConsentimento LGPD (Política v${LEGAL.policyVersion}): Confirmado${state.consentProtocol ? ` (${state.consentProtocol})` : ''}\nVamos conversar sobre os próximos passos?`;

  const goToStep = (next: 1 | 2 | 3) => {
    setError('');
    setCopyFallback(false);
    setState((s) => ({ ...s, step: next }));
    if (Platform.OS === 'web') {
      setTimeout(() => {
        const el = headingRef.current as any;
        if (el?.focus) {
          el.tabIndex = -1;
          el.focus({ preventScroll: true });
        }
      }, 0);
    }
  };

  useEffect(() => {
    setError('');
    setCopyFallback(false);
  }, [state.step]);

  const handleReview = () => {
    const name = state.name.trim();
    const goal = state.goal.trim();
    if (!name) {
      setError('Preencha seu nome para continuar.');
      nameRef.current?.focus();
      return;
    }
    if (goal.length < 15) {
      setError('Conte um pouco mais do desafio (pelo menos 15 caracteres).');
      goalRef.current?.focus();
      return;
    }
    if (!state.lgpdConsent) {
      setError('Para continuar, marque o consentimento com a Política de Privacidade e Termos de Uso (LGPD).');
      return;
    }
    const existing = loadCurrentConsent();
    const audit = recordConsentDecision(
      'form_briefing_consent',
      existing?.categories ?? { functional: false, analytics: false, marketing: false },
      `Consentimento explícito no formulário de briefing (Art. 7º, I e V da LGPD)`,
    );
    setState((s) => ({
      ...s,
      name,
      company: s.company.trim(),
      goal,
      consentProtocol: audit.consentId,
    }));
    goToStep(3);
  };

  const handleDownload = () => {
    const text = briefText();
    if (Platform.OS === 'web') {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'meu-projeto-code-labs.txt';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast('Briefing preparado para baixar. Nenhum dado foi enviado.');
    } else {
      Share.share({ message: text, title: 'Briefing Code Labs' }).catch(() => {
        toast('Não foi possível abrir o compartilhamento.');
      });
    }
  };

  const handleFinish = () => {
    if (CONTACT_WHATSAPP) {
      openExternal(`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(briefText())}`);
    } else {
      handleDownload();
    }
  };

  const handleCopy = async () => {
    const text = briefText();
    try {
      if (Platform.OS === 'web' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        toast('Resumo copiado. Pronto para continuar a conversa.');
      } else {
        setCopyFallback(true);
      }
    } catch {
      setCopyFallback(true);
    }
  };

  const inputStyle = {
    width: '100%' as const,
    paddingVertical: 12,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#ccd5be',
    borderRadius: 5,
    color: '#26351b',
    backgroundColor: '#fff',
    fontFamily: FONT,
    fontSize: rem(0.85),
    ...web({ outlineOffset: 2 }),
  };

  const renderChoice = (c: (typeof CHOICES)[number], full?: boolean) => {
    const pressed = state.service === c.label;
    return (
      <Pressable
        key={c.key}
        testID={`choice-${c.key}`}
        role="button"
        aria-pressed={pressed}
        onPress={() => setState((s) => ({ ...s, service: c.label }))}
        style={{
          flex: full ? undefined : 1,
          width: full ? '100%' : undefined,
          flexDirection: 'row',
          alignItems: 'center',
          gap: bp.sm ? 8 : 10,
          paddingVertical: bp.sm ? 13 : 15,
          paddingHorizontal: bp.sm ? 10 : 13,
          borderWidth: 1,
          borderColor: pressed ? '#718349' : '#d4dbc8',
          backgroundColor: pressed ? '#e8eddc' : '#fafbf7',
          borderRadius: 5,
          minHeight: full ? 50 : 70,
          ...(pressed ? web({ boxShadow: '0 0 0 1px #718349' }) : {}),
          ...(!reduced ? web({ transitionProperty: 'border-color, background-color', transitionDuration: '200ms' }) : {}),
        }}
      >
        <c.Icon size={19} color={pressed ? C.blue : '#8c997a'} />
        <T style={{ color: '#344127', fontSize: bp.sm ? rem(0.7) : rem(0.75), flexShrink: 1 }}>{c.label}</T>
      </Pressable>
    );
  };

  return (
    <Section
      id="orcamento"
      style={{
        paddingVertical: bp.md ? 65 : 90,
        backgroundColor: C.blue,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <View style={{ paddingHorizontal: gutter(bp) }}>
        <View
          style={{
            width: '100%',
            maxWidth: 1320,
            alignSelf: 'center',
            flexDirection: bp.md ? 'column' : 'row',
            gap: bp.md ? 35 : bp.lg ? 50 : 100,
            alignItems: 'flex-start',
          }}
        >
          {/* Left column */}
          <Reveal style={[!bp.md ? { flex: 1 } : undefined, { paddingTop: 15 }]}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <T style={{ color: C.lime, fontSize: rem(1.25), lineHeight: rem(1.25) }}>+</T>
                <T style={{ color: '#cbd0ff', fontSize: eyebrowSize, letterSpacing: 0.13 * eyebrowSize, fontWeight: '600', textTransform: 'uppercase' }}>
                  O seu próximo projeto começa aqui
                </T>
              </View>
              <T
                role="heading"
                aria-level={2}
                style={{
                  color: C.paper,
                  fontSize: h2Size,
                  lineHeight: h2Size * 1.05,
                  letterSpacing: -0.055 * h2Size,
                  fontWeight: '500',
                  maxWidth: bp.md ? 550 : 510,
                  marginVertical: 24,
                }}
              >
                O que a gente{'\n'}vai construir{'\n'}
                <T style={{ color: C.lime }}>juntos?</T>
              </T>
              <T style={{ color: '#c2caff', fontSize: rem(1), lineHeight: rem(1) * 1.65, maxWidth: bp.md ? 520 : 390 }}>
                Conte o que você tem em mente. Vamos transformar seu desafio em um ponto de partida para o projeto.
              </T>
              <View style={{ gap: bp.md ? 10 : 15, marginTop: bp.md ? 25 : 35 }}>
                {BENEFITS.map((b) => (
                  <T key={b} style={{ color: '#e2e6ff', fontSize: bp.sm ? rem(0.76) : rem(0.8) }}>
                    <T style={{ color: C.lime }}>✓</T>
                    {'   '}
                    {b}
                  </T>
                ))}
              </View>
            </View>
          </Reveal>

          {/* Right column: Brief Card */}
          <Reveal style={!bp.md ? { flex: 1 } : { width: '100%', maxWidth: 620 }}>
            <View
              testID="brief-card"
              style={{
                paddingVertical: bp.sm ? 24 : 30,
                paddingHorizontal: bp.sm ? 20 : 30,
                backgroundColor: '#f4f5ee',
                borderRadius: 10,
                minHeight: bp.sm ? 460 : 480,
                ...web({ colorScheme: 'light', boxShadow: '0 15px 40px #0011aa55' }),
              }}
            >
              {/* Progress */}
              <View aria-hidden={true} style={{ flexDirection: 'row', gap: 6, marginBottom: 24 }}>
                {[1, 2, 3].map((step) => (
                  <View
                    key={step}
                    style={{
                      height: 3,
                      flex: 1,
                      backgroundColor: step <= state.step ? '#263cff' : '#d6dbcb',
                    }}
                  />
                ))}
              </View>

              {/* Meta */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <T style={{ fontSize: metaSize, color: '#7e876f', letterSpacing: 0.07 * metaSize, textTransform: 'uppercase' }}>
                  SEU PROJETO, DO SEU JEITO
                </T>
                <T style={{ fontSize: metaSize, color: '#7e876f', letterSpacing: 0.07 * metaSize, textTransform: 'uppercase' }}>
                  PASSO {state.step} DE 3
                </T>
              </View>

              {/* Step 1 */}
              {state.step === 1 && (
                <View>
                  <T
                    ref={headingRef}
                    role="heading"
                    aria-level={3}
                    style={{
                      color: '#20261a',
                      fontSize: bp.sm ? rem(1.7) : rem(1.8),
                      marginTop: 17,
                      marginBottom: 9,
                      lineHeight: (bp.sm ? rem(1.7) : rem(1.8)) * 1.15,
                      letterSpacing: -0.045 * rem(1.8),
                      fontWeight: '500',
                    }}
                  >
                    O que você quer criar?
                  </T>
                  <T style={{ color: '#77816a', fontSize: bp.sm ? rem(0.73) : rem(0.8), lineHeight: rem(0.8) * 1.65, marginBottom: 21 }}>
                    Escolha o ponto de partida. A gente cuida dos detalhes juntos.
                  </T>

                  <View style={{ gap: 10 }}>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      {renderChoice(CHOICES[0])}
                      {renderChoice(CHOICES[1])}
                    </View>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      {renderChoice(CHOICES[2])}
                      {renderChoice(CHOICES[3])}
                    </View>
                    {renderChoice(CHOICES[4], true)}
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 23 }}>
                    <T style={{ fontSize: rem(0.68), color: '#7e896f' }}>Leva cerca de 1 minuto.</T>
                    <Button
                      label="Continuar"
                      variant="blue"
                      testID="brief-next"
                      onPress={() => goToStep(2)}
                      style={{ minHeight: 44, paddingVertical: 13, paddingHorizontal: 24 }}
                      textStyle={bp.sm ? { fontSize: rem(0.75) } : undefined}
                    />
                  </View>
                  <T style={{ fontSize: bp.sm ? rem(0.6) : rem(0.68), lineHeight: rem(0.68) * 1.5, color: '#7f8a70', marginTop: 16 }}>
                    Prévia interativa: nenhum dado será enviado nesta etapa.
                  </T>
                </View>
              )}

              {/* Step 2 */}
              {state.step === 2 && (
                <View>
                  <T
                    ref={headingRef}
                    role="heading"
                    aria-level={3}
                    style={{
                      color: '#20261a',
                      fontSize: bp.sm ? rem(1.7) : rem(1.8),
                      marginTop: 17,
                      marginBottom: 9,
                      lineHeight: (bp.sm ? rem(1.7) : rem(1.8)) * 1.15,
                      letterSpacing: -0.045 * rem(1.8),
                      fontWeight: '500',
                    }}
                  >
                    Conte um pouco da ideia.
                  </T>
                  <T style={{ color: '#77816a', fontSize: bp.sm ? rem(0.73) : rem(0.8), lineHeight: rem(0.8) * 1.65, marginBottom: 21 }}>
                    Sem termos técnicos. O importante é entender seu desafio.
                  </T>

                  <View style={{ flexDirection: bp.sm ? 'column' : 'row', gap: bp.sm ? 0 : 12 }}>
                    <View style={{ flex: 1 }}>
                      <T style={{ fontSize: rem(0.73), color: '#5e6c4e', marginBottom: 6, marginTop: 16 }}>Seu nome *</T>
                      <TextInput
                        ref={nameRef}
                        testID="brief-name"
                        value={state.name}
                        onChangeText={(name) => setState((s) => ({ ...s, name }))}
                        maxLength={100}
                        placeholder="Como podemos te chamar?"
                        placeholderTextColor="#8c9680"
                        autoComplete="name"
                        style={inputStyle}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <T style={{ fontSize: rem(0.73), color: '#5e6c4e', marginBottom: 6, marginTop: 16 }}>Sua empresa</T>
                      <TextInput
                        testID="brief-company"
                        value={state.company}
                        onChangeText={(company) => setState((s) => ({ ...s, company }))}
                        maxLength={150}
                        placeholder="Nome da empresa"
                        placeholderTextColor="#8c9680"
                        autoComplete="organization"
                        style={inputStyle}
                      />
                    </View>
                  </View>

                  <T style={{ fontSize: rem(0.73), color: '#5e6c4e', marginBottom: 6, marginTop: 16 }}>O que você quer resolver? *</T>
                  <TextInput
                    ref={goalRef}
                    testID="brief-goal"
                    value={state.goal}
                    onChangeText={(goal) => setState((s) => ({ ...s, goal }))}
                    maxLength={2000}
                    multiline
                    placeholder="Ex.: Quero apresentar melhor minha empresa e receber pedidos de orçamento."
                    placeholderTextColor="#8c9680"
                    style={[inputStyle, { minHeight: 96, textAlignVertical: 'top' }]}
                  />

                  {/* Checkbox obrigatório NÃO pré-marcado (Conformidade LGPD Art. 7º, I e Art. 8º) */}
                  <Pressable
                    testID="brief-lgpd-consent"
                    role="checkbox"
                    aria-checked={Boolean(state.lgpdConsent)}
                    onPress={() => setState((s) => ({ ...s, lgpdConsent: !s.lgpdConsent }))}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: 10,
                      marginTop: 16,
                      padding: 10,
                      backgroundColor: '#e8eddc',
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: state.lgpdConsent ? '#2038ff' : '#ccd5be',
                    }}
                  >
                    <View
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        borderWidth: 1.5,
                        borderColor: state.lgpdConsent ? C.blue : '#6c785b',
                        backgroundColor: state.lgpdConsent ? C.blue : '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 2,
                      }}
                    >
                      {state.lgpdConsent && <T style={{ color: '#fff', fontSize: 12, fontWeight: '900', lineHeight: 14 }}>✓</T>}
                    </View>
                    <T style={{ color: '#2b361f', fontSize: rem(0.72), lineHeight: rem(0.72) * 1.5, flex: 1 }}>
                      Li e concordo com a{' '}
                      <T
                        role="link"
                        onPress={() => openPrivacy('privacidade')}
                        style={{ color: C.blue, textDecorationLine: 'underline', fontWeight: '700' }}
                      >
                        Política de Privacidade
                      </T>{' '}
                      e os{' '}
                      <T
                        role="link"
                        onPress={() => openPrivacy('termos')}
                        style={{ color: C.blue, textDecorationLine: 'underline', fontWeight: '700' }}
                      >
                        Termos de Uso
                      </T>
                      , e consinto com o tratamento dos dados informados para elaboração deste briefing comercial (Art. 7º, I e V da LGPD). *
                    </T>
                  </Pressable>

                  {!!error && (
                    <T testID="brief-error" role="alert" style={{ color: '#ad2a23', fontSize: rem(0.75), marginTop: 14 }}>
                      {error}
                    </T>
                  )}

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 23 }}>
                    <Pressable testID="brief-back" role="button" onPress={() => goToStep(1)} style={{ paddingVertical: 12 }}>
                      <T style={{ color: '#6b765c', fontSize: rem(0.75) }}>Voltar</T>
                    </Pressable>
                    <Button
                      label="Revisar meu briefing"
                      variant="blue"
                      testID="brief-review"
                      onPress={handleReview}
                      style={{ minHeight: 44, paddingVertical: 13, paddingHorizontal: 24 }}
                      textStyle={bp.sm ? { fontSize: rem(0.75) } : undefined}
                    />
                  </View>
                  <T style={{ fontSize: bp.sm ? rem(0.6) : rem(0.68), lineHeight: rem(0.68) * 1.5, color: '#7f8a70', marginTop: 16 }}>
                    Suas respostas ficam apenas nesta página durante a visita.
                  </T>
                </View>
              )}

              {/* Step 3 */}
              {state.step === 3 && (
                <View>
                  <T
                    ref={headingRef}
                    role="heading"
                    aria-level={3}
                    style={{
                      color: '#20261a',
                      fontSize: bp.sm ? rem(1.7) : rem(1.8),
                      marginTop: 17,
                      marginBottom: 9,
                      lineHeight: (bp.sm ? rem(1.7) : rem(1.8)) * 1.15,
                      letterSpacing: -0.045 * rem(1.8),
                      fontWeight: '500',
                    }}
                  >
                    Um bom começo.
                  </T>
                  <T style={{ color: '#77816a', fontSize: bp.sm ? rem(0.73) : rem(0.8), lineHeight: rem(0.8) * 1.65, marginBottom: 21 }}>
                    Confira o resumo do projeto antes do próximo passo.
                  </T>

                  <View style={{ marginVertical: 16 }}>
                    {[
                      ['O QUE VAMOS CRIAR', state.service],
                      ['SOBRE VOCÊ', `${state.name}${state.company ? ` · ${state.company}` : ''}`],
                      ['O DESAFIO', state.goal],
                      ['REGISTRO DE CONSENTIMENTO LGPD', `Confirmado · Protocolo ${state.consentProtocol || 'Local'} (Política v${LEGAL.policyVersion})`],
                    ].map(([label, value]) => (
                      <View key={label} style={{ paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: '#dbe1d2' }}>
                        <T style={{ textTransform: 'uppercase', letterSpacing: 0.08 * rem(0.58), fontSize: rem(0.58), color: '#7e896f', marginBottom: 4 }}>
                          {label}
                        </T>
                        <T style={{ color: '#20261a', fontSize: rem(0.8), lineHeight: rem(0.8) * 1.55 }}>{value}</T>
                      </View>
                    ))}
                  </View>

                  <View style={{ backgroundColor: '#e6ebdc', padding: 12, borderRadius: 4 }}>
                    <T style={{ fontSize: rem(0.72), color: '#5e6d4b', lineHeight: rem(0.72) * 1.6 }}>
                      {CONTACT_WHATSAPP
                        ? 'Ao continuar, você abre o WhatsApp com este resumo. Revise a mensagem antes de enviar.'
                        : 'Você está testando a prévia. O WhatsApp comercial será conectado antes do lançamento. Por enquanto, você pode baixar ou copiar seu briefing.'}
                    </T>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 23 }}>
                    <Pressable testID="brief-back" role="button" onPress={() => goToStep(2)} style={{ paddingVertical: 12 }}>
                      <T style={{ color: '#6b765c', fontSize: rem(0.75) }}>Editar respostas</T>
                    </Pressable>
                    <Button
                      label={CONTACT_WHATSAPP ? 'Conversar no WhatsApp' : 'Baixar meu briefing'}
                      variant="blue"
                      testID="brief-finish"
                      onPress={handleFinish}
                      style={{ minHeight: 44, paddingVertical: 13, paddingHorizontal: 24 }}
                      textStyle={bp.sm ? { fontSize: rem(0.75) } : undefined}
                    />
                  </View>

                  <Pressable
                    testID="brief-copy"
                    role="button"
                    onPress={handleCopy}
                    style={{ alignSelf: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#243cff', marginTop: 8 }}
                  >
                    <T style={{ color: '#243cff', fontSize: rem(0.75) }}>Copiar resumo do projeto</T>
                  </Pressable>

                  {copyFallback && (
                    <View style={{ marginTop: 12 }}>
                      <T style={{ fontSize: rem(0.73), color: '#5e6c4e', marginBottom: 6 }}>Selecione e copie seu resumo:</T>
                      <TextInput
                        value={briefText()}
                        editable={false}
                        multiline
                        selectTextOnFocus
                        style={[inputStyle, { minHeight: 120 }]}
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
          </Reveal>
        </View>
      </View>
    </Section>
  );
}
