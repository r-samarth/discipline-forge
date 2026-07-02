// ==========================================
// DisciplineForge — Task Manager Module
// Task CRUD, subtask toggling, streaks, discipline scoring
// ==========================================

import { StorageManager } from './storage.js';

export class TaskManager {

  constructor(userEmail) {
    this.userEmail = userEmail;
    this.tasks = [];
    this.history = [];
  }

  // Load all tasks and history from Firebase into memory
  async loadData() {
    this.tasks = await StorageManager.getTasks(this.userEmail);
    this.history = await StorageManager.getHistory(this.userEmail);
  }

  // Create a new task
  async createTask(name, startDate, subtasks) {
    const task = {
      id: StorageManager.generateId(),
      name: name.trim(),
      startDate: startDate,
      createdAt: StorageManager.getToday(),
      subtasks: subtasks.map(st => ({
        id: StorageManager.generateSubtaskId(),
        name: st.trim()
      })),
      dailyLog: {},
      isActive: true
    };

    this.tasks.push(task);
    await StorageManager.addTask(this.userEmail, task);
    return task;
  }

  // Get all active tasks
  getActiveTasks() {
    return this.tasks.filter(t => t.isActive);
  }

  // Get a single task from memory
  getTask(taskId) {
    return this.tasks.find(t => t.id === taskId) || null;
  }

  // Toggle a subtask for a specific date
  async toggleSubtask(taskId, subtaskId, date) {
    const task = this.getTask(taskId);
    if (!task) return null;

    if (!task.dailyLog[date]) {
      task.dailyLog[date] = {};
    }

    task.dailyLog[date][subtaskId] = !task.dailyLog[date][subtaskId];
    // We do not await here so UI updates instantly, Firebase syncs in background
    StorageManager.updateTask(this.userEmail, task);
    return task;
  }

  // Toggle a simple task (no subtasks) for a specific date
  async toggleSimpleTask(taskId, date) {
    const task = this.getTask(taskId);
    if (!task) return null;

    if (!task.dailyLog[date]) {
      task.dailyLog[date] = {};
    }

    task.dailyLog[date]['_completed'] = !task.dailyLog[date]['_completed'];
    StorageManager.updateTask(this.userEmail, task);
    return task;
  }

  // Get completion percentage for a task on a specific date
  getTaskProgress(taskId, date) {
    const task = this.getTask(taskId);
    if (!task) return 0;

    const dayLog = task.dailyLog[date] || {};

    // Simple task (no subtasks) — either 0% or 100%
    if (task.subtasks.length === 0) {
      return dayLog['_completed'] ? 100 : 0;
    }

    // Task with subtasks
    const completed = task.subtasks.filter(st => dayLog[st.id] === true).length;
    return Math.round((completed / task.subtasks.length) * 100);
  }

  // Check if ALL subtasks are completed on a date
  isFullyComplete(taskId, date) {
    return this.getTaskProgress(taskId, date) === 100;
  }

