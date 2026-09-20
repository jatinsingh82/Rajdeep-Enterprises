import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Externalized Dynamic Canonical & Social Card Domain Sync (Eliminates inline script in HTML)
function syncMetaOrigins(): void {
  try {
    const origin = window.location.origin;
    const canon = document.getElementById('canonical-url') as HTMLLinkElement | null;
    if (canon && origin) {
      canon.href = origin + window.location.pathname;
    }
    const ogUrl = document.getElementById('og-url') as HTMLMetaElement | null;
    if (ogUrl && origin) {
      ogUrl.content = origin + window.location.pathname;
    }
    const ogImg = document.getElementById('og-image') as HTMLMetaElement | null;
    if (ogImg && origin) {
      ogImg.content = origin + '/owner-father.jpg';
    }
    const twImg = document.getElementById('twitter-image') as HTMLMetaElement | null;
    if (twImg && origin) {
      twImg.content = origin + '/owner-father.jpg';
    }
  } catch {
    // Fail silently in environments without standard DOM
  }
}

syncMetaOrigins();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
