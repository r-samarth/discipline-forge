// ==========================================
// DisciplineForge — Auth Module
// Simple email/password auth with localStorage
// ==========================================

const AUTH_KEY = 'disciplineforge_users';
const SESSION_KEY = 'disciplineforge_session';

function hashPassword(password) {
  // Simple hash for localStorage (not for production)
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

function getUsers() {
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : {};
}

function saveUsers(users) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(users));
}

export function signup(email, password) {
  if (!email || !password) {
    return { success: false, message: 'Email and password are required.' };
  }
  if (password.length < 4) {
    return { success: false, message: 'Password must be at least 4 characters.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();

  if (users[normalizedEmail]) {
    return { success: false, message: 'An account with this email already exists.' };
  }

  users[normalizedEmail] = {
    email: normalizedEmail,
    password: hashPassword(password),
    createdAt: new Date().toISOString().split('T')[0],
    displayName: normalizedEmail.split('@')[0]
  };

  saveUsers(users);
  setSession(normalizedEmail);
  return { success: true, message: 'Account created successfully!' };
}

export function login(email, password) {
  if (!email || !password) {
    return { success: false, message: 'Email and password are required.' };
  }

  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const user = users[normalizedEmail];

  if (!user) {
    return { success: false, message: 'No account found with this email.' };
  }

  if (user.password !== hashPassword(password)) {
    return { success: false, message: 'Incorrect password. Please try again.' };
  }

  setSession(normalizedEmail);
  return { success: true, message: 'Login successful!' };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

function setSession(email) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    email,
    loggedInAt: Date.now()
  }));
}

export function getCurrentUser() {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return null;

  const { email } = JSON.parse(session);
  const users = getUsers();
  return users[email] || null;
}

export function isLoggedIn() {
  return getCurrentUser() !== null;
}
