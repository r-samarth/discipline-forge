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
            <a href="#about" class="nav-link">About Sam</a>
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
          
          <!-- Heatmap Mockup -->
          <div class="hero-mockup heatmap-mockup-container">
            <div class="mockup-window heatmap-window">
              <div class="mockup-header">
                <div class="window-controls">
                  <span class="control close"></span>
                  <span class="control minimize"></span>
                  <span class="control maximize"></span>
                </div>
                <div class="window-title">Yearly Discipline Heatmap</div>
              </div>
              <div class="mockup-body" style="min-height: auto; padding: 30px;">
                <div class="heatmap-wrapper" style="width: 100%; border: 1px solid rgba(255,255,255,0.05); background: rgba(20,20,20,0.8);">
                  <div class="heatmap-stats">
                    <div class="heatmap-stat-total"><strong>284</strong> Total active days</div>
                    <div class="heatmap-stat-right">
                      <span>Longest Streak: <strong>42 days</strong></span>
                      <span>Current Streak: <strong class="text-gradient">12 days 🔥</strong></span>
                    </div>
                  </div>
                  <div class="heatmap-grid-container" style="overflow: hidden;">
                    <div class="heatmap-day-labels">
                      <span></span><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span>
                    </div>
                    <div class="heatmap-grid" id="mockup-heatmap-grid" style="gap: 4px;">
                      <!-- Generated by JS -->
                    </div>
                  </div>
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

      <!-- Features & Advantages Section -->
      <section id="features" class="content-section">
        <div class="section-container">
          <h2 class="section-title">Why DisciplineForge?</h2>
          <p class="section-subtitle">The ultimate tool to build consistency and master your daily routine.</p>
          
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🔥</div>
              <h3>Streak Tracking</h3>
              <p>Keep the fire burning. Track your consecutive days and build unbreakable habits.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3>Visual Heatmaps</h3>
              <p>GitHub-style contribution graphs give you an instant overview of your long-term consistency.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">⚡️</div>
              <h3>Discipline Score</h3>
              <p>Get a precise metric of your overall discipline based on your daily completion rates.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Section -->
      <section id="how-it-works" class="content-section alternate">
        <div class="section-container">
          <h2 class="section-title">How It Works</h2>
          <p class="section-subtitle">Three simple steps to transform your life.</p>
          
          <div class="steps-container">
            <div class="step">
              <div class="step-number">1</div>
              <h3>Define Your Tasks</h3>
              <p>Create tasks for habits you want to build or routines you need to follow.</p>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <h3>Check In Daily</h3>
              <p>Log in every day and check off your completed tasks or subtasks.</p>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <h3>Watch It Grow</h3>
              <p>Review your heatmaps and streaks as your discipline score climbs to 100%.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- About Sam Section -->
      <section id="about" class="content-section">
        <div class="section-container">
          <div class="about-card">
            <div class="about-avatar">
              <span>S</span>
            </div>
            <div class="about-info">
              <h2 class="section-title" style="text-align: left; margin-bottom: 8px;">About Sam</h2>
              <p>Hi, I'm Sam. I built DisciplineForge to solve my own problem: staying consistent. This platform is designed with a premium, distraction-free aesthetic to help you focus on what truly matters—forging your daily discipline without the noise.</p>
              <a href="https://samarth-r.vercel.app/" target="_blank" rel="noopener noreferrer" class="about-link">Visit my portfolio →</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA Section -->
      <section class="cta-section">
        <div class="section-container">
          <h2 class="section-title">Ready to master your day?</h2>
          <p class="section-subtitle">Join today and start building your unbroken streaks.</p>
          <button class="btn-primary" id="final-get-started-btn">Get Started Now</button>
        </div>
      </section>
      
      <footer class="landing-footer">
        <p>&copy; ${new Date().getFullYear()} DisciplineForge. Built by Sam.</p>
      </footer>
    </div>
  `;

  // Attach events
  const navigateToLogin = (e) => {
    if (e) e.preventDefault();
    onNavigateToLogin();
  };

  document.getElementById('landing-login-btn')?.addEventListener('click', navigateToLogin);
  document.getElementById('landing-get-started-btn')?.addEventListener('click', navigateToLogin);
  document.getElementById('hero-get-started-btn')?.addEventListener('click', navigateToLogin);
  document.getElementById('hero-signin-btn')?.addEventListener('click', navigateToLogin);
  document.getElementById('final-get-started-btn')?.addEventListener('click', navigateToLogin);
  
  // Populate Mockup Heatmap
  const heatmapGrid = document.getElementById('mockup-heatmap-grid');
  if (heatmapGrid) {
    let cellsHtml = '';
    // 52 weeks * 7 days
    for (let i = 0; i < 52 * 7; i++) {
      // Generate a pattern that looks impressive
      // Less density at the start, very dense at the end
      const progress = i / (52 * 7);
      let intensity = 0;
      
      if (Math.random() < progress + 0.1) {
        const rand = Math.random();
        if (rand < 0.2) intensity = 1;
        else if (rand < 0.5) intensity = 2;
        else if (rand < 0.8) intensity = 3;
        else intensity = 4;
      }
      cellsHtml += `<div class="heatmap-cell heatmap-cell-${intensity}"></div>`;
    }
    heatmapGrid.innerHTML = cellsHtml;
  }

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}
