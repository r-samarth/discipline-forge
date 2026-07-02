// ==========================================
// DisciplineForge — Auth Module
// Firebase Authentication
// ==========================================

import { auth } from './firebase.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

// We wrap onAuthStateChanged so main.js can wait for initial auth state
export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function signup(email, password) {
  if (!email || !password) {
    return { success: false, message: 'Email and password are required.' };
  }
  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters for Firebase.' };
  }
  
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, message: 'Account created successfully!' };
  } catch (error) {
    console.error("Signup error:", error);
    let msg = 'Failed to create account.';
    if (error.code === 'auth/email-already-in-use') msg = 'An account with this email already exists.';
    if (error.code === 'auth/invalid-email') msg = 'Please enter a valid email address.';
    return { success: false, message: msg };
  }
}

export async function login(email, password) {
  if (!email || !password) {
    return { success: false, message: 'Email and password are required.' };
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true, message: 'Login successful!' };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: 'Incorrect email or password. Please try again.' };
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
  }
}

export function getCurrentUser() {
  const user = auth.currentUser;
  if (!user) return null;
  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.email.split('@')[0]
  };
}

export function isLoggedIn() {
  return auth.currentUser !== null;
}
