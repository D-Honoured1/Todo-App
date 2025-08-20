// Wire DOM to service. No business logic here beyond dispatching.
export function wireProjectSidebar(root, { service, render }) {
  root.addEventListener('click', (e) => {
    const li = e.target.closest('li.project-item');
    if (!li) return;
    const id = li.dataset.id;

    if (e.target.closest('.project-select')) {
      service.selectProject(id); render();
    } else if (e.target.closest('.project-rename')) {
      const current = service.getProject(id)?.name || '';
      const name = prompt('Rename project', current);
      if (name) service.renameProject(id, name);
      render();
    } else if (e.target.closest('.project-delete')) {
      if (confirm('Delete this project?')) { service.deleteProject(id); render(); }
    }
  });
}

export function wireTodoList(root, { service, getFilters, projectId, render }) {
  root.addEventListener('click', (e) => {
    const row = e.target.closest('li.todo-row');

    if (e.target.matches('#add-todo')) {
      const dlg = document.querySelector('dialog.modal');
      dlg.showModal();
      return;
    }

    if (!row) return;
    const id = row.dataset.id;

    if (e.target.closest('.todo-delete')) {
      service.deleteTodo(projectId(), id); animateRemove(row, () => render());
    } else if (e.target.closest('.todo-expand')) {
      const details = row.querySelector('.todo-details');
      const btn = e.target.closest('.todo-expand');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      details.hidden = expanded;
    } else if (e.target.closest('.todo-toggle')) {
      service.toggleTodo(projectId(), id); render();
    }
  });

  root.addEventListener('submit', (e) => {
    if (e.target.matches('form.todo-edit')) {
      e.preventDefault();
      const row = e.target.closest('li.todo-row');
      const id = row.dataset.id;
      const data = formToObj(e.target);
      if (!data.title) return;
      service.updateTodo(projectId(), id, normalizeTodoForm(data));
      row.querySelector('.todo-details').hidden = true;
      render();
    }
  });

  // Dialog form (create new)
  document.addEventListener('close', (e) => {
    if (!e.target.matches('dialog.modal')) return;
    if (e.target.returnValue === 'ok') {
      const form = e.target.querySelector('form');
      const data = formToObj(form);
      if (!data.title) return;
      service.createTodo(projectId(), normalizeTodoForm(data));
    }
    render();
  }, true);

  // Filters and sorts
  root.addEventListener('change', (e) => {
    if (e.target.matches('#filter-priority, #filter-hide-done, #sort-key, #sort-dir')) {
      const { sortKey, sortDir } = getFilters();
      service.sortTodos(projectId(), sortKey, sortDir);
      render();
    }
  });
}

function formToObj(form) {
  const fd = new FormData(form);
  return Object.fromEntries(fd.entries());
}
function normalizeTodoForm(data) {
  return {
    title: data.title.trim(),
    description: data.description?.trim() || '',
    dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    priority: data.priority || 'normal',
    notes: data.notes?.trim() || ''
  };
}

function animateRemove(node, done) {
  node.classList.add('bye');
  node.addEventListener('animationend', () => done(), { once: true });
}
