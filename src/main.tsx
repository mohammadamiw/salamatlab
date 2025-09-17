import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

// PWA: register service worker only in production to avoid dev caching issues
if (import.meta.env.PROD) {
  // dynamic import keeps dev clean
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({ immediate: true });
  });
}
