// ==========================================
// DisciplineForge — Navbar Component
// Top navigation bar with glassmorphism
// ==========================================

import { logout, getCurrentUser } from '../auth.js';

export function renderNavbar(onLogout, onNavigate, activePage = 'dashboard') {
  const user = getCurrentUser();
  const displayName = user ? user.displayName : 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return `
    <nav class="navbar" id="main-navbar">
      <div class="navbar-inner">
        <div class="navbar-brand" id="nav-brand">
          <div class="nav-logo-icon">
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
              <path d="M24 4L6 14V34L24 44L42 34V14L24 4Z" stroke="url(#navGrad)" stroke-width="2.5" fill="none"/>
              <circle cx="24" cy="24" r="6" fill="url(#navGrad)" opacity="0.8"/>
              <circle cx="24" cy="24" r="3" fill="#000000"/>
              <defs>
                <linearGradient id="navGrad" x1="6" y1="4" x2="42" y2="44">
                  <stop offset="0%" stop-color="#9d4edd"/>
                  <stop offset="100%" stop-color="#7b2cbf"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="nav-title">DisciplineForge</span>
        </div>

        <div class="navbar-links">
          <button class="nav-link ${activePage === 'dashboard' ? 'active' : ''}" data-page="dashboard" id="nav-dashboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            Dashboard
          </button>
          <button class="nav-link ${activePage === 'history' ? 'active' : ''}" data-page="history" id="nav-history">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            History
          </button>
          
          <!-- Mobile Only Logout Button -->
          <button class="nav-link mobile-only" id="nav-mobile-logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>

        <div class="navbar-user">
          <div class="user-avatar" id="user-avatar-btn">
            <span>${initial}</span>
          </div>
          <div class="user-dropdown hidden" id="user-dropdown">
            <div class="dropdown-header">
              <span class="dropdown-name">${displayName}</span>
              <span class="dropdown-email">${user ? user.email : ''}</span>
            </div>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item logout-btn" id="nav-logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  `;
}

export function initNavbarEvents(onLogout, onNavigate) {
  // Navigation
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const page = link.dataset.page;
      onNavigate(page);
    });
  });

  // User dropdown
  const avatarBtn = document.getElementById('user-avatar-btn');
  const dropdown = document.getElementById('user-dropdown');

  if (avatarBtn && dropdown) {
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      dropdown.classList.add('hidden');
    });
  }

  // Logout
  const logoutBtn = document.getElementById('nav-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await logout();
      onLogout();
    });
  }

  // Mobile Logout
  const mobileLogoutBtn = document.getElementById('nav-mobile-logout');
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener('click', async () => {
      await logout();
      onLogout();
    });
  }
}
