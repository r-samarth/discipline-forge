// ==========================================
// DisciplineForge — Main Entry
// App initialization, routing, and orchestration
// ==========================================

import './style.css';
import { subscribeToAuthChanges } from './src/auth.js';
import { renderLoginPage } from './src/pages/loginPage.js';
import { renderDashboardPage } from './src/pages/dashboardPage.js';
import { renderHistoryPage } from './src/pages/historyPage.js';

let currentPage = 'dashboard';
let isInitialized = false;

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
        renderLoginPage(() => {
          navigateTo('dashboard');
        });
      }
    } else {
      // Handle subsequent auth changes (e.g. logout)
      if (!user) {
        renderLoginPage(() => {
          navigateTo('dashboard');
        });
      }
    }
  });
}

function navigateTo(page) {
  currentPage = page;

  const onLogout = () => {
    renderLoginPage(() => {
      navigateTo('dashboard');
    });
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
