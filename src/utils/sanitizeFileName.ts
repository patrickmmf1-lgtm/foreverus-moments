/**
 * Sanitiza um nome de arquivo removendo acentos e caracteres especiais
 */
export const sanitizeFileName = (fileName: string): string => {
  // Remove acentos
  const normalized = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Remove caracteres especiais, mantém apenas letras, números, pontos e hífens
  return normalized.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
};

/**
 * Gera um nome de arquivo seguro para upload
 */
export const generateSafeFileName = (originalName: string): string => {
  const fileExt = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const baseName = originalName.replace(`.${fileExt}`, '');
  const sanitizedName = sanitizeFileName(baseName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 6);
  return `${sanitizedName}_${timestamp}_${random}.${fileExt}`;
};
