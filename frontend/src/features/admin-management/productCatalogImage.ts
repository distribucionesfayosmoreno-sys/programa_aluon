type ImageResizeOptions = {
  maxWidth?: number;
  maxHeight?: number;
  mimeType?: 'image/webp' | 'image/jpeg' | 'image/png';
  quality?: number;
};

const defaultResizeOptions: Required<ImageResizeOptions> = {
  maxWidth: 1280,
  maxHeight: 960,
  mimeType: 'image/webp',
  quality: 0.82,
};

const loadImage = async (source: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('No se pudo cargar la imagen'));
    image.src = source;
  });

const clampToFit = (width: number, height: number, maxWidth: number, maxHeight: number) => {
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
};

export const readImageAsDataUrl = async (file: File, options: ImageResizeOptions = {}): Promise<string> => {
  const resizeOptions = { ...defaultResizeOptions, ...options };
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const { width, height } = clampToFit(
      image.naturalWidth || image.width,
      image.naturalHeight || image.height,
      resizeOptions.maxWidth,
      resizeOptions.maxHeight,
    );

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('No se pudo procesar la imagen');
    }

    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL(resizeOptions.mimeType, resizeOptions.quality);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};
