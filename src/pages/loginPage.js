// ==========================================
// DisciplineForge — Login Page
// Beautiful glassmorphism login/signup form
// ==========================================

import { login, signup, loginWithGoogle } from '../auth.js';

export function renderLoginPage(onLoginSuccess, onBack) {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="login-page">
      <button class="back-home-btn" id="back-home-btn">← Back to Home</button>
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
                <circle cx="24" cy="24" r="3" fill="#000000"/>
                <defs>
                  <linearGradient id="grad1" x1="6" y1="4" x2="42" y2="44">
                    <stop offset="0%" stop-color="#9d4edd"/>
                    <stop offset="100%" stop-color="#7b2cbf"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 class="login-title">DisciplineForge</h1>
            <p class="login-subtitle">Master your habits. Master your every single day.</p>
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

          <div class="auth-divider">
            <span>or</span>
          </div>

          <button class="google-btn" id="google-login-btn">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            Continue with Google
          </button>

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

  // Back button
  document.getElementById('back-home-btn')?.addEventListener('click', () => {
    if (onBack) onBack();
  });

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
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    const loader = document.getElementById('btn-loader');
    const btn = document.getElementById('auth-submit-btn');

    clearMessages();
    btn.disabled = true;
    loader.classList.remove('hidden');

    try {
      const result = isLoginMode ? await login(email, password) : await signup(email, password);
      
      loader.classList.add('hidden');
      btn.disabled = false;

      if (result.success) {
        showSuccess(result.message);
        setTimeout(() => {
          onLoginSuccess();
        }, 800);
      } else {
        showError(result.message);
      }
    } catch (err) {
      loader.classList.add('hidden');
      btn.disabled = false;
      showError('Network error. Please try again later.');
    }
  });

  // Google Login
  const googleBtn = document.getElementById('google-login-btn');
  googleBtn.addEventListener('click', async () => {
    clearMessages();
    googleBtn.disabled = true;
    const oldHtml = googleBtn.innerHTML;
    googleBtn.innerHTML = '<div class="btn-loader"></div> Logging in...';

    const result = await loginWithGoogle();
    if (result.success) {
      showSuccess(result.message);
      setTimeout(() => {
        onLoginSuccess();
      }, 800);
    } else {
      googleBtn.innerHTML = oldHtml;
      googleBtn.disabled = false;
      showError(result.message);
    }
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
