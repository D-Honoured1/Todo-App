// Application logic (pure-ish). No DOM. Talks to Store.
import { Project } from './Project';
import { Todo } from './Todo';

export class ProjectService {
  constructor(store) {
    this.store = store;
    this.state = { projects: [], selectedProjectId: null, version: 1 };
    this.listeners = new Set();
  }

  onChange(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  notify() { this.listeners.forEach(fn => fn(this.snapshot())); }
  snapshot() { return JSON.parse(JSON.stringify(this.state)); }

  init() {
    const loaded = this.store.load();
    if (loaded?.projects?.length) {
      this.state = loaded;
    } else {
      // Create default with placeholder content
      const defaultProject = new Project({ name: 'Inbox' });
      defaultProject.addTodo(new Todo({ title: 'Welcome to Modular Todo', description: 'Click me to expand. Edit, complete, or delete.', priority: 'high' }));
      defaultProject.addTodo(new Todo({ title: 'Add your first task', dueDate: new Date().toISOString(), priority: 'normal' }));
      this.state.projects.push(defaultProject);
      this.state.selectedProjectId = defaultProject.id;
      this.persist();
    }
  }

  persist() { this.store.save(this.state); this.notify(); }

  // ——— Project operations ———
  listProjects() { return this.state.projects; }
  getProject(projectId = this.state.selectedProjectId) {
    return this.state.projects.find(p => p.id === projectId) || this.state.projects[0] || null;
  }
  selectProject(projectId) { this.state.selectedProjectId = projectId; this.persist(); }
  createProject(name) {
    const p = new Project({ name });
    this.state.projects.push(p);
    this.state.selectedProjectId = p.id;
    this.persist();
    return p;
  }
  renameProject(projectId, name) { const p = this.getProject(projectId); if (!p) return; p.update({ name }); this.persist(); }
  deleteProject(projectId) {
    const idx = this.state.projects.findIndex(p => p.id === projectId);
    if (idx === -1) return;
    this.state.projects.splice(idx, 1);
    if (!this.state.projects.length) {
      // ensure at least one project remains
      const fallback = new Project({ name: 'Inbox' });
      this.state.projects.push(fallback);
      this.state.selectedProjectId = fallback.id;
    } else if (this.state.selectedProjectId === projectId) {
      this.state.selectedProjectId = this.state.projects[0].id;
    }
    this.persist();
  }

  // ——— Todo operations ———
  createTodo(projectId, data) {
    const p = this.getProject(projectId);
    if (!p) return null;
    const todo = new Todo(data);
    p.addTodo(todo);
    this.persist();
    return todo;
  }
  updateTodo(projectId, todoId, fields) {
    const p = this.getProject(projectId); if (!p) return;
    const t = p.todos.find(x => x.id === todoId); if (!t) return;
    Object.assign(t, fields); t.updatedAt = Date.now();
    this.persist();
  }
  toggleTodo(projectId, todoId) {
    const p = this.getProject(projectId); if (!p) return;
    const t = p.todos.find(x => x.id === todoId); if (!t) return;
    t.done = !t.done; t.updatedAt = Date.now();
    this.persist();
  }
  deleteTodo(projectId, todoId) {
    const p = this.getProject(projectId); if (!p) return;
    p.removeTodo(todoId);
    this.persist();
  }

  // ——— Filters/Sort ———
  sortTodos(projectId, key = 'dueDate', dir = 'asc') {
    const p = this.getProject(projectId); if (!p) return;
    const factor = dir === 'desc' ? -1 : 1;
    p.todos.sort((a, b) => {
      const av = a[key] ?? '';
      const bv = b[key] ?? '';
      if (av === bv) return 0;
      return av > bv ? factor : -factor;
    });
    this.persist();
  }
  filterTodos(projectId, { priority = 'all', hideDone = false } = {}) {
    const p = this.getProject(projectId); if (!p) return [];
    return p.todos.filter(t => {
      const pri = priority === 'all' || t.priority === priority;
      const done = hideDone ? !t.done : true;
      return pri && done;
    });
  }
}