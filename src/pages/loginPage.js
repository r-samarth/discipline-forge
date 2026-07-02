// ==========================================
// DisciplineForge — Login Page
// Beautiful glassmorphism login/signup form
// ==========================================

import { login, signup } from '../auth.js';

export function renderLoginPage(onLoginSuccess) {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="login-page">
      <div class="particles-bg" id="particles"></div>

      <div class="login-container">
        <div class="login-card">
          <div class="login-logo">
            <div class="logo-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M24 4L6 14V34L24 44L42 34V14L24 4Z" stroke="url(#grad1)" stroke-width="2.5" fill="none"/>
                <path d="M24 4L24 44" stroke="url(#grad1)" stroke-width="1.5" opacity="0.5"/>
                <path d="M6 14L42 34" stroke="url(#grad1)" stroke-width="1.5" opacity="0.5"/>
                <path d="M42 14L6 34" stroke="url(#grad1)" stroke-width="1.5" opacity="0.5"/>
                <circle cx="24" cy="24" r="6" fill="url(#grad1)" opacity="0.8"/>
                <circle cx="24" cy="24" r="3" fill="#0d1117"/>
                <defs>
                  <linearGradient id="grad1" x1="6" y1="4" x2="42" y2="44">
                    <stop offset="0%" stop-color="#39d353"/>
                    <stop offset="100%" stop-color="#26a641"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 class="login-title">DisciplineForge</h1>
            <p class="login-subtitle">Forge your habits. Build your streaks. Master discipline.</p>
          </div>

          <div class="login-tabs">
            <button class="login-tab active" data-tab="login" id="tab-login">Sign In</button>
            <button class="login-tab" data-tab="signup" id="tab-signup">Sign Up</button>
          </div>

          <form id="auth-form" class="login-form">
            <div class="input-group">
              <label for="email-input">Email</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M22 4L12 13L2 4"/>
                </svg>
                <input type="email" id="email-input" placeholder="Enter your email" required autocomplete="email" />
              </div>
            </div>

            <div class="input-group">
              <label for="password-input">Password</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input type="password" id="password-input" placeholder="Enter your password" required minlength="4" autocomplete="current-password" />
              </div>
            </div>

            <div id="auth-error" class="auth-error hidden"></div>
            <div id="auth-success" class="auth-success hidden"></div>

            <button type="submit" class="login-btn" id="auth-submit-btn">
              <span id="btn-text">Sign In</span>
              <div class="btn-loader hidden" id="btn-loader"></div>
            </button>
          </form>

          <div class="login-footer">
            <p id="login-switch-text">Don't have an account? <a href="#" id="switch-to-signup">Create one</a></p>
          </div>
        </div>
      </div>

      <div class="watermark">
        <a href="https://samarth-r.vercel.app/" target="_blank" rel="noopener noreferrer">
        crafted by <span>sam</span>
      </a>
      </div>
    </div>
  `;

  // Initialize particles
  createParticles();

  // Tab switching
  let isLoginMode = true;
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const btnText = document.getElementById('btn-text');
  const switchText = document.getElementById('login-switch-text');
  const switchLink = document.getElementById('switch-to-signup');

  function setMode(loginMode) {
    isLoginMode = loginMode;
    tabLogin.classList.toggle('active', loginMode);
    tabSignup.classList.toggle('active', !loginMode);
    btnText.textContent = loginMode ? 'Sign In' : 'Create Account';
    switchText.innerHTML = loginMode
      ? 'Don\'t have an account? <a href="#" id="switch-to-signup">Create one</a>'
      : 'Already have an account? <a href="#" id="switch-to-login">Sign in</a>';

    // Rebind switch link
    const newLink = document.getElementById('switch-to-signup') || document.getElementById('switch-to-login');
    if (newLink) {
      newLink.addEventListener('click', (e) => {
        e.preventDefault();
        setMode(!isLoginMode);
      });
    }

    clearMessages();
  }

  tabLogin.addEventListener('click', () => setMode(true));
  tabSignup.addEventListener('click', () => setMode(false));
  switchLink.addEventListener('click', (e) => {
    e.preventDefault();
    setMode(false);
  });

  // Form submission
  const form = document.getElementById('auth-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    const loader = document.getElementById('btn-loader');
    const btn = document.getElementById('auth-submit-btn');

    clearMessages();
    btn.disabled = true;
    loader.classList.remove('hidden');

    setTimeout(() => {
      const result = isLoginMode ? login(email, password) : signup(email, password);

      loader.classList.add('hidden');
      btn.disabled = false;

      if (result.success) {
        showSuccess(result.message);
        setTimeout(() => {
          onLoginSuccess();
        }, 600);
      } else {
        showError(result.message);
        shakeForm();
      }
    }, 500);
  });

  function showError(msg) {
    const el = document.getElementById('auth-error');
    el.textContent = msg;
    el.classList.remove('hidden');
  }

  function showSuccess(msg) {
    const el = document.getElementById('auth-success');
    el.textContent = msg;
    el.classList.remove('hidden');
  }

  function clearMessages() {
    document.getElementById('auth-error').classList.add('hidden');
    document.getElementById('auth-success').classList.add('hidden');
  }

  function shakeForm() {
    const card = document.querySelector('.login-card');
    card.classList.add('shake');
    setTimeout(() => card.classList.remove('shake'), 500);
  }
}

function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const particleCount = 50;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDuration = (3 + Math.random() * 7) + 's';
    particle.style.animationDelay = (Math.random() * 5) + 's';
    particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
    particle.style.opacity = (0.1 + Math.random() * 0.4).toString();
    container.appendChild(particle);
  }
}
