import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import App from './App';
import { captureAttribution } from './lib/attribution';
import { findServicePage } from './lib/servicePages';
import { ServicePage } from './components/ServicePage';
import { PrivacyPage } from './components/PrivacyPage';
import { TermsPage } from './components/TermsPage';
import { NotFoundPage } from './components/NotFoundPage';

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
} else if (window.location.pathname.replace(/\/+$/, '') === '/privacy-policy') {
  root.render(<PrivacyPage />);
} else if (window.location.pathname.replace(/\/+$/, '') === '/terms-and-conditions') {
  root.render(<TermsPage />);
} else if (findServicePage(window.location.pathname)) {
  // Service pages are pre-rendered to static HTML at build time; this takes over in the browser.
  captureAttribution();
  root.render(<ServicePage page={findServicePage(window.location.pathname)!} />);
} else if (!['', '/index.html'].includes(window.location.pathname.replace(/\/+$/, ''))) {
  // Any address that is not the home page, a service page, the privacy page or the CRM.
  root.render(<NotFoundPage />);
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
