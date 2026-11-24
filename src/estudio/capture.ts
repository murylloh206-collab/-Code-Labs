import { toBlob } from 'html-to-image';

/** Tira uma "foto" da primeira tela do site montado (o que aparece no aparelho escolhido). */
export async function captureFrame(frame: HTMLIFrameElement, width: number, height: number): Promise<Blob | null> {
  const doc = frame.contentDocument;
  if (!doc) return null;
  const node = doc.body;
  // Congela as animações: sem isso, a imagem sai com os elementos ainda invisíveis.
  const freeze = doc.createElement('style');
  freeze.textContent = '*,*:before,*:after{animation:none !important;transition:none !important}';
  doc.head.appendChild(freeze);
  const top = frame.contentWindow?.scrollY || 0;
  frame.contentWindow?.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 120));
  const opts = {
    width,
    height,
    pixelRatio: Math.min(2, 1600 / width + 0.5),
    backgroundColor: getComputedStyle(node).backgroundColor || '#ffffff',
    style: { margin: '0', overflow: 'hidden', height: height + 'px' },
    cacheBust: true,
  };
  try {
    return await toBlob(node, opts);
  } catch {
    try {
      return await toBlob(node, { ...opts, skipFonts: true });
    } catch {
      return null;
    }
  } finally {
    freeze.remove();
    frame.contentWindow?.scrollTo(0, top);
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function canShareFile(blob: Blob | null): boolean {
  if (!blob || typeof navigator === 'undefined' || !navigator.canShare) return false;
  try {
    return navigator.canShare({ files: [new File([blob], 'meu-site.png', { type: 'image/png' })] });
  } catch {
    return false;
  }
}

export async function shareFile(blob: Blob, text: string): Promise<boolean> {
  try {
    await navigator.share({ files: [new File([blob], 'meu-site.png', { type: 'image/png' })], text });
    return true;
  } catch {
    return false;
  }
}

export const waLink = (phone: string, text: string) => `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

/** Reduz uma imagem enviada pelo cliente para não pesar no navegador. */
export function fileToDataUrl(file: File, max: number, type: 'image/png' | 'image/jpeg'): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('imagem inválida'));
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        const ctx = c.getContext('2d');
        if (!ctx) return resolve(String(reader.result));
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL(type, 0.85));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
