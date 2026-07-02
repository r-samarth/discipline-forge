// ==========================================
// DisciplineForge — Dashboard Page
// Main dashboard with task cards, heatmaps, streaks
// ==========================================

import { getCurrentUser } from '../auth.js';
import { TaskManager } from '../taskManager.js';
import { renderHeatmap } from '../heatmap.js';
import { StorageManager } from '../storage.js';
import { renderNavbar, initNavbarEvents } from '../components/navbar.js';
import { renderAddTaskModal, initAddTaskModal } from '../components/addTaskModal.js';

export async function renderDashboardPage(onLogout, onNavigate) {
  const app = document.getElementById('app');
  const user = getCurrentUser();
  if (!user) return;

  const taskManager = new TaskManager(user.email);
  
  // Show a loading state inside the main area before data arrives
  app.innerHTML = `
    ${renderNavbar(onLogout, onNavigate, 'dashboard')}
    <main class="dashboard-main" style="display: flex; justify-content: center; align-items: center; min-height: 50vh;">
      <div style="color: var(--text-secondary);">Syncing your data from cloud...</div>
    </main>
  `;

  await taskManager.loadData();
  const tasks = taskManager.getActiveTasks();

  // Calculate overall discipline
  let overallDiscipline = 0;
  if (tasks.length > 0) {
    const scores = tasks.map(t => taskManager.getDisciplineScore(t.id));
    overallDiscipline = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  const today = StorageManager.getToday();
  const todayFormatted = StorageManager.formatDate(today);

  app.innerHTML = `
    ${renderNavbar(onLogout, onNavigate, 'dashboard')}

    <main class="dashboard-main">
      <!-- Overall Stats -->
      <div class="dashboard-header">
        <div class="dashboard-greeting">
          <h1>Welcome back, <span class="gradient-text">${user.displayName}</span></h1>
          <p>Stay disciplined. Every checkmark counts.</p>
        </div>
        <div class="overall-stats">
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">${tasks.length}</span>
              <span class="stat-label">Active Tasks</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon fire-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 12c2-3 6-5 6-9-4 1-6 5-6 5s-2-4-6-5c0 4 4 6 6 9z"/>
                <path d="M12 12c-2 3-6 5-6 9 4-1 6-5 6-5s2 4 6 5c0-4-4-6-6-9z"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">${overallDiscipline}%</span>
              <span class="stat-label">Discipline</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">${todayFormatted}</span>
              <span class="stat-label">Today</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Cards -->
      <div class="tasks-section" id="tasks-section">
        ${tasks.length === 0 ? renderEmptyState() : ''}
        ${tasks.map(task => renderTaskCard(task, taskManager, today)).join('')}
      </div>

      <!-- Add Task FAB -->
      <button class="fab" id="fab-add-task" title="Add New Task">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      ${renderAddTaskModal()}
    </main>

    <div class="watermark">
      <a href="https://samarth-r.vercel.app/" target="_blank" rel="noopener noreferrer">
        crafted by <span>sam</span>
      </a>
    </div>
  `;

  // Init navbar events
  initNavbarEvents(onLogout, onNavigate);

  // Init add task modal
  initAddTaskModal(async (name, startDate, subtasks) => {
    await taskManager.createTask(name, startDate, subtasks);
    renderDashboardPage(onLogout, onNavigate);
  });

  // FAB click
  const fab = document.getElementById('fab-add-task');
  if (fab) {
    fab.addEventListener('click', () => window.openAddTaskModal());
  }

  // Render heatmaps
  tasks.forEach(task => {
    const heatmapData = taskManager.getHeatmapData(task.id);
    const streaks = taskManager.calculateStreaks(task.id);
    const totalActiveDays = taskManager.getTotalActiveDays(task.id);

    renderHeatmap(heatmapData, `heatmap-${task.id}`, {
      showStats: true,
      taskName: task.name,
      currentStreak: streaks.current,
      longestStreak: streaks.longest,
      totalActiveDays
    });
  });

  // Subtask toggle delegation — use the tasks section container
  const tasksSection = document.getElementById('tasks-section');
  if (tasksSection) {
    tasksSection.addEventListener('click', async (e) => {
      const checkItem = e.target.closest('.subtask-check-item');
      if (!checkItem) return;

      // Prevent the label's default behavior so we control the toggle
      e.preventDefault();

      // Handle simple task toggle (no subtasks)
      const simpleCheckbox = checkItem.querySelector('.simple-task-checkbox');
      if (simpleCheckbox) {
        const taskId = simpleCheckbox.dataset.taskId;
        const date = simpleCheckbox.dataset.date;
        await taskManager.toggleSimpleTask(taskId, date);
        renderDashboardPage(onLogout, onNavigate);
        return;
      }

      // Handle subtask checkbox
      const checkbox = checkItem.querySelector('.subtask-checkbox');
      if (!checkbox) return;

      const taskId = checkbox.dataset.taskId;
      const subtaskId = checkbox.dataset.subtaskId;
      const date = checkbox.dataset.date;

      await taskManager.toggleSubtask(taskId, subtaskId, date);

      // Re-render dashboard
      renderDashboardPage(onLogout, onNavigate);
    });
  }

  // Terminate task delegation
  document.querySelectorAll('.terminate-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const taskId = btn.dataset.taskId;
      const taskName = btn.dataset.taskName;

      if (confirm(`Are you sure you want to terminate "${taskName}"? This will move it to history.`)) {
        await taskManager.terminateTask(taskId);
        renderDashboardPage(onLogout, onNavigate);
      }
    });
  });

  // Toggle today's subtasks panel
  document.querySelectorAll('.toggle-subtasks-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.task-card').querySelector('.subtasks-panel');
      const isExpanded = !panel.classList.contains('collapsed');
      panel.classList.toggle('collapsed', isExpanded);
      btn.classList.toggle('rotated', !isExpanded);
    });
  });
}

