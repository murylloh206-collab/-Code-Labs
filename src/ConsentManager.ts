import { Platform } from 'react-native';
import { LEGAL } from './LegalConfig';

export const CONSENT_STORAGE_KEY = 'codelabs_lgpd_consent_v2';
export const CONSENT_LOGS_KEY = 'codelabs_lgpd_audit_logs_v2';
export const DSAR_LOGS_KEY = 'codelabs_lgpd_dsar_requests_v2';

export type CookieCategories = {
  essential: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentAction =
  | 'accept_all'
  | 'reject_non_essential'
  | 'custom_preferences'
  | 'revoked'
  | 'form_briefing_consent';

export type ConsentAuditRecord = {
  consentId: string;
  timestamp: string;
  localDateTime: string;
  policyVersion: string;
  action: ConsentAction;
  categories: CookieCategories;
  legalBasis: {
    essential: string;
    functional: string;
    analytics: string;
    marketing: string;
  };
  userAgent: string;
  ipEvidence: string;
  context?: string;
};

export type DsarRequestRecord = {
  protocol: string;
  timestamp: string;
  rightType: string;
  name: string;
  email: string;
  details: string;
  status: string;
};

const NON_ESSENTIAL_COOKIES = {
  functional: ['cl_pref_lang', 'cl_pref_theme', 'cl_functional'],
  analytics: ['_ga', '_gid', '_gat', '_ga_codelabs', 'cl_analytics'],
  marketing: ['_fbp', '_fbc', '_gcl_au', 'cl_marketing'],
};

function makeId(prefix = 'CL-LGPD') {
  const rand = Math.random().toString(36).substring(2, 10).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

/**
 * Bloqueio Técnico Real (Script & Cookie Gatekeeper):
 * - Impede que coletores (Google Analytics / Meta Pixel / scripts não essenciais) rodem sem consentimento.
 * - Expira imediatamente cookies não essenciais de categorias recusadas ou revogadas.
 */
export function applyTechnicalCookieBlocking(categories: CookieCategories) {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || typeof document === 'undefined') return;

  const w = window as any;
  w.__CODELABS_LGPD_CONSENT__ = categories;
  w['ga-disable-GA_MEASUREMENT_ID'] = !categories.analytics;

  // Se análise ou marketing não foram consentidos, bloqueia stubs globais (gtag / fbq)
  if (!categories.analytics) {
    w.gtag = function blockedGtag() {
      /* Bloqueado tecnicamente até consentimento explícito (LGPD Art. 7º, I) */
    };
  }
  if (!categories.marketing) {
    w.fbq = function blockedFbq() {
      /* Bloqueado tecnicamente até consentimento explícito (LGPD Art. 7º, I) */
    };
  }

  // Remove/expira cookies de categorias desativadas
  const expireCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
  };

  if (!categories.functional) NON_ESSENTIAL_COOKIES.functional.forEach(expireCookie);
  if (!categories.analytics) NON_ESSENTIAL_COOKIES.analytics.forEach(expireCookie);
  if (!categories.marketing) NON_ESSENTIAL_COOKIES.marketing.forEach(expireCookie);

  // Grava apenas o cookie técnico estritamente necessário com o resumo da decisão
  const summary = `v=${LEGAL.policyVersion}&e=1&f=${categories.functional ? 1 : 0}&a=${categories.analytics ? 1 : 0}&m=${categories.marketing ? 1 : 0}`;
  document.cookie = `codelabs_consent_status=${encodeURIComponent(summary)}; max-age=31536000; path=/; SameSite=Lax`;
}

export function loadCurrentConsent(): ConsentAuditRecord | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentAuditRecord;
    if (parsed && parsed.policyVersion === LEGAL.policyVersion && parsed.categories) {
      applyTechnicalCookieBlocking(parsed.categories);
      return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return null;
}

