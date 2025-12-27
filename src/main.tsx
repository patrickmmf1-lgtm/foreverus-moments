import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

// Register Service Worker (required for installability on many browsers)
registerSW({
  immediate: true,
  onNeedRefresh() {
    // Optional: could show a toast, but keep minimal.
  },
  onOfflineReady() {
    // Optional
  },
});

createRoot(document.getElementById("root")!).render(<App />);
