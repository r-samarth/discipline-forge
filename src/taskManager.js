// ==========================================
// DisciplineForge — Task Manager Module
// Task CRUD, subtask toggling, streaks, discipline scoring
// ==========================================

import { StorageManager } from './storage.js';

export class TaskManager {

  constructor(userEmail) {
    this.userEmail = userEmail;
  }

  // Create a new task
  createTask(name, startDate, subtasks) {
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

    StorageManager.addTask(this.userEmail, task);
    return task;
  }

  // Get all active tasks
  getActiveTasks() {
    return StorageManager.getTasks(this.userEmail).filter(t => t.isActive);
  }

  // Get a single task
  getTask(taskId) {
    return StorageManager.getTaskById(this.userEmail, taskId);
  }

  // Toggle a subtask for a specific date
  toggleSubtask(taskId, subtaskId, date) {
    const task = this.getTask(taskId);
    if (!task) return null;

    if (!task.dailyLog[date]) {
      task.dailyLog[date] = {};
    }

    task.dailyLog[date][subtaskId] = !task.dailyLog[date][subtaskId];
    StorageManager.updateTask(this.userEmail, task);
    return task;
  }

  // Toggle a simple task (no subtasks) for a specific date
  toggleSimpleTask(taskId, date) {
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

    // Calculate current streak (from today backwards)
    for (let i = dates.length - 1; i >= 0; i--) {
      if (this.isFullyComplete(taskId, dates[i])) {
        currentStreak++;
      } else {
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

  // Get discipline score (percentage of fully completed days since start)
  getDisciplineScore(taskId) {
    const task = this.getTask(taskId);
    if (!task) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(task.startDate + 'T00:00:00');
    const totalDays = Math.max(1, Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1);

    let fullyCompletedDays = 0;
    const d = new Date(start);
    while (d <= today) {
      const dateStr = d.toISOString().split('T')[0];
      if (this.isFullyComplete(taskId, dateStr)) {
        fullyCompletedDays++;
      }
      d.setDate(d.getDate() + 1);
    }

    return Math.round((fullyCompletedDays / totalDays) * 100);
  }

  // Terminate a task — move to history
  terminateTask(taskId) {
    const task = this.getTask(taskId);
    if (!task) return null;

    const streaks = this.calculateStreaks(taskId);
    const totalActiveDays = this.getTotalActiveDays(taskId);
    const disciplineScore = this.getDisciplineScore(taskId);

    const historyEntry = {
      ...task,
      isActive: false,
      endDate: StorageManager.getToday(),
      longestStreak: streaks.longest,
      finalCurrentStreak: streaks.current,
      totalActiveDays,
      disciplineScore
    };

    StorageManager.addToHistory(this.userEmail, historyEntry);
    StorageManager.removeTask(this.userEmail, taskId);

    return historyEntry;
  }

  // Get history
  getHistory() {
    return StorageManager.getHistory(this.userEmail);
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

  // Get heatmap data for a history entry (no need to look up active task)
  getHistoryHeatmapData(historyEntry) {
    const today = new Date(historyEntry.endDate + 'T00:00:00');
    const startDate = new Date(historyEntry.startDate + 'T00:00:00');

    const data = [];
    const d = new Date(startDate);
    while (d <= today) {
      const dateStr = d.toISOString().split('T')[0];
      const dayLog = historyEntry.dailyLog[dateStr] || {};
      const completed = historyEntry.subtasks.filter(st => dayLog[st.id] === true).length;
      const progress = historyEntry.subtasks.length > 0
        ? Math.round((completed / historyEntry.subtasks.length) * 100)
        : 0;

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
}
