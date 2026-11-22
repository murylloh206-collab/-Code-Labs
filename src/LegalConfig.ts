/**
 * Dados jurídicos e de identificação do controlador (LGPD / Marco Civil / CDC).
 * IMPORTANTE: substitua os campos marcados com "[Preencher ...]" pelos dados reais
 * da sua empresa antes de publicar o site em produção e valide com um advogado.
 */
export const LEGAL = {
  brandName: 'Code Labs',
  legalName: '[Preencher Razão Social / Nome Empresarial da Code Labs]',
  cnpj: '[Preencher CNPJ: 00.000.000/0001-00]',
  address: '[Preencher Endereço completo — Cidade/UF, CEP]',
  dpoName: '[Preencher Nome do Encarregado de Dados / DPO]',
  dpoEmail: '[Preencher e-mail oficial de privacidade, ex.: privacidade@codelabs.com.br]',
  forumCityState: '[Preencher Cidade/UF do Foro competente]',
  lastUpdated: '22/11/2026',
} as const;

export type LegalTab = 'privacidade' | 'cookies' | 'termos';

