// ==========================================
// DisciplineForge — Heatmap Renderer
// Month-block contribution heatmap
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

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Build a lookup map: "YYYY-MM-DD" → progress
  const dataMap = new Map();
  for (const entry of data) {
    if (entry.date) dataMap.set(entry.date, entry.progress);
  }

  // Always show the last 12 months (current month + 11 previous)
  const today = new Date();
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() });
  }

  let html = `<div class="heatmap-wrapper">`;

  // ── Month blocks container ──
  html += `<div class="heatmap-months-container">`;

  for (const { year, month } of months) {
    html += `<div class="heatmap-month-block">`;
    html += `<span class="heatmap-month-label">${monthNames[month]}</span>`;

    // Build all days in this month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const entries = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      // Don't show future days
      if (dateObj > today) {
        entries.push({ date: '', progress: -1, empty: true });
        continue;
      }
      const dateStr = dateObj.toISOString().split('T')[0];
      const progress = dataMap.has(dateStr) ? dataMap.get(dateStr) : 0;
      entries.push({ date: dateStr, progress });
    }

    // Build weekly columns (7 rows: Sun–Sat)
    const weeks = [];
    let currentWeek = [];

    // Pad start to align first day of month
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ date: '', progress: -1, empty: true });
    }

    for (const entry of entries) {
      currentWeek.push(entry);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: '', progress: -1, empty: true });
      }
      weeks.push(currentWeek);
    }

    // Render the per-month grid
    html += `<div class="heatmap-month-grid" style="grid-template-columns: repeat(${weeks.length}, 1fr);">`;

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

    html += `</div>`; // close month-grid
    html += `</div>`; // close month-block
  }

  html += `</div>`; // close months-container

  // ── Bottom bar: Active Days / Max Streak + legend ──
  if (showStats) {
    html += `
      <div class="heatmap-bottom-bar">
        <div class="heatmap-bottom-left">
          <span>Active Days - <strong>${totalActiveDays}</strong></span>
          <span>Max Streak - <strong>${longestStreak}</strong></span>
        </div>
        <div class="heatmap-bottom-right">
          <span class="heatmap-legend-item">
            <span class="heatmap-legend-swatch heatmap-cell-0"></span>
            Not visited yet
          </span>
          <span class="heatmap-legend-item">
            <span class="heatmap-legend-swatch heatmap-cell-4"></span>
            Achieved
          </span>
        </div>
      </div>
    `;
  }

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
