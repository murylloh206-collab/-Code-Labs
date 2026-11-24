// Utilitários de cor do Estúdio <Code> Labs.

export type RGB = [number, number, number];

export function hexToRgb(hex: string): RGB {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16) || 0;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex([r, g, b]: RGB): string {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

/** Mistura a cor `a` com `b`. t = 0 → a, t = 1 → b. */
export function mix(a: string, b: string, t: number): string {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  return rgbToHex([x[0] + (y[0] - x[0]) * t, x[1] + (y[1] - x[1]) * t, x[2] + (y[2] - x[2]) * t]);
}

export function luminance(hex: string): number {
  const c = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Cor de texto legível sobre o fundo informado. */
export function onColor(bg: string): string {
  return contrast(bg, '#ffffff') >= contrast(bg, '#111114') ? '#ffffff' : '#111114';
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return rgbToHex([f(0) * 255, f(8) * 255, f(4) * 255]);
}

export function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s * 100, l * 100];
}

/** Cor complementar suave (gira o matiz), usada quando o cliente escolhe uma cor só. */
export function companion(hex: string): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex((h + 40) % 360, Math.min(90, s + 5), Math.max(35, Math.min(60, l)));
}

/** Escurece/clareia a cor até ter contraste mínimo com o fundo (para texto/ícones coloridos). */
export function readableOn(color: string, bg: string, min = 3.2): string {
  let c = color;
  const target = luminance(bg) > 0.4 ? '#000000' : '#ffffff';
  for (let i = 0; i < 12 && contrast(c, bg) < min; i++) c = mix(c, target, 0.12);
  return c;
}

/**
 * Lê as cores principais de uma imagem (logo).
 * Agrupa os pixels por tom, ignora fundo branco/preto e transparência e devolve até `n` cores marcantes.
 */
export function extractPalette(dataUrl: string, n = 3): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = 72;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve([]);
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      const buckets = new Map<string, { r: number; g: number; b: number; n: number; sat: number }>();
      let neutral: RGB | null = null;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 140) continue;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const sat = max === 0 ? 0 : (max - min) / max;
        if (sat < 0.18 || max < 40 || (min > 225 && sat < 0.1)) {
          if (!neutral && max < 60) neutral = [r, g, b];
          continue;
        }
        const key = `${r >> 5}-${g >> 5}-${b >> 5}`;
        const e = buckets.get(key) || { r: 0, g: 0, b: 0, n: 0, sat: 0 };
        e.r += r;
        e.g += g;
        e.b += b;
        e.n += 1;
        e.sat += sat;
        buckets.set(key, e);
      }
      const ranked = [...buckets.values()]
        .map((e) => ({ hex: rgbToHex([e.r / e.n, e.g / e.n, e.b / e.n]), score: e.n * (0.5 + e.sat / e.n) }))
        .sort((a, b) => b.score - a.score);
      const out: string[] = [];
      for (const c of ranked) {
        const rgb = hexToRgb(c.hex);
        const far = out.every((o) => {
          const q = hexToRgb(o);
          return Math.hypot(rgb[0] - q[0], rgb[1] - q[1], rgb[2] - q[2]) > 70;
        });
        if (far) out.push(c.hex);
        if (out.length >= n) break;
      }
      if (!out.length && neutral) out.push(rgbToHex(neutral));
      resolve(out);
    };
    img.onerror = () => resolve([]);
    img.src = dataUrl;
  });
}
