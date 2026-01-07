export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB - permite imagens de alta qualidade
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateImage = (file: File): ImageValidationResult => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Tipo de arquivo não permitido. Use JPG, PNG ou WebP.'
    };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `Arquivo muito grande. Máximo ${MAX_FILE_SIZE / 1024 / 1024}MB.`
    };
  }
  
  const fileName = file.name;
  if (!/^[a-zA-Z0-9._-]+$/.test(fileName)) {
    return {
      isValid: false,
      error: 'Nome do arquivo contém caracteres inválidos.'
    };
  }
  
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
