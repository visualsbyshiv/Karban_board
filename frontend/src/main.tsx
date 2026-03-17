import { StrictMode } from 'react';
import {BrowserRouter} from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './Context/authContext';
import ErrorBoundary from './components/ErrorBoundary';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
    </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);