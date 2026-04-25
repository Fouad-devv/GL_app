import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'

import { ReactKeycloakProvider } from '@react-keycloak/web';
import Keycloak from 'keycloak-js';


const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <BrowserRouter>

      <ReactKeycloakProvider authClient={keycloak} initOptions={{ onLoad: 'check-sso', silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html' }}>
        <App />
      </ReactKeycloakProvider>
      
    </BrowserRouter>
  </StrictMode>,
)
