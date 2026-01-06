/**
 * Gerencia tokens de sessão únicos por página
 */

export const getOrCreateSessionToken = (pageSlug: string): string => {
  const key = `prasempre_session_${pageSlug}`;
  let token = localStorage.getItem(key);
  
  if (!token) {
    token = `${pageSlug}_${crypto.randomUUID()}_${Date.now()}`;
    localStorage.setItem(key, token);
  }
  
  return token;
};

export const clearSessionToken = (pageSlug: string): void => {
  const key = `prasempre_session_${pageSlug}`;
  localStorage.removeItem(key);
};
