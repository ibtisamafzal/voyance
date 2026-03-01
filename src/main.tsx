import { createRoot } from 'react-dom/client';
import './styles/index.css';

// Load app shell in a separate chunk to shorten critical request chain and reduce initial parse
import('./app/App').then(({ default: App }) => {
  createRoot(document.getElementById('root')!).render(<App />);
});
  