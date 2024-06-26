import { createRoot } from 'react-dom/client';
import App from './App';
import 'normalize.css';
import 'virtual:uno.css';
import './index.css';
// import 'mac-scrollbar/dist/mac-scrollbar.css';
const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(<App />);
