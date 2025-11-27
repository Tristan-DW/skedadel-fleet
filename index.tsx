

import React from 'react';
import ReactDOM from 'react-dom/client';
// Fix: The original error 'File 'file:///App.tsx' is not a module' was caused by App.tsx having placeholder content. It is now fixed by implementing the App component.
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);