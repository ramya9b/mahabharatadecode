import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// i18n must be imported BEFORE App renders so translations are ready
import './i18n/index.ts';

createRoot(document.getElementById("root")!).render(<App />);
