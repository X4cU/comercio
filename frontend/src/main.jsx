import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import { AppRouter } from './router/AppRouter';
import { keycloakService } from './auth/keycloakService';

const renderApp = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </React.StrictMode>
  );
};

keycloakService
  .init()
  .then(() => {
    renderApp();
  })
  .catch((err) => {
    console.error('Failed to initialize Keycloak', err);
    renderApp();
  });
