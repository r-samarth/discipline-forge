// ==========================================
// DisciplineForge — Heatmap Renderer
// GitHub-style contribution heatmap
// ==========================================

import { StorageManager } from './storage.js';

export function renderHeatmap(data, containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const {
    showStats = true,
    taskName = '',
    currentStreak = 0,
    longestStreak = 0,
    totalActiveDays = 0
  } = options;

  // Calculate total submissions (days with any activity)
  const totalSubmissions = data.filter(d => d.progress > 0).length;

  // Build the heatmap grid
  // GitHub-style: 7 rows (Sun-Sat), columns = weeks
  const weeks = [];
  let currentWeek = [];

  // Pad the start to align with the correct day of the week
  if (data.length > 0) {
    const firstDay = new Date(data[0].date + 'T00:00:00').getDay();
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push({ date: '', progress: -1, empty: true });
    }
  }

  for (const entry of data) {
    currentWeek.push(entry);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    // Pad the end
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', progress: -1, empty: true });
    }
    weeks.push(currentWeek);
  }

  // Get month labels
  const monthLabels = getMonthLabels(data);

  let html = `<div class="heatmap-wrapper">`;

  // Stats bar
  if (showStats) {
    html += `
      <div class="heatmap-stats">
        <span class="heatmap-stat-total"><strong>${totalSubmissions}</strong> active days in the past year</span>
        <div class="heatmap-stat-right">
          <span>Total active days: <strong>${totalActiveDays}</strong></span>
          <span>Max streak: <strong>${longestStreak}</strong></span>
          <span>Current streak: <strong>${currentStreak}</strong> 🔥</span>
        </div>
      </div>
    `;
  }

  // Month labels
  html += `<div class="heatmap-months">`;
  html += `<div class="heatmap-day-labels-spacer"></div>`;
  let lastMonth = -1;
  for (let w = 0; w < weeks.length; w++) {
    const firstValidEntry = weeks[w].find(d => d.date && !d.empty);
    if (firstValidEntry) {
      const month = new Date(firstValidEntry.date + 'T00:00:00').getMonth();
      if (month !== lastMonth) {
        html += `<span class="heatmap-month-label" style="grid-column: ${w + 2}">${monthLabels[month]}</span>`;
        lastMonth = month;
      }
    }
  }
  html += `</div>`;

  // Grid container
  html += `<div class="heatmap-grid-container">`;

  // Day labels
  html += `<div class="heatmap-day-labels">
    <span></span>
    <span>Mon</span>
    <span></span>
    <span>Wed</span>
    <span></span>
    <span>Fri</span>
    <span></span>
  </div>`;

  // The actual grid
  html += `<div class="heatmap-grid" style="grid-template-columns: repeat(${weeks.length}, 1fr);">`;

  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < weeks.length; col++) {
      const cell = weeks[col][row];
      if (!cell || cell.empty) {
        html += `<div class="heatmap-cell heatmap-cell-empty"></div>`;
      } else {
        const level = getColorLevel(cell.progress);
        const tooltip = cell.date
          ? `${StorageManager.formatDate(cell.date)}: ${cell.progress}% complete`
          : '';
        html += `<div class="heatmap-cell heatmap-cell-${level}" data-date="${cell.date}" data-progress="${cell.progress}" title="${tooltip}"></div>`;
      }
    }
  }

  html += `</div></div>`; // close grid + grid-container

  // Color legend
  html += `
    <div class="heatmap-legend">
      <span>Less</span>
      <div class="heatmap-cell heatmap-cell-0"></div>
      <div class="heatmap-cell heatmap-cell-1"></div>
      <div class="heatmap-cell heatmap-cell-2"></div>
      <div class="heatmap-cell heatmap-cell-3"></div>
      <div class="heatmap-cell heatmap-cell-4"></div>
      <span>More</span>
    </div>
  `;

  html += `</div>`; // close heatmap-wrapper

  container.innerHTML = html;
}

function getColorLevel(progress) {
  if (progress <= 0) return '0';
  if (progress <= 25) return '1';
  if (progress <= 50) return '2';
  if (progress <= 75) return '3';
  return '4';
}

function getMonthLabels(data) {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}
