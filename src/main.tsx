import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark">
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
