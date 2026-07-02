// ==========================================
// DisciplineForge — Add Task Modal
// Glassmorphism modal for creating tasks
// ==========================================

export function renderAddTaskModal() {
  return `
    <div class="modal-overlay hidden" id="add-task-modal">
      <div class="modal-card">
        <div class="modal-header">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Create New Task
          </h2>
          <button class="modal-close" id="modal-close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form id="add-task-form" class="modal-form">
          <div class="input-group">
            <label for="task-name-input">Task Name</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <input type="text" id="task-name-input" placeholder="e.g., Gym, Reading, Coding..." required />
            </div>
          </div>

          <div class="input-group">
            <label for="task-date-input">Start Date</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <input type="date" id="task-date-input" required />
            </div>
          </div>

          <div class="subtasks-section">
            <label>Subtasks <span class="optional-tag">(optional)</span></label>
            <p class="subtask-hint">Break this task into daily subtasks, or leave empty for a simple task</p>

            <div id="subtasks-list" class="subtasks-list">
            </div>

            <button type="button" class="add-subtask-btn" id="add-subtask-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Subtask
            </button>
          </div>

          <div id="modal-error" class="auth-error hidden"></div>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" id="modal-cancel-btn">Cancel</button>
            <button type="submit" class="login-btn modal-submit-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="M12 16l4-4-4-4"/>
                <path d="M8 12h8"/>
              </svg>
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function initAddTaskModal(onTaskCreated) {
  const modal = document.getElementById('add-task-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const addSubtaskBtn = document.getElementById('add-subtask-btn');
  const form = document.getElementById('add-task-form');
  const subtasksList = document.getElementById('subtasks-list');

  // Set default date to today
  const dateInput = document.getElementById('task-date-input');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  // Open modal
  window.openAddTaskModal = () => {
    modal.classList.remove('hidden');
    document.getElementById('task-name-input').focus();
    // Reset form
    form.reset();
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    resetSubtasks();
    clearModalError();
  };

  // Close modal
  function closeModal() {
    modal.classList.add('hidden');
  }

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Add subtask
  addSubtaskBtn.addEventListener('click', () => {
    addSubtaskRow();
  });

  // Remove subtask delegation
  subtasksList.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.subtask-remove-btn');
    if (removeBtn) {
      const row = removeBtn.closest('.subtask-row');
      row.classList.add('subtask-removing');
      setTimeout(() => {
        row.remove();
        updateRemoveButtons();
      }, 200);
    }
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('task-name-input').value.trim();
    const startDate = document.getElementById('task-date-input').value;
    const subtaskInputs = document.querySelectorAll('.subtask-input');
    const subtasks = [];

    subtaskInputs.forEach(input => {
      const val = input.value.trim();
      if (val) subtasks.push(val);
    });

    if (!name) {
      showModalError('Please enter a task name.');
      return;
    }
    if (!startDate) {
      showModalError('Please select a start date.');
      return;
    }
    // Subtasks are optional — if none provided, task will have a simple complete/incomplete toggle

    onTaskCreated(name, startDate, subtasks);
    closeModal();
  });

  function addSubtaskRow() {
    const index = subtasksList.children.length;
    const row = document.createElement('div');
    row.className = 'subtask-row subtask-adding';
    row.dataset.index = index;
    row.innerHTML = `
      <div class="input-wrapper subtask-input-wrapper">
        <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9,11 12,14 22,4"/>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>
        <input type="text" class="subtask-input" placeholder="e.g., Track protein intake" />
      </div>
      <button type="button" class="subtask-remove-btn" title="Remove subtask">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;
    subtasksList.appendChild(row);
    row.querySelector('.subtask-input').focus();
    setTimeout(() => row.classList.remove('subtask-adding'), 300);
    updateRemoveButtons();
  }

  function resetSubtasks() {
    subtasksList.innerHTML = '';
  }

  function updateRemoveButtons() {
    const rows = subtasksList.querySelectorAll('.subtask-row');
    rows.forEach(row => {
      const btn = row.querySelector('.subtask-remove-btn');
      if (rows.length <= 1) {
        btn.classList.add('hidden');
      } else {
        btn.classList.remove('hidden');
      }
    });
  }

  function showModalError(msg) {
    const el = document.getElementById('modal-error');
    el.textContent = msg;
    el.classList.remove('hidden');
  }

  function clearModalError() {
    const el = document.getElementById('modal-error');
    if (el) {
      el.textContent = '';
      el.classList.add('hidden');
    }
  }
}
