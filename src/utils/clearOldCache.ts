const APP_VERSION = '2.0.0'; // PraSempre
const VERSION_KEY = 'prasempre_app_version';

export const clearOldCache = async (): Promise<void> => {
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(r => r.unregister()));
    }
    
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
  }
};

export const checkAndClearOldVersion = async (): Promise<boolean> => {
  const storedVersion = localStorage.getItem(VERSION_KEY);
  
  if (storedVersion !== APP_VERSION) {
    await clearOldCache();
    localStorage.setItem(VERSION_KEY, APP_VERSION);
    return true;
  }
  
  return false;
};
