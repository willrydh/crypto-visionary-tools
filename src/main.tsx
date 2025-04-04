
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add double-rendering on load to fix some WebView rendering issues
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    createRoot(document.getElementById("root")!).render(<App />);
  });
});
