// src/main.tsx


import React, { useMemo, useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider, createTheme, CssBaseline, IconButton, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';

// Import core services for initialization/logging
import { db } from './services/db.service';
import './services/nlp.service';
import './services/ml.service';
import './services/ocr.service';
import { encryptionService } from './services/encryption.service';

function getInitialMode() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('themeMode');
    if (saved === 'light' || saved === 'dark') return saved;
    // Default to dark
    return 'dark';
  }
  return 'dark';
}

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>(getInitialMode());

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#00bcd4' },
      secondary: { main: '#7c4dff' },
      error: { main: '#f44336' },
      warning: { main: '#ff9800' },
      info: { main: '#2196f3' },
      success: { main: '#4caf50' },
      background: mode === 'dark'
        ? { default: '#181c24', paper: '#232837' }
        : { default: '#f4f6fa', paper: '#fff' },
      text: mode === 'dark'
        ? { primary: '#fff', secondary: '#b0b8c1' }
        : { primary: '#181c24', secondary: '#4b5563' },
    },
    typography: {
      fontFamily: 'Poppins, Inter, Arial, sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 700 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiButton: { styleOverrides: { root: { borderRadius: 8, fontWeight: 700 } } },
      MuiListItemButton: { styleOverrides: { root: { borderRadius: 8 } } },
    },
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1300 }}>
        <IconButton onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} color="inherit" aria-label="toggle dark mode">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      {children}
    </ThemeProvider>
  );
}


// DEV/DEMO ONLY: Set a default session key so encryption works for seeding and offline
(async () => {
  const password = 'dev-demo-password';
  const salt = new Uint8Array([1,2,3,4,5,6,7,8,9,10,11,12]);
  const key = await encryptionService.deriveKey(password, salt);
  encryptionService.setKey(key);
})();

// The main entry point now renders the application with theme toggle support
ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeWrapper>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </ThemeWrapper>
);

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch((err) => {
      console.error('Service worker registration failed:', err);
    });
  });
}