  // Calculate streaks for a task
  calculateStreaks(taskId) {
    const task = this.getTask(taskId);
    if (!task) return { current: 0, longest: 0 };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all dates from start to today
    const startDate = new Date(task.startDate + 'T00:00:00');
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Iterate from start date to today
    const dates = [];
    const d = new Date(startDate);
    while (d <= today) {
      dates.push(d.toISOString().split('T')[0]);
      d.setDate(d.getDate() + 1);
    }

    // Calculate longest streak
    for (const date of dates) {
      if (this.isFullyComplete(taskId, date)) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Calculate current streak (working backwards from today)
    for (let i = dates.length - 1; i >= 0; i--) {
      if (this.isFullyComplete(taskId, dates[i])) {
        currentStreak++;
      } else {
        // If today is not complete, check yesterday
        if (i === dates.length - 1) continue;
        break;
      }
    }

    return { current: currentStreak, longest: longestStreak };
  }

  // Get total active days for a task
  getTotalActiveDays(taskId) {
    const task = this.getTask(taskId);
    if (!task) return 0;

    let activeDays = 0;
    for (const date of Object.keys(task.dailyLog)) {
      const dayLog = task.dailyLog[date];
      let anyCompleted;
      if (task.subtasks.length === 0) {
        anyCompleted = dayLog['_completed'] === true;
      } else {
        anyCompleted = task.subtasks.some(st => dayLog[st.id] === true);
      }
      if (anyCompleted) activeDays++;
    }
    return activeDays;
  }

  // Calculate discipline score (completed subtasks / total possible subtasks since start)
  getDisciplineScore(taskId) {
    const task = this.getTask(taskId);
    if (!task) return 0;

    const todayStr = StorageManager.getToday();
    // Only count up to today
    let totalDays = StorageManager.daysBetween(task.startDate, todayStr) + 1;
    if (totalDays <= 0) return 0;

    const totalActive = this.getTotalActiveDays(taskId);
    
    // Very simple discipline score: percentage of active days vs total days since start
    return Math.round((totalActive / totalDays) * 100);
  }

  // Get heatmap data for a task (last 365 days or from start)
  getHeatmapData(taskId) {
    const task = this.getTask(taskId);
    if (!task) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(task.startDate + 'T00:00:00');

    // Go back up to 365 days from today, but not before task start
    const heatmapStart = new Date(today);
    heatmapStart.setDate(heatmapStart.getDate() - 364);
    const effectiveStart = heatmapStart > startDate ? heatmapStart : startDate;

    const data = [];
    const d = new Date(effectiveStart);
    while (d <= today) {
      const dateStr = d.toISOString().split('T')[0];
      const progress = this.getTaskProgress(taskId, dateStr);
      const beforeStart = d < startDate;

      data.push({
        date: dateStr,
        progress: beforeStart ? -1 : progress,
        isFullyComplete: progress === 100,
        day: d.getDay()
      });
      d.setDate(d.getDate() + 1);
    }

    return data;
  }

  // Get heatmap data for a history entry
  getHistoryHeatmapData(historyEntry) {
    const today = new Date(historyEntry.endDate + 'T00:00:00');
    const startDate = new Date(historyEntry.startDate + 'T00:00:00');

    const data = [];
    const d = new Date(startDate);
    while (d <= today) {
      const dateStr = d.toISOString().split('T')[0];
      const dayLog = historyEntry.dailyLog[dateStr] || {};
      let progress = 0;
      
      if (historyEntry.subtasks.length === 0) {
        progress = dayLog['_completed'] ? 100 : 0;
      } else {
        const completed = historyEntry.subtasks.filter(st => dayLog[st.id] === true).length;
        progress = Math.round((completed / historyEntry.subtasks.length) * 100);
      }

      data.push({
        date: dateStr,
        progress,
        isFullyComplete: progress === 100,
        day: d.getDay()
      });
      d.setDate(d.getDate() + 1);
    }

    return data;
  }

  // Terminate a task (move to history)
  async terminateTask(taskId) {
    const task = this.getTask(taskId);
    if (!task) return;

    task.isActive = false;
    await StorageManager.updateTask(this.userEmail, task);

    const streaks = this.calculateStreaks(taskId);
    
    const historyEntry = {
      originalTaskId: task.id,
      name: task.name,
      startDate: task.startDate,
      endDate: StorageManager.getToday(),
      subtasks: task.subtasks,
      dailyLog: task.dailyLog,
      finalCurrentStreak: streaks.current,
      longestStreak: streaks.longest,
      disciplineScore: this.getDisciplineScore(taskId),
      totalActiveDays: this.getTotalActiveDays(taskId)
    };

    this.history.unshift(historyEntry);
    await StorageManager.addToHistory(this.userEmail, historyEntry);
  }

  getHistory() {
    return this.history;
  }
}
