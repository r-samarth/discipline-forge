// ==========================================
// DisciplineForge — Main Entry
// App initialization, routing, and orchestration
// ==========================================

import './style.css';
import { inject } from "@vercel/analytics";
inject();

import { injectSpeedInsights } from "@vercel/speed-insights";


injectSpeedInsights();
import { subscribeToAuthChanges } from './src/auth.js';
import { renderLoginPage } from './src/pages/loginPage.js';
import { renderDashboardPage } from './src/pages/dashboardPage.js';
import { renderHistoryPage } from './src/pages/historyPage.js';

import { renderLandingPage } from './src/pages/landingPage.js';

let currentPage = 'dashboard';
let isInitialized = false;

function showLanding() {
  renderLandingPage(() => {
    renderLoginPage(
      () => navigateTo('dashboard'),
      showLanding
    );
  });
}

function init() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div style="display: flex; height: 100vh; justify-content: center; align-items: center; color: white;">
      <h2>Loading DisciplineForge...</h2>
    </div>
  `;

  subscribeToAuthChanges((user) => {
    if (!isInitialized) {
      isInitialized = true;
      if (user) {
        navigateTo(currentPage);
      } else {
        showLanding();
      }
    } else {
      // Handle subsequent auth changes (e.g. logout)
      if (!user) {
        showLanding();
      }
    }
  });
}

function navigateTo(page) {
  currentPage = page;

  const onLogout = () => {
    showLanding();
  };

  const onNavigate = (p) => navigateTo(p);

  // Add page transition
  const app = document.getElementById('app');
  app.classList.add('page-exit');

  setTimeout(async () => {
    switch (page) {
      case 'dashboard':
        await renderDashboardPage(onLogout, onNavigate);
        break;
      case 'history':
        await renderHistoryPage(onLogout, onNavigate);
        break;
      default:
        await renderDashboardPage(onLogout, onNavigate);
    }

    app.classList.remove('page-exit');
    app.classList.add('page-enter');
    setTimeout(() => app.classList.remove('page-enter'), 400);
  }, 150);
}

// Initialize app
document.addEventListener('DOMContentLoaded', init);
