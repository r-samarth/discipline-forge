// ==========================================
// DisciplineForge — Storage Module
// Centralized Firestore data management
// ==========================================

import { db } from './firebase.js';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  orderBy
} from 'firebase/firestore';

export class StorageManager {

  // ---- Tasks ----

  static async getTasks(userEmail) {
    if (!userEmail) return [];
    try {
      const q = query(collection(db, "tasks"), where("userEmail", "==", userEmail));
      const querySnapshot = await getDocs(q);
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push(doc.data());
      });
      return tasks;
    } catch (e) {
      console.error("Error getting tasks:", e);
      return [];
    }
  }

  static async getTaskById(userEmail, taskId) {
    if (!taskId) return null;
    try {
      const docRef = doc(db, "tasks", taskId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().userEmail === userEmail) {
        return docSnap.data();
      }
      return null;
    } catch (e) {
      console.error("Error getting task:", e);
      return null;
    }
  }

  static async updateTask(userEmail, updatedTask) {
    try {
      const docRef = doc(db, "tasks", updatedTask.id);
      await updateDoc(docRef, updatedTask);
    } catch (e) {
      console.error("Error updating task:", e);
    }
  }

  static async addTask(userEmail, task) {
    try {
      task.userEmail = userEmail; // Ensure the userEmail is on the task
      const docRef = doc(db, "tasks", task.id);
      await setDoc(docRef, task);
    } catch (e) {
      console.error("Error adding task:", e);
    }
  }

  static async removeTask(userEmail, taskId) {
    try {
      const docRef = doc(db, "tasks", taskId);
      await deleteDoc(docRef);
    } catch (e) {
      console.error("Error removing task:", e);
    }
  }

  // ---- History ----

  static async getHistory(userEmail) {
    if (!userEmail) return [];
    try {
      // Note: Ordering requires an index in Firestore if combined with 'where' in some cases,
      // but simple equality + order by on different fields often requires a composite index.
      // To avoid index creation errors for the user, we will fetch and sort in memory.
      const q = query(collection(db, "history"), where("userEmail", "==", userEmail));
      const querySnapshot = await getDocs(q);
      const history = [];
      querySnapshot.forEach((doc) => {
        history.push(doc.data());
      });
      // Sort newest first based on endDate
      history.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
      return history;
    } catch (e) {
      console.error("Error getting history:", e);
      return [];
    }
  }

  static async addToHistory(userEmail, historyEntry) {
    try {
      historyEntry.userEmail = userEmail;
      historyEntry.id = historyEntry.id || this.generateId();
      const docRef = doc(db, "history", historyEntry.id);
      await setDoc(docRef, historyEntry);
    } catch (e) {
      console.error("Error adding to history:", e);
    }
  }

  // ---- Utility ----

  static generateId() {
    return 'task_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
  }

  static generateSubtaskId() {
    return 'sub_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4);
  }

  static getToday() {
    return new Date().toISOString().split('T')[0];
  }

  static formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  static daysBetween(date1, date2) {
    const d1 = new Date(date1 + 'T00:00:00');
    const d2 = new Date(date2 + 'T00:00:00');
    return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
  }
}
