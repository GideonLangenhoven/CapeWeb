import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AppWithProvider from './App'; // Correctly import the wrapped version

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AppWithProvider />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);