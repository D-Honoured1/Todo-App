// Render/mount the app. Uses templates + events. No domain logic here.
import { projectItem, todoRow, toolbar, newTodoDialog } from './templates';
import { wireProjectSidebar, wireTodoList } from './events';

export function mountApp({ service }) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h1>Modular Todo</h1>
          <button id="new-project">+ Project</button>
        </div>
        <ul class="project-list" id="project-list"></ul>
      </aside>
      <main class="main">
        <div id="main-toolbar"></div>
        <ul class="todo-list" id="todo-list"></ul>
      </main>
    </div>
  `;

  // Modal root
  document.body.appendChild(newTodoDialog());

  const $projects = app.querySelector('#project-list');
  const $list = app.querySelector('#todo-list');
  const $toolbar = app.querySelector('#main-toolbar');

  const getCurrentProjectId = () => service.getProject()?.id;

  const getFilters = () => ({
    priority: document.getElementById('filter-priority')?.value || 'all',
    hideDone: !!document.getElementById('filter-hide-done')?.checked,
    sortKey: document.getElementById('sort-key')?.value || 'dueDate',
    sortDir: document.getElementById('sort-dir')?.value || 'asc'
  });

  function renderProjects() {
    const state = service.snapshot();
    $projects.innerHTML = '';
    state.projects.forEach(p => $projects.appendChild(projectItem(p, p.id === state.selectedProjectId)));
  }

  function renderTodos() {
    const state = service.snapshot();
    const project = service.getProject();
    $toolbar.innerHTML = '';
    $toolbar.appendChild(toolbar(project?.name || 'Project'));

    const { priority, hideDone } = getFilters();
    const filtered = service.filterTodos(project.id, { priority, hideDone });

    $list.innerHTML = '';
    filtered.forEach(t => $list.appendChild(todoRow(t)));
  }

  function renderAll() { renderProjects(); renderTodos(); }
  renderAll();

  // Sidebar events
  wireProjectSidebar($projects, { service, render: renderAll });

  // Todo list events
  wireTodoList(app, { service, getFilters, projectId: getCurrentProjectId, render: renderAll });

  // New project button
  app.querySelector('#new-project').addEventListener('click', () => {
    const name = prompt('Project name');
    if (name) service.createProject(name);
  });

  // Re-render on state changes (persistence hooks)
  service.onChange(() => renderAll());
}
