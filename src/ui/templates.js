// Small pure template helpers that return DOM nodes or HTML strings.
import { formatDue } from '../utils/dates';

const svg = {
  plus: () => `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>`,
  edit: () => `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
  trash: () => `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 7h12v2H6zm2 3h8l-1 9H9L8 10zm3-6h2l1 2H10l1-2z"/></svg>`,
  check: () => `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>`
};

export function projectItem(project, selected) {
  const li = document.createElement('li');
  li.className = `project-item ${selected ? 'selected' : ''}`;
  li.dataset.id = project.id;
  li.innerHTML = `
    <button class="project-select" title="Open project">${project.name}</button>
    <div class="project-actions">
      <button class="project-rename" title="Rename">${svg.edit()}</button>
      <button class="project-delete" title="Delete">${svg.trash()}</button>
    </div>
  `;
  return li;
}

export function todoRow(todo) {
  const li = document.createElement('li');
  li.className = `todo-row pri-${todo.priority} ${todo.done ? 'done' : ''}`;
  li.dataset.id = todo.id;
  li.innerHTML = `
    <div class="todo-left">
      <input type="checkbox" class="todo-toggle" ${todo.done ? 'checked' : ''} aria-label="Mark complete" />
      <span class="todo-title">${todo.title}</span>
    </div>
    <div class="todo-right">
      <span class="todo-due">${formatDue(todo.dueDate)}</span>
      <button class="todo-expand" aria-expanded="false" title="Expand">▼</button>
      <button class="todo-delete" title="Delete">${svg.trash()}</button>
    </div>
    <div class="todo-details" hidden>
      <form class="todo-edit">
        <label>Title<input name="title" value="${escapeHtml(todo.title)}" required></label>
        <label>Description<textarea name="description">${escapeHtml(todo.description)}</textarea></label>
        <label>Due Date<input name="dueDate" type="date" value="${dateInputValue(todo.dueDate)}"></label>
        <label>Priority
          <select name="priority" value="${todo.priority}">
            ${['low','normal','high','urgent'].map(p => `<option value="${p}" ${todo.priority===p?'selected':''}>${cap(p)}</option>`).join('')}
          </select>
        </label>
        <label>Notes<textarea name="notes">${escapeHtml(todo.notes || '')}</textarea></label>
        <div class="edit-actions">
          <button class="edit-save" type="submit">${svg.check()} Save</button>
        </div>
      </form>
    </div>
  `;
  return li;
}

export function toolbar(projectName) {
  const wrap = document.createElement('div');
  wrap.className = 'toolbar';
  wrap.innerHTML = `
    <h2 class="project-title">${projectName}</h2>
    <div class="toolbar-actions">
      <div class="filters">
        <label>Priority
          <select id="filter-priority">
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>
        <label><input type="checkbox" id="filter-hide-done"> Hide done</label>
      </div>
      <div class="sorts">
        <label>Sort by
          <select id="sort-key">
            <option value="dueDate">Due date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
            <option value="createdAt">Created</option>
          </select>
        </label>
        <select id="sort-dir">
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>
      <button id="add-todo" class="primary">${svg.plus()} Add</button>
    </div>
  `;
  return wrap;
}

export function newTodoDialog() {
  const dlg = document.createElement('dialog');
  dlg.className = 'modal';
  dlg.innerHTML = `
    <form method="dialog" class="modal-card" id="new-todo-form">
      <h3>New Todo</h3>
      <label>Title<input name="title" required placeholder="e.g., Ship MVP"></label>
      <label>Description<textarea name="description" placeholder="Details…"></textarea></label>
      <div class="row">
        <label>Due <input type="date" name="dueDate"></label>
        <label>Priority
          <select name="priority">
            <option value="low">Low</option>
            <option value="normal" selected>Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>
      </div>
      <menu>
        <button value="cancel" class="ghost">Cancel</button>
        <button value="ok" class="primary">Create</button>
      </menu>
    </form>
  `;
  return dlg;
}

function dateInputValue(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function escapeHtml(s='') { return s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
