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

  // Get month labels positioned at the correct week column
  const monthPositions = getMonthPositions(weeks);

  let html = `<div class="heatmap-wrapper">`;

  // ── Top bar: submissions count + period dropdown + legend toggles ──
  if (showStats) {
    html += `
      <div class="heatmap-top-bar">
        <div class="heatmap-top-left">
          <span class="heatmap-submissions-count"><strong>${totalSubmissions}</strong> submissions in the last 12 months</span>
          <div class="heatmap-period-dropdown">
            <span>Last 12 months</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="heatmap-top-right">
          <button class="heatmap-toggle-btn heatmap-toggle-active">TUF</button>
          <button class="heatmap-toggle-btn">LeetCode</button>
        </div>
      </div>
    `;
  }

  // ── Month labels row ──
  html += `<div class="heatmap-months-row">`;
  for (const { label, col } of monthPositions) {
    html += `<span class="heatmap-month-label" style="grid-column: ${col + 1};">${label}</span>`;
  }
  html += `</div>`;

  // ── Grid (no day labels — clean look) ──
  html += `<div class="heatmap-grid-wrap">`;
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

  html += `</div></div>`; // close grid + grid-wrap

  // ── Bottom bar: Active Days / Max Streak + legend ──
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

function getMonthLabels() {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}

/**
 * Return an array of { label, col } for every month boundary in the weeks array.
 */
function getMonthPositions(weeks) {
  const labels = getMonthLabels();
  const positions = [];
  let lastMonth = -1;

  for (let w = 0; w < weeks.length; w++) {
    const firstValidEntry = weeks[w].find(d => d.date && !d.empty);
    if (firstValidEntry) {
      const month = new Date(firstValidEntry.date + 'T00:00:00').getMonth();
      if (month !== lastMonth) {
        positions.push({ label: labels[month], col: w });
        lastMonth = month;
      }
    }
  }

  return positions;
}
