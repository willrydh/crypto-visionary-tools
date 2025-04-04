
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Use createRoot API instead of ReactDOM.render
const root = createRoot(document.getElementById("root")!);

// Add a small delay before rendering to help with WebView initialization
setTimeout(() => {
  root.render(<App />);
}, 10);
