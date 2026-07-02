// ==========================================
// DisciplineForge — History Page
// Terminated tasks with full stats & heatmaps
// ==========================================

import { getCurrentUser } from '../auth.js';
import { TaskManager } from '../taskManager.js';
import { renderHeatmap } from '../heatmap.js';
import { StorageManager } from '../storage.js';
import { renderNavbar, initNavbarEvents } from '../components/navbar.js';

export async function renderHistoryPage(onLogout, onNavigate) {
  const app = document.getElementById('app');
  const user = getCurrentUser();
  if (!user) return;

  const taskManager = new TaskManager(user.email);
  
  app.innerHTML = `
    ${renderNavbar(onLogout, onNavigate, 'history')}
    <main class="dashboard-main" style="display: flex; justify-content: center; align-items: center; min-height: 50vh;">
      <div style="color: var(--text-secondary);">Loading history...</div>
    </main>
  `;

  await taskManager.loadData();
  const history = taskManager.getHistory();

  app.innerHTML = `
    ${renderNavbar(onLogout, onNavigate, 'history')}

    <main class="dashboard-main">
      <div class="dashboard-header">
        <div class="dashboard-greeting">
          <h1>Task <span class="gradient-text">History</span></h1>
          <p>Your completed discipline journeys — every streak tells a story.</p>
        </div>
      </div>

      <div class="history-section">
        ${history.length === 0 ? renderEmptyHistory() : ''}
        ${history.map((entry, index) => renderHistoryCard(entry, index)).join('')}
      </div>
    </main>

    <div class="watermark">
      <a href="https://samarth-r.vercel.app/" target="_blank" rel="noopener noreferrer">
        crafted by <span>sam</span>
      </a>
    </div>
  `;

  // Init navbar
  initNavbarEvents(onLogout, onNavigate);

  // Render heatmaps for each history entry
  history.forEach((entry, index) => {
    const heatmapData = taskManager.getHistoryHeatmapData(entry);
    renderHeatmap(heatmapData, `history-heatmap-${index}`, {
      showStats: true,
      taskName: entry.name,
      currentStreak: entry.finalCurrentStreak || 0,
      longestStreak: entry.longestStreak || 0,
      totalActiveDays: entry.totalActiveDays || 0
    });
  });

  // Toggle heatmap expansion
  document.querySelectorAll('.history-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.history-card');
      const expandable = card.querySelector('.history-expandable');
      const isExpanded = !expandable.classList.contains('collapsed');
      expandable.classList.toggle('collapsed', isExpanded);
      btn.querySelector('.expand-icon').classList.toggle('rotated', !isExpanded);
    });
  });
}

function renderHistoryCard(entry, index) {
  const totalDays = StorageManager.daysBetween(entry.startDate, entry.endDate) + 1;

  return `
    <div class="history-card">
      <div class="history-card-header">
        <div class="history-card-title">
          <h2>${entry.name}</h2>
          <div class="history-dates">
            <span class="history-date-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              ${StorageManager.formatDate(entry.startDate)} → ${StorageManager.formatDate(entry.endDate)}
            </span>
            <span class="history-duration">${totalDays} days</span>
          </div>
        </div>
        <button class="history-expand-btn" title="Show/hide details">
          <span class="expand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6,9 12,15 18,9"/>
            </svg>
          </span>
        </button>
      </div>

      <!-- Quick stats -->
      <div class="task-quick-stats history-stats">
        <div class="quick-stat">
          <span class="quick-stat-value fire-text">${entry.longestStreak || 0}</span>
          <span class="quick-stat-label">Longest Streak 🔥</span>
        </div>
        <div class="quick-stat">
          <span class="quick-stat-value">${entry.disciplineScore || 0}%</span>
          <span class="quick-stat-label">Discipline Score</span>
        </div>
        <div class="quick-stat">
          <span class="quick-stat-value">${entry.totalActiveDays || 0}</span>
          <span class="quick-stat-label">Active Days</span>
        </div>
        <div class="quick-stat">
          <span class="quick-stat-value">${entry.subtasks ? entry.subtasks.length : 0}</span>
          <span class="quick-stat-label">Subtasks</span>
        </div>
      </div>

      <!-- Expandable section -->
      <div class="history-expandable collapsed">
        <!-- Subtasks list -->
        ${entry.subtasks && entry.subtasks.length > 0 ? `
        <div class="history-subtasks">
          <h3>Subtasks</h3>
          <div class="history-subtasks-list">
            ${entry.subtasks.map(st => `
              <span class="history-subtask-tag">${st.name}</span>
            `).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Heatmap -->
        <div class="task-heatmap history-heatmap" id="history-heatmap-${index}">
          <div class="heatmap-loading">Loading heatmap...</div>
        </div>
      </div>
    </div>
  `;
}

function renderEmptyHistory() {
  return `
    <div class="empty-state">
      <div class="empty-state-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12,6 12,12 16,14"/>
        </svg>
      </div>
      <h2>No History Yet</h2>
      <p>When you terminate a task, it will appear here with all its stats and streaks preserved.</p>
    </div>
  `;
}
