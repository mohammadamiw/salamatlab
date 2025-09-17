import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from './contexts/AuthContext-liara';
import App from './App.tsx';
import './index.css';

// Import API config to initialize
import { debugLog, ENV } from './config/api';

// Initialize app
debugLog('Initializing SalamatLab App', {
  environment: ENV.NODE_ENV,
  production: ENV.PROD,
  debug: ENV.DEBUG,
  version: '__APP_VERSION__',
  buildTime: '__BUILD_TIME__'
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <App />
          <Toaster 
            position="top-center" 
            richColors 
            closeButton
            duration={4000}
          />
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </StrictMode>,
);
