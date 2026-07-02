// ==========================================
// DisciplineForge — Storage Module
// Centralized localStorage data management
// ==========================================

const TASKS_KEY = 'disciplineforge_tasks';
const HISTORY_KEY = 'disciplineforge_history';

export class StorageManager {

  // ---- Tasks ----

  static getTasks(userEmail) {
    const data = localStorage.getItem(TASKS_KEY);
    const allTasks = data ? JSON.parse(data) : {};
    return allTasks[userEmail] || [];
  }

  static saveTasks(userEmail, tasks) {
    const data = localStorage.getItem(TASKS_KEY);
    const allTasks = data ? JSON.parse(data) : {};
    allTasks[userEmail] = tasks;
    localStorage.setItem(TASKS_KEY, JSON.stringify(allTasks));
  }

  static getTaskById(userEmail, taskId) {
    const tasks = this.getTasks(userEmail);
    return tasks.find(t => t.id === taskId) || null;
  }

  static updateTask(userEmail, updatedTask) {
    const tasks = this.getTasks(userEmail);
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      this.saveTasks(userEmail, tasks);
    }
  }

  static addTask(userEmail, task) {
    const tasks = this.getTasks(userEmail);
    tasks.push(task);
    this.saveTasks(userEmail, tasks);
  }

  static removeTask(userEmail, taskId) {
    const tasks = this.getTasks(userEmail).filter(t => t.id !== taskId);
    this.saveTasks(userEmail, tasks);
  }

  // ---- History ----

  static getHistory(userEmail) {
    const data = localStorage.getItem(HISTORY_KEY);
    const allHistory = data ? JSON.parse(data) : {};
    return allHistory[userEmail] || [];
  }

  static addToHistory(userEmail, historyEntry) {
    const data = localStorage.getItem(HISTORY_KEY);
    const allHistory = data ? JSON.parse(data) : {};
    if (!allHistory[userEmail]) {
      allHistory[userEmail] = [];
    }
    allHistory[userEmail].unshift(historyEntry); // newest first
    localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
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
