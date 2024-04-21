import React from 'react';
import ReactDOM from 'react-dom/client';
import Page from './page';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Page />
    </React.StrictMode>
  );
}