function renderTaskCard(task, taskManager, today) {
  const streaks = taskManager.calculateStreaks(task.id);
  const progress = taskManager.getTaskProgress(task.id, today);
  const disciplineScore = taskManager.getDisciplineScore(task.id);
  const totalActiveDays = taskManager.getTotalActiveDays(task.id);

  // Get today's subtask status
  const dayLog = task.dailyLog[today] || {};

  // Progress bar color class
  let progressClass = 'progress-none';
  if (progress > 0 && progress <= 25) progressClass = 'progress-low';
  else if (progress > 25 && progress <= 50) progressClass = 'progress-mid';
  else if (progress > 50 && progress <= 75) progressClass = 'progress-good';
  else if (progress > 75 && progress < 100) progressClass = 'progress-high';
  else if (progress === 100) progressClass = 'progress-complete';

  return `
    <div class="task-card" id="task-card-${task.id}">
      <div class="task-card-header">
        <div class="task-card-title">
          <h2>${task.name}</h2>
          <span class="task-start-date">Started ${StorageManager.formatDate(task.startDate)}</span>
        </div>
        <div class="task-card-actions">
          <button class="toggle-subtasks-btn" title="Toggle today's checklist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6,9 12,15 18,9"/>
            </svg>
          </button>
          <button class="terminate-btn" data-task-id="${task.id}" data-task-name="${task.name}" title="Terminate Task">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Quick stats -->
      <div class="task-quick-stats">
        <div class="quick-stat">
          <span class="quick-stat-value fire-text">${streaks.current}</span>
          <span class="quick-stat-label">Current Streak 🔥</span>
        </div>
        <div class="quick-stat">
          <span class="quick-stat-value">${streaks.longest}</span>
          <span class="quick-stat-label">Longest Streak</span>
        </div>
        <div class="quick-stat">
          <span class="quick-stat-value">${disciplineScore}%</span>
          <span class="quick-stat-label">Discipline</span>
        </div>
        <div class="quick-stat">
          <span class="quick-stat-value">${totalActiveDays}</span>
          <span class="quick-stat-label">Active Days</span>
        </div>
      </div>

      <!-- Today's progress -->
      <div class="today-progress">
        <div class="today-progress-header">
          <span>Today's Progress</span>
          <span class="today-progress-value ${progressClass}">${progress}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill ${progressClass}" style="width: ${progress}%"></div>
        </div>
      </div>

      <!-- Today's subtasks -->
      <div class="subtasks-panel">
        <div class="subtasks-checklist">
          ${task.subtasks.length > 0 ? task.subtasks.map(st => {
            const isChecked = dayLog[st.id] === true;
            return `
              <label class="subtask-check-item ${isChecked ? 'checked' : ''}">
                <input type="checkbox" class="subtask-checkbox" 
                  data-task-id="${task.id}" 
                  data-subtask-id="${st.id}" 
                  data-date="${today}"
                  ${isChecked ? 'checked' : ''} />
                <span class="custom-checkbox">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                </span>
                <span class="subtask-check-label">${st.name}</span>
              </label>
            `;
          }).join('') : `
            <label class="subtask-check-item simple-task-toggle ${progress === 100 ? 'checked' : ''}">
              <input type="checkbox" class="simple-task-checkbox" 
                data-task-id="${task.id}" 
                data-date="${today}"
                ${progress === 100 ? 'checked' : ''} />
              <span class="custom-checkbox">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
              </span>
              <span class="subtask-check-label">Mark task as completed for today</span>
            </label>
          `}
        </div>
      </div>

      <!-- Heatmap -->
      <div class="task-heatmap" id="heatmap-${task.id}">
        <div class="heatmap-loading">Loading heatmap...</div>
      </div>
    </div>
  `;
}

function renderEmptyState() {
  return `
    <div class="empty-state">
      <div class="empty-state-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
          <path d="M12 16l4-4-4-4"/>
          <path d="M8 12h8"/>
        </svg>
      </div>
      <h2>No Tasks Yet</h2>
      <p>Start your discipline journey by creating your first task.</p>
      <button class="login-btn empty-state-btn" onclick="window.openAddTaskModal()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        Create Your First Task
      </button>
    </div>
  `;
}
