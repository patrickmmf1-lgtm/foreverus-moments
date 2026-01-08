export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateImage = (file: File): ImageValidationResult => {
  // Validar tipo
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Tipo de arquivo não permitido. Use JPG, PNG ou WebP.'
    };
  }
  
  // Validar tamanho
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (MAX_FILE_SIZE / 1024 / 1024).toFixed(0);
    return {
      isValid: false,
      error: `Arquivo muito grande. Máximo ${sizeMB}MB.`
    };
  }
  
  // NÃO validar nome do arquivo - aceitar qualquer nome
  // O sistema vai sanitizar automaticamente no upload
  
  return { isValid: true };
};

export const validateImages = (files: File[]): ImageValidationResult => {
  for (const file of files) {
    const result = validateImage(file);
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true };
};
