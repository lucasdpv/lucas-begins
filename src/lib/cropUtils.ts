/**
 * Helper para transformar as coordenadas do crop em um Blob de imagem
 */
export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  flip = { horizontal: false, vertical: false }
): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  // Definir tamanho do canvas baseado no corte
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Desenhar a imagem cortada
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(blob);
    }, 'image/webp', 0.95);
  });
};

export const getProxiedUrl = (url: string): string => {
  if (!url) return url;
  if (url.startsWith('https://firebasestorage.googleapis.com')) {
    return url.replace('https://firebasestorage.googleapis.com', '/firebase-storage');
  }
  return url;
};

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    
    const proxiedUrl = getProxiedUrl(url);
    
    // Add cache-buster to prevent browser CORS cache issues with already loaded images
    if (proxiedUrl.startsWith('http') || proxiedUrl.startsWith('/firebase-storage')) {
      try {
        const base = proxiedUrl.startsWith('/') ? window.location.origin : undefined;
        const urlObj = new URL(proxiedUrl, base);
        urlObj.searchParams.set('nocache', Date.now().toString());
        image.src = urlObj.toString();
      } catch {
        image.src = proxiedUrl;
      }
    } else {
      image.src = proxiedUrl;
    }
  });
