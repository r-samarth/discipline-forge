// ==========================================
// DisciplineForge — Landing Page
// Premium, Apple-like landing page for unauthenticated users
// ==========================================

export function renderLandingPage(onNavigateToLogin) {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="landing-page">
      <!-- Floating Navigation -->
      <nav class="landing-nav">
        <div class="landing-nav-inner">
          <div class="nav-brand">
            <div class="nav-logo-icon">
              <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
                <path d="M24 4L6 14V34L24 44L42 34V14L24 4Z" stroke="url(#navGradPurple)" stroke-width="3" fill="none"/>
                <circle cx="24" cy="24" r="6" fill="url(#navGradPurple)" opacity="0.8"/>
                <circle cx="24" cy="24" r="3" fill="#000000"/>
                <defs>
                  <linearGradient id="navGradPurple" x1="6" y1="4" x2="42" y2="44">
                    <stop offset="0%" stop-color="#9d4edd"/>
                    <stop offset="100%" stop-color="#7b2cbf"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span class="nav-title">DisciplineForge</span>
          </div>

          <div class="nav-links desktop-only">
            <a href="#features" class="nav-link">Features</a>
            <a href="#how-it-works" class="nav-link">How It Works</a>
            <a href="https://samarth-r.vercel.app/" target="_blank" rel="noopener noreferrer" class="nav-link">About Sam</a>
          </div>

          <div class="nav-actions">
            <button class="nav-login-btn" id="landing-login-btn">Log In</button>
            <button class="nav-get-started-btn" id="landing-get-started-btn">Get Started</button>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="availability-pill">
            <span class="dot"></span> Available on Web · Mac · iPhone
          </div>
          
          <h1 class="hero-title">
            <span class="text-white">Master Your</span><br />
            <span class="text-gradient">Every Single Day.</span>
          </h1>
          
          <p class="hero-subtitle">
            The professional discipline system that tracks your habits, 
            builds your streaks, and keeps you on track — always.
          </p>

          <div class="hero-cta">
            <button class="btn-primary" id="hero-get-started-btn">Get Started — It's Free</button>
            <button class="btn-secondary" id="hero-signin-btn">Sign In</button>
          </div>
        </div>

        <!-- Dashboard Mockup -->
        <div class="hero-mockup">
          <div class="mockup-window">
            <div class="mockup-header">
              <div class="window-controls">
                <span class="control close"></span>
                <span class="control minimize"></span>
                <span class="control maximize"></span>
              </div>
              <div class="window-title">DisciplineForge — Dashboard</div>
            </div>
            
            <div class="mockup-body">
              <!-- Active Task Mockup -->
              <div class="mockup-active-task">
                <div class="active-label">▶ CURRENTLY ACTIVE</div>
                <div class="active-title">Morning Workout</div>
                <div class="active-time">6:00 AM — 7:00 AM</div>
                <div class="active-progress-bar">
                  <div class="active-progress-fill" style="width: 45%;"></div>
                </div>
              </div>

              <!-- List Mockup -->
              <div class="mockup-task-list">
                <div class="mockup-task done">
                  <div class="mt-time">5:30 AM</div>
                  <div class="mt-divider red"></div>
                  <div class="mt-info">
                    <div class="mt-name">Wake Up Early</div>
                    <div class="mt-desc"><span class="dot red"></span> Major Task</div>
                  </div>
                  <div class="mt-check checked">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                </div>

                <div class="mockup-task active">
                  <div class="mt-time">6:00 AM</div>
                  <div class="mt-divider blue"></div>
                  <div class="mt-info">
                    <div class="mt-name">Morning Workout</div>
                    <div class="mt-desc"><span class="dot blue"></span> Minor Task</div>
                  </div>
                  <div class="mt-check"></div>
                </div>

                <div class="mockup-task">
                  <div class="mt-time">7:30 AM</div>
                  <div class="mt-divider green"></div>
                  <div class="mt-info">
                    <div class="mt-name">Study Physics</div>
                    <div class="mt-desc"><span class="dot blue"></span> Minor Task</div>
                  </div>
                  <div class="mt-check"></div>
                </div>
                
                <div class="mockup-task">
                  <div class="mt-time">9:00 AM</div>
                  <div class="mt-divider orange"></div>
                  <div class="mt-info">
                    <div class="mt-name">Project Work</div>
                    <div class="mt-desc"><span class="dot red"></span> Major Task</div>
                  </div>
                  <div class="mt-check"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="built-by-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Built by Sam
          </div>
        </div>
      </section>
    </div>
  `;

  // Attach events
  const navigateToLogin = () => {
    onNavigateToLogin();
  };

  document.getElementById('landing-login-btn')?.addEventListener('click', navigateToLogin);
  document.getElementById('landing-get-started-btn')?.addEventListener('click', navigateToLogin);
  document.getElementById('hero-get-started-btn')?.addEventListener('click', navigateToLogin);
  document.getElementById('hero-signin-btn')?.addEventListener('click', navigateToLogin);
}
