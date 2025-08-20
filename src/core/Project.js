// Domain model: Project contains Todos. Again, no DOM here.
export class Project {
  constructor({ id, name, todos = [], createdAt = Date.now() }) {
    this.id = id ?? crypto.randomUUID();
    this.name = name?.trim() || 'Untitled Project';
    this.todos = todos; // array of Todo-like objects
    this.createdAt = createdAt;
    this.updatedAt = Date.now();
  }

  addTodo(todo) { this.todos.push(todo); this.touch(); }
  removeTodo(todoId) { this.todos = this.todos.filter(t => t.id !== todoId); this.touch(); }
  update(fields = {}) { Object.assign(this, fields); this.touch(); }
  touch() { this.updatedAt = Date.now(); }
}