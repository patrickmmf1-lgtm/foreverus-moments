import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";
import { checkAndClearOldVersion } from "./utils/clearOldCache";

// Verificar versão e limpar cache antigo se necessário
checkAndClearOldVersion().then((wasCleared) => {
  if (wasCleared) {
    console.log("Cache limpo - App atualizado para PraSempre v2.0");
  }
});

// Register Service Worker with auto-update
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Forçar atualização imediata quando houver nova versão
    updateSW(true);
  },
  onOfflineReady() {
    console.log("App pronto para uso offline");
  },
});

createRoot(document.getElementById("root")!).render(<App />);
