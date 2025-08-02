// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// The main entry point now ONLY renders the application.
// No seeding, no database deletion. Clean and simple.
ReactDOM.createRoot(document.getElementById('root')!).render(
  // By removing StrictMode, we prevent the useEffect duplication bug in development.
  <App />
);