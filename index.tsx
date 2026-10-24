import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import App from './App';
import { captureAttribution } from './lib/attribution';

// Register GSAP plugins globally once on application initialization
gsap.registerPlugin(ScrollTrigger);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// The private CRM lives at /crm and is loaded on demand, so public visitors never download it.
const isCrm = window.location.pathname === '/crm' || window.location.pathname.startsWith('/crm/');

if (isCrm) {
  import('./crm/CRMApp').then(({ default: CRMApp }) => {
    root.render(
      <React.StrictMode>
        <CRMApp />
      </React.StrictMode>
    );
  });
} else {
  captureAttribution();
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>
  );
}
