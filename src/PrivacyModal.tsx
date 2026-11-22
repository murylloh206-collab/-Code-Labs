import React, { useEffect } from 'react';
import { Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import { C, rem, useBreakpoints, web } from './theme';
import { Button, T, useNav } from './ui';
import { LEGAL, type LegalTab } from './LegalConfig';

const TABS: { key: LegalTab; label: string }[] = [
  { key: 'privacidade', label: 'Política de Privacidade' },
  { key: 'cookies', label: 'Política de Cookies' },
  { key: 'termos', label: 'Termos de Uso' },
];

function SectionHeading({ children }: { children: string }) {
  return (
    <T style={{ color: '#eef2e7', fontSize: rem(0.95), fontWeight: '700', marginTop: 18, marginBottom: 6 }}>
      {children}
    </T>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <T style={{ color: '#b0bba3', fontSize: rem(0.84), lineHeight: rem(0.84) * 1.65, marginBottom: 8 }}>
      {children}
    </T>
  );
}

export function PrivacyModal({
  visible,
  tab,
  onChangeTab,
  onClose,
  onOpenCookiePrefs,
}: {
  visible: boolean;
  tab: LegalTab;
  onChangeTab: (t: LegalTab) => void;
  onClose: () => void;
  onOpenCookiePrefs: () => void;
}) {
  const bp = useBreakpoints();

  useEffect(() => {
    if (!visible || Platform.OS !== 'web') return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <Pressable
        testID="privacy-backdrop"
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.75)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: bp.sm ? 14 : 24,
          ...web({ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }),
        }}
      >
        <Pressable
          testID="privacy-dialog"
          onPress={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 700,
            maxHeight: '88%',
            borderWidth: 1,
            borderColor: '#596448',
            borderRadius: 12,
            backgroundColor: '#1a2016',
            padding: bp.sm ? 20 : 30,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <T role="heading" aria-level={2} style={{ color: '#eef2e7', fontSize: bp.sm ? rem(1.45) : rem(1.8), letterSpacing: -0.05 * rem(1.8), fontWeight: '500' }}>
              Informações Legais &amp; Privacidade
            </T>
            <T style={{ color: '#7d8870', fontSize: rem(0.68) }}>Atualizado em {LEGAL.lastUpdated}</T>
          </View>

          {/* Tabs */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16, marginBottom: 14, borderBottomWidth: 1, borderBottomColor: '#323a2b', paddingBottom: 12 }}>
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <Pressable
                  key={t.key}
                  testID={`legal-tab-${t.key}`}
                  role="tab"
                  aria-selected={active}
                  onPress={() => onChangeTab(t.key)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 13,
                    borderRadius: 6,
                    backgroundColor: active ? C.lime : '#232a1e',
                  }}
                >
                  <T style={{ color: active ? C.ink : '#c4ccb9', fontSize: rem(0.76), fontWeight: '700' }}>{t.label}</T>
                </Pressable>
              );
            })}
          </View>

          <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ paddingRight: 8 }}>
            {tab === 'privacidade' && (
              <View>
                <SectionHeading>1. Controlador e Legislação Aplicável</SectionHeading>
                <Body>
                  Este site é mantido por {LEGAL.legalName} ({LEGAL.brandName}), inscrita no CNPJ sob o nº {LEGAL.cnpj}, com sede em {LEGAL.address}. O tratamento de dados pessoais observa a Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018), o Marco Civil da Internet (Lei nº 12.965/2014) e demais normas brasileiras aplicáveis.
                </Body>

                <SectionHeading>2. Dados Coletados e Finalidade</SectionHeading>
                <Body>
                  • Formulário de briefing: os dados inseridos (tipo de solução, nome, empresa e descrição do desafio) são processados localmente no seu navegador para gerar o resumo do projeto. Quando um canal comercial (ex.: WhatsApp) estiver configurado, o envio só ocorre mediante ação expressa do visitante.{'\n'}
                  • Preferências de cookies: armazenamos localmente sua escolha de consentimento para respeitar suas definições em visitas futuras.{'\n'}
                  • Registros de acesso: o provedor de hospedagem pode registrar logs técnicos (como endereço IP, data e hora de acesso) estritamente para segurança e cumprimento de obrigação legal (art. 15 do Marco Civil da Internet).
                </Body>

                <SectionHeading>3. Bases Legais (Art. 7º da LGPD)</SectionHeading>
                <Body>
                  Tratamos dados pessoais apenas mediante: (i) consentimento do titular (art. 7º, I); (ii) procedimentos preliminares relacionados a contrato a pedido do titular (art. 7º, V); (iii) cumprimento de obrigação legal ou regulatória (art. 7º, II); e (iv) legítimo interesse, observados os direitos e liberdades fundamentais do titular (art. 7º, IX).
                </Body>

                <SectionHeading>4. Compartilhamento, Retenção e Segurança</SectionHeading>
                <Body>
                  Não vendemos nem comercializamos dados pessoais. Eventual compartilhamento ocorre apenas com operadores essenciais de infraestrutura (hospedagem e comunicação) sob obrigações de confidencialidade e segurança, ou por determinação legal/judicial. Os dados são mantidos apenas pelo tempo necessário à finalidade informada ou ao cumprimento de prazos legais.
                </Body>

                <SectionHeading>5. Direitos do Titular (Art. 18 da LGPD)</SectionHeading>
                <Body>
                  Você pode solicitar, a qualquer momento: confirmação da existência de tratamento; acesso aos dados; correção de dados incompletos, inexatos ou desatualizados; anonimização, bloqueio ou eliminação de dados desnecessários; portabilidade; eliminação de dados tratados com consentimento; informação sobre compartilhamento; e revogação do consentimento.
                </Body>

                <SectionHeading>6. Encarregado pelo Tratamento de Dados (DPO)</SectionHeading>
                <Body>
                  Para exercer seus direitos ou tirar dúvidas sobre privacidade, entre em contato com {LEGAL.dpoName} pelo e-mail: {LEGAL.dpoEmail}.
                </Body>
              </View>
            )}

            {tab === 'cookies' && (
              <View>
                <SectionHeading>1. O que são cookies e armazenamento local?</SectionHeading>
                <Body>
                  Cookies e tecnologias similares (como localStorage) são pequenos arquivos armazenados no seu navegador para permitir o funcionamento técnico do site, lembrar suas preferências e, quando autorizado, compreender de forma agregada como o site é utilizado.
                </Body>

                <SectionHeading>2. Categorias utilizadas</SectionHeading>
                <Body>
                  • Estritamente necessários (sempre ativos): indispensáveis para exibir as páginas corretamente, manter a segurança básica e registrar sua decisão de consentimento de cookies.{'\n'}
                  • Preferências e análise (opcionais): permanecem desativados por padrão e só são utilizados caso você dê consentimento explícito no aviso de cookies. Não utilizamos cookies de publicidade comportamental de terceiros nesta versão.
                </Body>

                <SectionHeading>3. Como gerenciar ou revogar seu consentimento</SectionHeading>
                <Body>
                  Você pode alterar ou revogar sua escolha a qualquer momento clicando em &ldquo;Preferências de cookies&rdquo; no rodapé do site, ou configurando o bloqueio/exclusão de cookies diretamente nas opções do seu navegador.
                </Body>
                <Pressable
                  role="button"
                  onPress={() => {
                    onClose();
                    onOpenCookiePrefs();
                  }}
                  style={{ alignSelf: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.lime, marginTop: 4 }}
                >
                  <T style={{ color: C.lime, fontSize: rem(0.8) }}>Abrir preferências de cookies agora</T>
                </Pressable>
              </View>
            )}

            {tab === 'termos' && (
              <View>
                <SectionHeading>1. Aceitação e Objeto</SectionHeading>
                <Body>
                  Ao acessar este site institucional da {LEGAL.brandName} ({LEGAL.legalName}, CNPJ {LEGAL.cnpj}), você concorda com estes Termos de Uso. O site apresenta informações institucionais sobre serviços de desenvolvimento de sites, CRMs, sistemas de gestão e automações sob medida.
                </Body>

                <SectionHeading>2. Propriedade Intelectual</SectionHeading>
                <Body>
                  Todo o conteúdo disponibilizado — incluindo a marca &lt;Code&gt; Labs, logotipos, identidade visual, textos, ilustrações, layout e código-fonte — é protegido pelas leis brasileiras de propriedade intelectual e direitos autorais (Lei nº 9.610/1998 e Lei nº 9.279/1996). É vedada a reprodução, distribuição ou uso comercial sem autorização prévia por escrito.
                </Body>

                <SectionHeading>3. Caráter Ilustrativo e Ausência de Proposta Vinculante</SectionHeading>
                <Body>
                  As telas de demonstração de CRM exibidas na página utilizam dados inteiramente fictícios com finalidade meramente ilustrativa. O preenchimento do briefing interativo não constitui proposta comercial vinculante, contrato de prestação de serviços nem garantia automática de prazo ou preço — todo projeto depende de análise técnica, proposta formal e contrato específico entre as partes.
                </Body>

                <SectionHeading>4. Limitação de Responsabilidade e Links Externos</SectionHeading>
                <Body>
                  Empregamos esforços razoáveis para manter o site disponível, seguro e atualizado, mas não garantimos operação ininterrupta ou isenta de falhas decorrentes de fatores externos. Eventuais redirecionamentos para serviços de terceiros (como WhatsApp) seguem os termos e políticas próprias dessas plataformas.
                </Body>

                <SectionHeading>5. Legislação Aplicável e Foro</SectionHeading>
                <Body>
                  Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de {LEGAL.forumCityState}, com renúncia a qualquer outro, ressalvadas as hipóteses de foro privilegiado previstas no Código de Defesa do Consumidor (Lei nº 8.078/1990) quando aplicável.
                </Body>
              </View>
            )}
          </ScrollView>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 18 }}>
            <Button label="Entendi" testID="privacy-close" onPress={onClose} style={{ minHeight: 44, paddingVertical: 12, paddingHorizontal: 22 }} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function Toast({ message }: { message: string }) {
  const { reduced } = useNav();
  const visible = Boolean(message);
  return (
    <View
      testID="toast"
      role="status"
      pointerEvents="none"
      style={{
        position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
        left: 16,
        right: 16,
        bottom: 24,
        alignItems: 'center',
        zIndex: 100,
        opacity: visible ? 1 : 0,
        transform: [{ translateY: visible ? 0 : 20 }],
        ...(!reduced ? web({ transitionProperty: 'opacity, transform', transitionDuration: '250ms' }) : {}),
      }}
    >
      <View
        style={{
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderWidth: 1,
          borderColor: '#65774c',
          borderRadius: 7,
          backgroundColor: C.lime,
          ...web({ boxShadow: '0 10px 40px #0006' }),
        }}
      >
        <T style={{ color: '#1b2810', fontSize: rem(0.8) }}>{message}</T>
      </View>
    </View>
  );
}
