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

  // Group data entries by year-month
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months = groupByMonth(data);

  let html = `<div class="heatmap-wrapper">`;

  // ── Month blocks container ──
  html += `<div class="heatmap-months-container">`;

  for (const month of months) {
    html += `<div class="heatmap-month-block">`;
    html += `<span class="heatmap-month-label">${monthNames[month.month]}</span>`;

    // Build weeks for this month
    const weeks = buildMonthWeeks(month.entries);

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

/**
 * Group data entries into an ordered array of { year, month, entries[] }.
 */
function groupByMonth(data) {
  const map = new Map();

  for (const entry of data) {
    if (!entry.date) continue;
    const d = new Date(entry.date + 'T00:00:00');
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!map.has(key)) {
      map.set(key, { year: d.getFullYear(), month: d.getMonth(), entries: [] });
    }
    map.get(key).entries.push(entry);
  }

  return Array.from(map.values());
}

/**
 * Build weekly columns for a single month's entries.
 * Each column is an array of 7 slots (Sun=0 … Sat=6).
 */
function buildMonthWeeks(entries) {
  const weeks = [];
  let currentWeek = [];

  // Pad start to align first day to its weekday
  if (entries.length > 0) {
    const firstDay = new Date(entries[0].date + 'T00:00:00').getDay();
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push({ date: '', progress: -1, empty: true });
    }
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

  return weeks;
}

function getColorLevel(progress) {
  if (progress <= 0) return '0';
  if (progress <= 25) return '1';
  if (progress <= 50) return '2';
  if (progress <= 75) return '3';
  return '4';
}
