import imageCompression from 'browser-image-compression';

/**
 * Сжимает изображение перед отправкой на сервер.
 * Это резко ускоряет загрузку при больших фото с телефона.
 */
export async function compressImage(file: File): Promise<File> {
  // Маленькие файлы не сжимаем
  if (file.size < 600 * 1024) return file;

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.85,
    });
    return compressed instanceof File
      ? compressed
      : new File([compressed], file.name, { type: file.type });
  } catch (err) {
    console.warn('Image compression failed, sending original:', err);
    return file;
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
