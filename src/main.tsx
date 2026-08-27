
window.addEventListener('error', e => {
  console.error("GLOBAL ERROR:", e.error);
  fetch('/__log_error', { method: 'POST', body: e.error ? e.error.stack : e.message });
});
window.addEventListener('unhandledrejection', e => {
  console.error("UNHANDLED REJECTION:", e.reason);
  fetch('/__log_error', { method: 'POST', body: e.reason ? e.reason.stack : e.reason });
});
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
