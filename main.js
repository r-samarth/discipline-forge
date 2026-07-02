// ==========================================
// DisciplineForge — Main Entry
// App initialization, routing, and orchestration
// ==========================================

import './style.css';
import { isLoggedIn } from './src/auth.js';
import { renderLoginPage } from './src/pages/loginPage.js';
import { renderDashboardPage } from './src/pages/dashboardPage.js';
import { renderHistoryPage } from './src/pages/historyPage.js';

let currentPage = 'dashboard';

function init() {
  if (isLoggedIn()) {
    navigateTo(currentPage);
  } else {
    renderLoginPage(() => {
      navigateTo('dashboard');
    });
  }
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

  setTimeout(() => {
    switch (page) {
      case 'dashboard':
        renderDashboardPage(onLogout, onNavigate);
        break;
      case 'history':
        renderHistoryPage(onLogout, onNavigate);
        break;
      default:
        renderDashboardPage(onLogout, onNavigate);
    }

    app.classList.remove('page-exit');
    app.classList.add('page-enter');
    setTimeout(() => app.classList.remove('page-enter'), 400);
  }, 150);
}

// Initialize app
document.addEventListener('DOMContentLoaded', init);
init();
