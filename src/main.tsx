
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Use a double requestAnimationFrame to ensure proper WebView rendering
// This helps with iOS WebView layout issues, especially with Dynamic Island
const initApp = () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      createRoot(document.getElementById("root")!).render(<App />);
    });
  });
};

initApp();
