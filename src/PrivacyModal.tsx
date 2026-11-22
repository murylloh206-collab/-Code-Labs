import React, { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { C, FONT, MONO, rem, useBreakpoints, web } from './theme';
import { Button, openExternal, T, useNav } from './ui';
import { LEGAL, ROPA_RECORDS, type LegalTab } from './LegalConfig';
import {
  exportConsentAuditJson,
  loadConsentAuditLogs,
  loadCurrentConsent,
  recordDsarRequest,
  type ConsentAuditRecord,
  type DsarRequestRecord,
} from './ConsentManager';

const TABS: { key: LegalTab; label: string }[] = [
  { key: 'privacidade', label: 'Política de Privacidade' },
  { key: 'cookies', label: 'Cookies & Logs (Auditoria)' },
  { key: 'ropa', label: 'ROPA, Segurança & Incidentes' },
  { key: 'titular', label: 'Direitos do Titular & DPO' },
  { key: 'termos', label: 'Termos de Uso' },
];

const DSAR_RIGHTS = [
  'Confirmação da existência de tratamento (Art. 18, I)',
  'Acesso aos dados pessoais (Art. 18, II)',
  'Correção de dados incompletos, inexatos ou desatualizados (Art. 18, III)',
  'Anonimização, bloqueio ou eliminação de dados (Art. 18, IV e VI)',
  'Portabilidade dos dados a outro fornecedor (Art. 18, V)',
  'Informação sobre compartilhamento de dados (Art. 18, VII)',
  'Revogação do consentimento (Art. 18, IX e Art. 8º, §5º)',
  'Revisão de decisões automatizadas (Art. 20)',
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <T style={{ color: '#eef2e7', fontSize: rem(0.94), fontWeight: '700', marginTop: 18, marginBottom: 6 }}>
      {children}
    </T>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <T style={{ color: '#b4bfa6', fontSize: rem(0.82), lineHeight: rem(0.82) * 1.65, marginBottom: 8 }}>
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
  onRevokeConsent,
}: {
  visible: boolean;
  tab: LegalTab;
  onChangeTab: (t: LegalTab) => void;
  onClose: () => void;
  onOpenCookiePrefs: () => void;
  onRevokeConsent: () => void;
}) {
  const bp = useBreakpoints();
  const { toast } = useNav();
  const [currentConsent, setCurrentConsent] = useState<ConsentAuditRecord | null>(null);
  const [auditLogs, setAuditLogs] = useState<ConsentAuditRecord[]>([]);

  // Estado do formulário do Canal do Titular / DPO (DSAR)
  const [dsarRight, setDsarRight] = useState(DSAR_RIGHTS[0]);
  const [dsarName, setDsarName] = useState('');
  const [dsarEmail, setDsarEmail] = useState('');
  const [dsarDetails, setDsarDetails] = useState('');
  const [dsarConsent, setDsarConsent] = useState(false); // Não pré-marcado!
  const [dsarError, setDsarError] = useState('');
  const [dsarProtocol, setDsarProtocol] = useState<DsarRequestRecord | null>(null);

  useEffect(() => {
    if (visible) {
      setCurrentConsent(loadCurrentConsent());
      setAuditLogs(loadConsentAuditLogs());
    }
  }, [visible, tab]);

  useEffect(() => {
    if (!visible || Platform.OS !== 'web') return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible, onClose]);

  if (!visible) return null;

  const submitDsar = () => {
    if (!dsarName.trim()) {
      setDsarError('Informe seu nome completo para identificação do titular.');
      return;
    }
    if (!dsarEmail.trim() || !dsarEmail.includes('@')) {
      setDsarError('Informe um e-mail válido para receber a resposta do Encarregado (DPO).');
      return;
    }
    if (!dsarConsent) {
      setDsarError('Marque a confirmação de consentimento para o tratamento desta requisição legal (Art. 7º, II da LGPD).');
      return;
    }
    setDsarError('');
    const rec = recordDsarRequest(dsarRight, dsarName, dsarEmail, dsarDetails);
    setDsarProtocol(rec);
    toast(`Protocolo ${rec.protocol} gerado com sucesso.`);
  };

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <Pressable
        testID="privacy-backdrop"
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.78)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: bp.sm ? 10 : 22,
          ...web({ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }),
        }}
      >
        <Pressable
          testID="privacy-dialog"
          onPress={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 860,
            maxHeight: '90%',
            borderWidth: 1,
            borderColor: '#596448',
            borderRadius: 12,
            backgroundColor: '#171c14',
            padding: bp.sm ? 16 : 26,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <View>
              <T role="heading" aria-level={2} style={{ color: '#eef2e7', fontSize: bp.sm ? rem(1.35) : rem(1.65), letterSpacing: -0.04 * rem(1.65), fontWeight: '600' }}>
                Central de Privacidade, Governança LGPD &amp; Termos
              </T>
              <T style={{ color: '#8a967b', fontSize: rem(0.72), marginTop: 2 }}>
                Lei nº 13.709/2018 (LGPD) · Marco Civil da Internet (Lei nº 12.965/2014) · Versão {LEGAL.policyVersion} ({LEGAL.lastUpdated})
              </T>
            </View>
          </View>

          {/* Tabs */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 6,
              marginTop: 14,
              marginBottom: 12,
              borderBottomWidth: 1,
              borderBottomColor: '#2e3627',
              paddingBottom: 12,
            }}
          >
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
                    paddingVertical: 7,
                    paddingHorizontal: 11,
                    borderRadius: 6,
                    backgroundColor: active ? C.lime : '#232a1e',
                  }}
                >
                  <T style={{ color: active ? C.ink : '#c4ccb9', fontSize: rem(0.73), fontWeight: '700' }}>{t.label}</T>
                </Pressable>
              );
            })}
          </View>

          <ScrollView style={{ maxHeight: 440 }} contentContainerStyle={{ paddingRight: 8 }}>
            {/* ABA 1: POLÍTICA DE PRIVACIDADE */}
            {tab === 'privacidade' && (
              <View>
                <SectionHeading>1. Identificação do Controlador e do Encarregado (DPO — Art. 41)</SectionHeading>
                <Body>
                  • Controlador: {LEGAL.legalName} ({LEGAL.brandName}) — CNPJ: {LEGAL.cnpj}.{'\n'}
                  • Endereço: {LEGAL.address}.{'\n'}
                  • Encarregado pelo Tratamento de Dados (DPO): {LEGAL.dpoName} ({LEGAL.dpoRole}).{'\n'}
                  • Canal oficial de atendimento ao titular e à ANPD: {LEGAL.dpoEmail}. ({LEGAL.dpoAppointmentNote})
                </Body>

                <SectionHeading>2. Princípios Observados (Art. 6º da LGPD)</SectionHeading>
                <Body>
                  Todo tratamento de dados pessoais realizado pela Code Labs observa estritamente os princípios de: Finalidade (propósitos legítimos, específicos e informados), Adequação, Necessidade (minimização ao estritamente indispensável), Livre Acesso, Qualidade dos Dados, Transparência, Segurança, Prevenção, Não Discriminação e Responsabilização e Prestação de Contas.
                </Body>

                <SectionHeading>3. Dados Coletados, Finalidades e Bases Legais (Art. 7º da LGPD)</SectionHeading>
                <Body>
                  • Briefing Comercial (Nome, Empresa opcional, Solução e Desafio): coletados apenas quando preenchidos voluntariamente pelo usuário para elaboração de diagnóstico e proposta preliminar. Base Legal: Consentimento explícito mediante checkbox não pré-marcado (Art. 7º, I) e procedimentos preliminares relacionados a contrato a pedido do titular (Art. 7º, V).{'\n'}
                  • Cookies Estritamente Necessários e Segurança de Rede (IP e logs técnicos de acesso): utilizados para funcionamento seguro da aplicação, prevenção a fraudes e defesa contra incidentes. Base Legal: Legítimo Interesse (Art. 7º, IX, mediante teste de balanceamento) e cumprimento de obrigação legal (Art. 7º, II c/c Art. 15 do Marco Civil da Internet).{'\n'}
                  • Cookies Opcionais (Funcionalidade, Análise de Audiência e Publicidade): permanecem bloqueados por padrão e só são ativados mediante Consentimento livre, informado, granular e inequívoco (Art. 7º, I).{'\n'}
                  • Registros de Consentimento e Requisições de Titulares: armazenados para comprovação legal perante a ANPD. Base Legal: Cumprimento de obrigação legal ou regulatória (Art. 7º, II e Art. 8º, §2º) e exercício regular de direitos em processo (Art. 7º, VI).
                </Body>

                <SectionHeading>4. Dados Sensíveis (Art. 11) e Crianças/Adolescentes (Art. 14)</SectionHeading>
                <Body>
                  Não coletamos nem solicitamos dados pessoais sensíveis (origem racial/étnica, convicção religiosa, opinião política, saúde, genética ou biometria) em nosso site. Nossos serviços destinam-se exclusivamente a pessoas maiores de 18 anos e representantes empresariais. Caso seja identificada coleta inadvertida de dados de criança ou adolescente sem consentimento específico e destacado do responsável legal (Art. 14), os dados serão eliminados imediatamente.
                </Body>

                <SectionHeading>5. Contratos com Operadores (Art. 39) e Transferência Internacional (Arts. 33-36)</SectionHeading>
                <Body>
                  Não vendemos dados pessoais. Fornecedores de infraestrutura tecnológica (hospedagem web e mensageria) atuam como Operadores (Art. 39), vinculados por obrigações contratuais de confidencialidade, segurança da informação, proibição de uso próprio, auditoria e eliminação ao término do contrato. Quando a infraestrutura em nuvem envolver servidores fora do Brasil, a transferência internacional observa os Arts. 33 a 36 da LGPD e a Resolução CD/ANPD nº 19/2024 (cláusulas-padrão contratuais e garantias equivalentes de proteção).
                </Body>

                <SectionHeading>6. Prazos de Retenção e Eliminação (Arts. 15 e 16)</SectionHeading>
                <Body>
                  Os dados são mantidos apenas pelo período necessário ao cumprimento da finalidade declarada: (i) dados de briefing local no navegador: apenas durante a visita; (ii) contatos comerciais enviados: durante a tratativa ou até pedido de eliminação; (iii) logs de acesso (Marco Civil): 6 meses; (iv) registros de consentimento e atendimento ao titular: 5 anos para auditoria da ANPD e defesa legal (Art. 16, I).
                </Body>
              </View>
            )}

            {/* ABA 2: COOKIES & LOGS DE AUDITORIA */}
            {tab === 'cookies' && (
              <View>
                <SectionHeading>1. Bloqueio Técnico Ativo (Script &amp; Cookie Gatekeeper)</SectionHeading>
                <Body>
                  Em conformidade com as orientações da ANPD, o banner de cookies deste site não é meramente visual: nosso gerenciador técnico bloqueia a execução de coletores não essenciais (como Google Analytics / gtag e Pixel do Meta / fbq) antes da autorização explícita e expira automaticamente cookies de categorias desativadas ou revogadas.
                </Body>

                <SectionHeading>2. Registro de Consentimento Ativo (Evidência Auditável — Art. 8º, §2º)</SectionHeading>
                {currentConsent ? (
                  <View
                    style={{
                      backgroundColor: '#11150f',
                      borderWidth: 1,
                      borderColor: '#37422c',
                      borderRadius: 8,
                      padding: 13,
                      marginVertical: 6,
                    }}
                  >
                    <T style={{ fontFamily: MONO, color: C.lime, fontSize: rem(0.73), fontWeight: '700' }}>
                      ID do Consentimento: {currentConsent.consentId}
                    </T>
                    <T style={{ fontFamily: MONO, color: '#c8d2bc', fontSize: rem(0.7), marginTop: 4 }}>
                      Data/Hora: {currentConsent.localDateTime} ({currentConsent.timestamp})
                    </T>
                    <T style={{ fontFamily: MONO, color: '#c8d2bc', fontSize: rem(0.7), marginTop: 2 }}>
                      Versão da Política: {currentConsent.policyVersion} · Ação: {currentConsent.action}
                    </T>
                    <T style={{ fontFamily: MONO, color: '#c8d2bc', fontSize: rem(0.7), marginTop: 2 }}>
                      Categorias: Essenciais=ATIVO | Funcionalidade={currentConsent.categories.functional ? 'ACEITO' : 'BLOQUEADO'} | Análise={currentConsent.categories.analytics ? 'ACEITO' : 'BLOQUEADO'} | Marketing={currentConsent.categories.marketing ? 'ACEITO' : 'BLOQUEADO'}
                    </T>
                    <T style={{ fontFamily: MONO, color: '#9aa68c', fontSize: rem(0.67), marginTop: 2 }}>
                      Evidência de Conexão: {currentConsent.ipEvidence}
                    </T>
                  </View>
                ) : (
                  <Body>
                    Nenhum consentimento registrado ainda nesta sessão. Apenas os cookies estritamente necessários estão ativos (todos os cookies opcionais estão bloqueados).
                  </Body>
                )}

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginVertical: 10 }}>
                  <Pressable
                    testID="export-consent-json"
                    role="button"
                    onPress={() => {
                      exportConsentAuditJson();
                      toast('Comprovante e log de consentimento LGPD exportado (.json).');
                    }}
                    style={{
                      backgroundColor: '#252d1f',
                      borderWidth: 1,
                      borderColor: C.lime,
                      paddingVertical: 9,
                      paddingHorizontal: 14,
                      borderRadius: 6,
                    }}
                  >
                    <T style={{ color: C.lime, fontSize: rem(0.75), fontWeight: '700' }}>
                      Baixar Comprovante / Log de Auditoria (JSON)
                    </T>
                  </Pressable>

                  <Pressable
                    role="button"
                    onPress={() => {
                      onClose();
                      onOpenCookiePrefs();
                    }}
                    style={{
                      backgroundColor: '#22281d',
                      borderWidth: 1,
                      borderColor: '#616d52',
                      paddingVertical: 9,
                      paddingHorizontal: 14,
                      borderRadius: 6,
                    }}
                  >
                    <T style={{ color: C.paper, fontSize: rem(0.75), fontWeight: '600' }}>
                      Personalizar Categorias de Cookies
                    </T>
                  </Pressable>

                  {currentConsent && (
                    <Pressable
                      testID="revoke-consent-btn"
                      role="button"
                      onPress={() => {
                        onRevokeConsent();
                        setCurrentConsent(loadCurrentConsent());
                        setAuditLogs(loadConsentAuditLogs());
                      }}
                      style={{
                        backgroundColor: '#2c1918',
                        borderWidth: 1,
                        borderColor: '#9e4742',
                        paddingVertical: 9,
                        paddingHorizontal: 14,
                        borderRadius: 6,
                      }}
                    >
                      <T style={{ color: '#ffb3ae', fontSize: rem(0.75), fontWeight: '700' }}>
                        Revogar Consentimento Agora
                      </T>
                    </Pressable>
                  )}
                </View>

                <SectionHeading>3. Histórico de Eventos de Consentimento ({auditLogs.length})</SectionHeading>
                {auditLogs.slice(0, 5).map((log) => (
                  <View
                    key={log.consentId}
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: '#2a3123',
                      paddingVertical: 7,
                    }}
                  >
                    <T style={{ fontFamily: MONO, color: '#d4dec7', fontSize: rem(0.68) }}>
                      [{log.localDateTime}] {log.consentId} — {log.action} (F:{log.categories.functional ? '1' : '0'} A:{log.categories.analytics ? '1' : '0'} M:{log.categories.marketing ? '1' : '0'})
                    </T>
                  </View>
                ))}
              </View>
            )}

            {/* ABA 3: ROPA, SEGURANÇA & INCIDENTES */}
            {tab === 'ropa' && (
              <View>
                <SectionHeading>1. Registro das Operações de Tratamento — ROPA (Art. 37 da LGPD)</SectionHeading>
                <Body>
                  Mantemos abaixo o inventário transparente das operações de tratamento de dados realizadas nesta aplicação:
                </Body>
                {ROPA_RECORDS.map((r) => (
                  <View
                    key={r.id}
                    style={{
                      backgroundColor: '#131710',
                      borderWidth: 1,
                      borderColor: '#31392a',
                      borderRadius: 7,
                      padding: 12,
                      marginBottom: 8,
                    }}
                  >
                    <T style={{ color: C.lime, fontSize: rem(0.78), fontWeight: '700' }}>
                      {r.id} · {r.activity}
                    </T>
                    <T style={{ color: '#c4ceb7', fontSize: rem(0.73), marginTop: 4 }}>
                      <T style={{ fontWeight: '700' }}>Dados tratados:</T> {r.dataTypes}
                    </T>
                    <T style={{ color: '#c4ceb7', fontSize: rem(0.73), marginTop: 2 }}>
                      <T style={{ fontWeight: '700' }}>Finalidade:</T> {r.purpose}
                    </T>
                    <T style={{ color: '#9ab0ff', fontSize: rem(0.73), marginTop: 2 }}>
                      <T style={{ fontWeight: '700' }}>Base Legal:</T> {r.legalBasis}
                    </T>
                    <T style={{ color: '#a3ad96', fontSize: rem(0.72), marginTop: 2 }}>
                      <T style={{ fontWeight: '700' }}>Retenção:</T> {r.retention} | <T style={{ fontWeight: '700' }}>Segurança:</T> {r.security}
                    </T>
                  </View>
                ))}

                <SectionHeading>2. Segurança da Informação (Art. 46) e Relatório de Impacto — RIPD (Art. 38)</SectionHeading>
                <Body>
                  Adotamos medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas: criptografia em trânsito (HTTPS/TLS), minimização de coleta, processamento client-side no briefing, controle estrito de acesso, backups e avaliação contínua de riscos para elaboração de Relatório de Impacto à Proteção de Dados Pessoais (RIPD) sempre que aplicável.
                </Body>

                <SectionHeading>3. Plano de Resposta e Comunicação de Incidentes (Art. 48 e Resolução CD/ANPD nº 15/2024)</SectionHeading>
                <Body>
                  Na hipótese de incidente de segurança que possa acarretar risco ou dano relevante aos titulares:{'\n'}
                  • Prazo de comunicação à ANPD e aos titulares: até 3 (três) dias úteis contados do conhecimento do incidente (ou prazo em dobro, 6 dias úteis, para agentes de pequeno porte nos termos da Resolução CD/ANPD nº 2/2022 e nº 15/2024).{'\n'}
                  • Conteúdo obrigatório da comunicação: descrição da natureza e categoria dos dados afetados, número estimado de titulares, medidas técnicas e de segurança utilizadas, riscos relacionados ao incidente e medidas de reversão ou mitigação dos efeitos.{'\n'}
                  • Registro interno obrigatório: todos os incidentes de segurança, inclusive aqueles que não ensejarem comunicação externa, são documentados em registro interno de governança pelo prazo mínimo de 5 anos.
                </Body>
              </View>
            )}

            {/* ABA 4: DIREITOS DO TITULAR & CANAL DPO */}
            {tab === 'titular' && (
              <View>
                <SectionHeading>1. Seus Direitos (Arts. 18, 19 e 20 da LGPD) e Prazos Legais</SectionHeading>
                <Body>
                  Você pode exercer gratuitamente, a qualquer momento, os direitos previstos no Art. 18 da LGPD: confirmação da existência de tratamento, acesso, correção, anonimização/bloqueio/eliminação, portabilidade, eliminação de dados tratados com consentimento, informação sobre compartilhamento, informação sobre a possibilidade de não fornecer consentimento e revogação do consentimento, além da revisão de decisões automatizadas (Art. 20).{'\n'}
                  • Prazos de atendimento (Art. 19): formato simplificado imediatamente; declaração clara e completa em até 15 (quinze) dias (ou 30 dias para agentes de pequeno porte, conforme regulamentação da ANPD).
                </Body>

                <SectionHeading>2. Canal Direto de Requisição ao Encarregado / DPO ({LEGAL.dpoEmail})</SectionHeading>
                <Body>
                  Preencha abaixo para gerar seu protocolo formal datado e encaminhar sua requisição diretamente ao Encarregado de Proteção de Dados (DPO):
                </Body>

                <View style={{ backgroundColor: '#12160f', borderWidth: 1, borderColor: '#36402d', borderRadius: 8, padding: 14, marginTop: 4 }}>
                  <T style={{ color: '#c9d3bc', fontSize: rem(0.74), marginBottom: 6 }}>Direito que deseja exercer *</T>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                    {DSAR_RIGHTS.map((r) => {
                      const active = dsarRight === r;
                      return (
                        <Pressable
                          key={r}
                          role="button"
                          onPress={() => setDsarRight(r)}
                          style={{
                            paddingVertical: 6,
                            paddingHorizontal: 10,
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: active ? C.lime : '#394230',
                            backgroundColor: active ? '#252f1c' : '#191f15',
                          }}
                        >
                          <T style={{ color: active ? C.lime : '#b7c1aa', fontSize: rem(0.68) }}>{r}</T>
                        </Pressable>
                      );
                    })}
                  </View>

                  <View style={{ flexDirection: bp.sm ? 'column' : 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <T style={{ color: '#c9d3bc', fontSize: rem(0.73), marginBottom: 4 }}>Seu nome completo *</T>
                      <TextInput
                        testID="dsar-name"
                        value={dsarName}
                        onChangeText={setDsarName}
                        placeholder="Nome do titular"
                        placeholderTextColor="#6d7762"
                        style={{
                          backgroundColor: '#1b2117',
                          borderWidth: 1,
                          borderColor: '#3d4733',
                          borderRadius: 5,
                          paddingVertical: 9,
                          paddingHorizontal: 11,
                          color: C.paper,
                          fontFamily: FONT,
                          fontSize: rem(0.78),
                        }}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <T style={{ color: '#c9d3bc', fontSize: rem(0.73), marginBottom: 4 }}>Seu e-mail para resposta *</T>
                      <TextInput
                        testID="dsar-email"
                        value={dsarEmail}
                        onChangeText={setDsarEmail}
                        placeholder="voce@exemplo.com.br"
                        placeholderTextColor="#6d7762"
                        style={{
                          backgroundColor: '#1b2117',
                          borderWidth: 1,
                          borderColor: '#3d4733',
                          borderRadius: 5,
                          paddingVertical: 9,
                          paddingHorizontal: 11,
                          color: C.paper,
                          fontFamily: FONT,
                          fontSize: rem(0.78),
                        }}
                      />
                    </View>
                  </View>

                  <T style={{ color: '#c9d3bc', fontSize: rem(0.73), marginTop: 10, marginBottom: 4 }}>
                    Detalhes adicionais da solicitação (opcional)
                  </T>
                  <TextInput
                    testID="dsar-details"
                    value={dsarDetails}
                    onChangeText={setDsarDetails}
                    multiline
                    placeholder="Descreva sua solicitação ao Encarregado (DPO)..."
                    placeholderTextColor="#6d7762"
                    style={{
                      backgroundColor: '#1b2117',
                      borderWidth: 1,
                      borderColor: '#3d4733',
                      borderRadius: 5,
                      paddingVertical: 9,
                      paddingHorizontal: 11,
                      color: C.paper,
                      fontFamily: FONT,
                      fontSize: rem(0.78),
                      minHeight: 60,
                    }}
                  />

                  {/* Checkbox NÃO pré-marcado */}
                  <Pressable
                    testID="dsar-consent-checkbox"
                    role="checkbox"
                    aria-checked={dsarConsent}
                    onPress={() => setDsarConsent((v) => !v)}
                    style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 12 }}
                  >
                    <View
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        borderWidth: 1.5,
                        borderColor: dsarConsent ? C.lime : '#79856a',
                        backgroundColor: dsarConsent ? C.lime : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 2,
                      }}
                    >
                      {dsarConsent && <T style={{ color: C.ink, fontSize: 12, fontWeight: '900', lineHeight: 14 }}>✓</T>}
                    </View>
                    <T style={{ color: '#c2ccb5', fontSize: rem(0.73), lineHeight: rem(0.73) * 1.5, flex: 1 }}>
                      Autorizo o tratamento do meu nome e e-mail exclusivamente para registro, verificação de identidade e atendimento desta requisição de titular (Art. 7º, II e Art. 18 da LGPD). *
                    </T>
                  </Pressable>

                  {!!dsarError && (
                    <T testID="dsar-error" role="alert" style={{ color: '#ff8e88', fontSize: rem(0.74), marginTop: 8 }}>
                      {dsarError}
                    </T>
                  )}

                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
                    <Button
                      label="Gerar Protocolo de Requisição (LGPD)"
                      testID="dsar-submit"
                      onPress={submitDsar}
                      style={{ minHeight: 40, paddingVertical: 10, paddingHorizontal: 16 }}
                      textStyle={{ fontSize: rem(0.75) }}
                    />
                  </View>

                  {dsarProtocol && (
                    <View
                      testID="dsar-protocol-box"
                      style={{
                        marginTop: 12,
                        backgroundColor: '#1d2717',
                        borderWidth: 1,
                        borderColor: C.lime,
                        borderRadius: 6,
                        padding: 12,
                      }}
                    >
                      <T style={{ fontFamily: MONO, color: C.lime, fontSize: rem(0.75), fontWeight: '700' }}>
                        Protocolo Registrado: {dsarProtocol.protocol}
                      </T>
                      <T style={{ color: '#d4dec7', fontSize: rem(0.72), marginTop: 4 }}>
                        Data/Hora: {dsarProtocol.timestamp} · Direito: {dsarProtocol.rightType}
                      </T>
                      <T style={{ color: '#a8b599', fontSize: rem(0.7), marginTop: 2 }}>
                        {dsarProtocol.status}
                      </T>
                      <Pressable
                        role="link"
                        onPress={() => {
                          const subject = encodeURIComponent(`[LGPD ${dsarProtocol.protocol}] ${dsarProtocol.rightType}`);
                          const body = encodeURIComponent(
                            `Protocolo: ${dsarProtocol.protocol}\nData/Hora: ${dsarProtocol.timestamp}\nTitular: ${dsarProtocol.name} (${dsarProtocol.email})\nDireito (Art. 18 LGPD): ${dsarProtocol.rightType}\nDetalhes: ${dsarProtocol.details || 'N/A'}`,
                          );
                          openExternal(`mailto:${LEGAL.dpoEmail}?subject=${subject}&body=${body}`);
                        }}
                        style={{ marginTop: 8, alignSelf: 'flex-start', borderBottomWidth: 1, borderBottomColor: C.lime, paddingBottom: 2 }}
                      >
                        <T style={{ color: C.lime, fontSize: rem(0.74), fontWeight: '700' }}>
                          Enviar protocolo por e-mail ao DPO ({LEGAL.dpoEmail})
                        </T>
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* ABA 5: TERMOS DE USO & JURISDIÇÃO */}
            {tab === 'termos' && (
              <View>
                <SectionHeading>1. Aceitação, Objeto e Jurisdição</SectionHeading>
                <Body>
                  Ao acessar o site institucional da {LEGAL.brandName} ({LEGAL.legalName}), o usuário concorda com estes Termos de Uso, regidos pelas leis da República Federativa do Brasil, em especial o Marco Civil da Internet (Lei nº 12.965/2014), a Lei Geral de Proteção de Dados (Lei nº 13.709/2018) e, quando aplicável, o Código de Defesa do Consumidor (Lei nº 8.078/1990).
                </Body>

                <SectionHeading>2. Propriedade Intelectual (Leis nº 9.610/1998 e nº 9.279/1996)</SectionHeading>
                <Body>
                  A marca &lt;Code&gt; Labs, o logotipo, a identidade visual, os textos, os componentes visuais e o código-fonte deste site são protegidos pela legislação de direitos autorais e propriedade industrial. É proibida qualquer reprodução, cópia, engenharia reversa ou utilização comercial não autorizada por escrito.
                </Body>

                <SectionHeading>3. Caráter Ilustrativo e Não Vinculação de Proposta Automática</SectionHeading>
                <Body>
                  As telas do ambiente demonstrativo de CRM exibidas na página contêm dados inteiramente fictícios para fins de demonstração de design e usabilidade. O preenchimento do simulador de briefing não gera obrigação contratual automática nem garante preço ou prazo sem análise técnica e emissão de proposta comercial formal assinada pelas partes.
                </Body>

                <SectionHeading>4. Responsabilidades e Foro Competente</SectionHeading>
                <Body>
                  A Code Labs adota boas práticas de segurança e disponibilidade, não se responsabilizando por indisponibilidades decorrentes de força maior, falhas de conexão do usuário ou serviços de terceiros. Fica eleito o foro da comarca de {LEGAL.forumCityState} para dirimir eventuais controvérsias, ressalvado o foro do domicílio do consumidor quando aplicável o CDC.
                </Body>
              </View>
            )}
          </ScrollView>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <T style={{ color: '#838f74', fontSize: rem(0.68) }}>
              DPO / Privacidade: {LEGAL.dpoEmail}
            </T>
            <Button label="Entendi" testID="privacy-close" onPress={onClose} style={{ minHeight: 42, paddingVertical: 10, paddingHorizontal: 22 }} />
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
        zIndex: 10000,
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
