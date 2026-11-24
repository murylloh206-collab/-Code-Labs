// Converte uma string CSS inline ("color: red; font-size: 12px") em objeto de estilo do React.
const cache = new Map<string, Record<string, string>>();

function key(prop: string): string {
  if (prop.startsWith('--')) return prop; // variáveis CSS ficam como estão
  const p = prop.startsWith('-') ? prop.slice(1) : prop;
  const k = p.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return prop.startsWith('-') ? k.charAt(0).toUpperCase() + k.slice(1) : k;
}

export function S(str?: string | null): Record<string, string> | undefined {
  if (!str) return undefined;
  const hit = cache.get(str);
  if (hit) return hit;
  const out: Record<string, string> = {};
  for (const decl of str.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const val = decl.slice(i + 1).trim();
    if (prop && val) out[key(prop.toLowerCase().startsWith('--') ? prop : prop.toLowerCase())] = val;
  }
  if (cache.size > 2000) cache.clear();
  cache.set(str, out);
  return out;
}
