import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Register Service Worker for installable Mobile/Desktop PWA and offline support
let refreshingSw = false;
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshingSw) return;
    refreshingSw = true;
    window.location.reload();
  });
}

const updateSW = registerSW({
  immediate: true,
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent('rt-pwa-offline-ready'));
  },
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent('rt-pwa-update-available'));
    void updateSW(true);
  },
});

createRoot(document.getElementById('root')!).render(<App />);
