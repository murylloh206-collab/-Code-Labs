/**
 * Configuração Central de Conformidade Jurídica e Governança LGPD (Lei nº 13.709/2018),
 * Marco Civil da Internet (Lei nº 12.965/2014), CDC (Lei nº 8.078/1990) e Resoluções da ANPD.
 *
 * IMPORTANTE: Atualize os dados societários e de contato oficiais abaixo antes do lançamento comercial.
 */
export const LEGAL = {
  brandName: 'Code Labs',
  legalName: 'Code Labs Estúdio de Tecnologia e Desenvolvimento Digital (Preenchendo Razão Social)',
  cnpj: 'Em formalização / Preencher CNPJ oficial antes do faturamento',
  address: 'Brasil — Atendimento Digital Nacional (Preencher endereço fiscal completo)',
  dpoName: 'Encarregado de Proteção de Dados (DPO) — Code Labs',
  dpoRole: 'Encarregado pelo Tratamento de Dados Pessoais (Art. 41 da LGPD e Resolução CD/ANPD nº 18/2024)',
  dpoEmail: 'privacidade@codelabs.com.br',
  dpoAppointmentNote: 'Designado por ato formal interno para atendimento a titulares e comunicação com a ANPD.',
  forumCityState: 'Capital do Estado da sede da empresa (Brasil)',
  policyVersion: '2.0.0',
  lastUpdated: '22/11/2026',
} as const;

export type LegalTab = 'privacidade' | 'cookies' | 'ropa' | 'titular' | 'termos';

export type RopaEntry = {
  id: string;
  activity: string;
  dataTypes: string;
  purpose: string;
  legalBasis: string;
  retention: string;
  sharing: string;
  security: string;
};

/**
 * ROPA — Registro das Operações de Tratamento de Dados Pessoais (Art. 37 da LGPD).
 */
export const ROPA_RECORDS: RopaEntry[] = [
  {
    id: 'ROPA-01',
    activity: 'Atendimento Comercial e Simulador de Briefing',
    dataTypes: 'Nome, empresa (opcional), tipo de solução desejada e descrição do desafio comercial.',
    purpose: 'Estruturar o escopo preliminar do projeto solicitado pelo titular e viabilizar proposta comercial.',
    legalBasis: 'Consentimento explícito no formulário (Art. 7º, I) e procedimentos preliminares de contrato a pedido do titular (Art. 7º, V).',
    retention: 'Durante a sessão no navegador; quando enviado ao canal comercial, pelo período da negociação ou até solicitação de eliminação.',
    sharing: 'Sem compartilhamento com terceiros para fins de marketing. Uso restrito à equipe de atendimento da Code Labs.',
    security: 'Processamento local em memória, validação de entrada, transmissão sob criptografia TLS/HTTPS e controle de acesso.',
  },
  {
    id: 'ROPA-02',
    activity: 'Gestão e Registro Auditável de Consentimento (Logs LGPD)',
    dataTypes: 'Identificador único do consentimento (UUID), data/hora (ISO 8601), versão da política, categorias aceitas/recusadas, User-Agent e evidência de IP/conexão.',
    purpose: 'Comprovar a manifestação livre, informada e inequívoca do titular para auditoria e fiscalização da ANPD (Art. 8º, §2º).',
    legalBasis: 'Cumprimento de obrigação legal ou regulatória pelo controlador (Art. 7º, II) e exercício regular de direitos (Art. 7º, VI).',
    retention: '5 (cinco) anos a contar do registro ou da revogação, para fins de comprovação legal.',
    sharing: 'Apenas mediante requisição formal da Autoridade Nacional de Proteção de Dados (ANPD) ou ordem judicial.',
    security: 'Registro estruturado com hash de integridade e exportação transparente de comprovante JSON ao titular.',
  },
  {
    id: 'ROPA-03',
    activity: 'Cookies Estritamente Necessários e Logs de Segurança',
    dataTypes: 'Estado técnico da sessão, preferência de redução de movimento, endereço IP e data/hora nos logs do servidor web.',
    purpose: 'Garantir o funcionamento seguro da aplicação, prevenção a fraudes/ataques (DDoS) e cumprimento do Marco Civil da Internet.',
    legalBasis: 'Legítimo interesse do controlador para segurança e funcionamento técnico (Art. 7º, IX) e obrigação legal (Art. 15 da Lei nº 12.965/2014).',
    retention: 'Cookies essenciais durante a vigência da escolha; logs de acesso de aplicação por 6 (seis) meses (Marco Civil).',
    sharing: 'Provedor de infraestrutura/hospedagem em nuvem sob contrato de operador (Art. 39 da LGPD).',
    security: 'Isolamento de ambiente, firewall de aplicação, HTTPS obrigatório e minimização de dados.',
  },
  {
    id: 'ROPA-04',
    activity: 'Cookies Opcionais (Funcionalidade, Análise e Publicidade)',
    dataTypes: 'Preferências de navegação, métricas agregadas de audiência (ex.: Google Analytics) e identificadores de campanhas (ex.: Meta Pixel).',
    purpose: 'Medir desempenho de páginas, lembrar preferências opcionais e avaliar eficácia de comunicação institucional.',
    legalBasis: 'Consentimento específico, granular e destacado do titular (Art. 7º, I da LGPD). Bloqueados por padrão.',
    retention: 'Até 12 meses ou imediatamente eliminados no ato de recusa ou revogação do consentimento pelo titular.',
    sharing: 'Plataformas analíticas/publicitárias estritamente quando autorizadas pelo titular via banner granular.',
    security: 'Bloqueador técnico ativo (Script Gatekeeper) que impede execução e limpa cookies caso não haja consentimento ativo.',
  },
  {
    id: 'ROPA-05',
    activity: 'Canal de Atendimento aos Direitos do Titular (DSAR / DPO)',
    dataTypes: 'Nome do titular, e-mail de contato, tipo de direito exercido (Art. 18) e descrição da solicitação.',
    purpose: 'Atender requisições de confirmação, acesso, correção, eliminação, portabilidade e revogação de consentimento.',
    legalBasis: 'Cumprimento de obrigação legal (Art. 7º, II c/c Arts. 18 e 19 da LGPD).',
    retention: '5 (cinco) anos para comprovação do atendimento tempestivo perante a ANPD.',
    sharing: 'Restrito ao Encarregado pelo Tratamento de Dados (DPO) e suporte jurídico/técnico interno.',
    security: 'Protocolo individualizado com carimbo de tempo, verificação de identidade do solicitante e canal dedicado.',
  },
];
