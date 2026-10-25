import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { SoundProvider } from './hooks/useSound';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SoundProvider>
      <App />
    </SoundProvider>
  </React.StrictMode>
);