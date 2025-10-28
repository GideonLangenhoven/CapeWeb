import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppWithProvider from './App'; // Correctly import the wrapped version

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Or your router */}
      <AppWithProvider />
    </BrowserRouter>
  </React.StrictMode>
);