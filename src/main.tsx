import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Register Service Worker for installable Mobile/Desktop PWA and offline support
registerSW({
  immediate: true,
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent('rt-pwa-offline-ready'));
  },
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent('rt-pwa-update-available'));
  },
});

createRoot(document.getElementById('root')!).render(<App />);