export function loadConsentAuditLogs(): ConsentAuditRecord[] {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CONSENT_LOGS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

async function resolveIpEvidence(): Promise<string> {
  if (Platform.OS !== 'web' || typeof fetch === 'undefined') {
    return 'Evidência local de dispositivo';
  }
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1800);
    const res = await fetch('https://api.ipify.org?format=json', { signal: ctrl.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (data?.ip) {
        // Mascara o último octeto para minimizar dado mantendo evidência auditável
        const parts = String(data.ip).split('.');
        const masked = parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.*** (hash: ${btoa(data.ip).slice(0, 8)})` : String(data.ip);
        return `IP auditado: ${masked}`;
      }
    }
  } catch {
    // fallback determinístico
  }
  return 'IP registrado no log de conexão HTTPS do servidor (Marco Civil Art. 15) + evidência local';
}

export function recordConsentDecision(
  action: ConsentAction,
  partial: Partial<Omit<CookieCategories, 'essential'>>,
  context?: string,
): ConsentAuditRecord {
  const now = new Date();
  const categories: CookieCategories = {
    essential: true,
    functional: Boolean(partial.functional),
    analytics: Boolean(partial.analytics),
    marketing: Boolean(partial.marketing),
  };

  const record: ConsentAuditRecord = {
    consentId: makeId('CL-LGPD'),
    timestamp: now.toISOString(),
    localDateTime: now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    policyVersion: LEGAL.policyVersion,
    action,
    categories,
    legalBasis: {
      essential: 'Legítimo Interesse / Necessidade Técnica (Art. 7º, IX da LGPD)',
      functional: categories.functional ? 'Consentimento explícito (Art. 7º, I da LGPD)' : 'Bloqueado (Sem consentimento)',
      analytics: categories.analytics ? 'Consentimento explícito (Art. 7º, I da LGPD)' : 'Bloqueado (Sem consentimento)',
      marketing: categories.marketing ? 'Consentimento explícito (Art. 7º, I da LGPD)' : 'Bloqueado (Sem consentimento)',
    },
    userAgent:
      Platform.OS === 'web' && typeof navigator !== 'undefined' ? navigator.userAgent : `ReactNative/${Platform.OS}`,
    ipEvidence: 'Coletando evidência de conexão...',
    context,
  };

  applyTechnicalCookieBlocking(categories);

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      const logs = loadConsentAuditLogs();
      const updatedLogs = [record, ...logs].slice(0, 50);
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
      window.localStorage.setItem(CONSENT_LOGS_KEY, JSON.stringify(updatedLogs));

      // Atualiza evidência de IP assincronamente no registro salvo
      resolveIpEvidence().then((ipEvidence) => {
        try {
          record.ipEvidence = ipEvidence;
          window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
          const currentLogs = loadConsentAuditLogs();
          const patched = currentLogs.map((item) =>
            item.consentId === record.consentId ? { ...item, ipEvidence } : item,
          );
          window.localStorage.setItem(CONSENT_LOGS_KEY, JSON.stringify(patched));
        } catch {
          // ignore
        }
      });
    } catch {
      // ignore
    }
  }

  return record;
}

export function exportConsentAuditJson() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  const current = loadCurrentConsent();
  const logs = loadConsentAuditLogs();
  const payload = {
    controller: LEGAL.legalName,
    brand: LEGAL.brandName,
    dpoContact: LEGAL.dpoEmail,
    policyVersion: LEGAL.policyVersion,
    exportedAt: new Date().toISOString(),
    currentActiveConsent: current,
    auditTrailHistory: logs,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `comprovante-consentimento-lgpd-codelabs.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function recordDsarRequest(
  rightType: string,
  name: string,
  email: string,
  details: string,
): DsarRequestRecord {
  const now = new Date();
  const rec: DsarRequestRecord = {
    protocol: makeId('DSAR'),
    timestamp: now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    rightType,
    name: name.trim(),
    email: email.trim(),
    details: details.trim(),
    status: 'Protocolo gerado — Prazo legal: confirmação imediata / resposta completa em até 15 dias (Art. 19, II da LGPD)',
  };
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(DSAR_LOGS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      window.localStorage.setItem(DSAR_LOGS_KEY, JSON.stringify([rec, ...(Array.isArray(list) ? list : [])]));
    } catch {
      // ignore
    }
  }
  return rec;
}
