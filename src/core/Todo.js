// Domain model: Todo (no DOM here). Keep logic pure and serializable.
// Optional fields: notes (string), checklist (array of { text, done })
export class Todo {
  constructor({ id, title, description = '', dueDate = null, priority = 'normal', notes = '', checklist = [], done = false, createdAt = Date.now() }) {
    this.id = id ?? crypto.randomUUID();
    this.title = title?.trim() || 'Untitled';
    this.description = description;
    this.dueDate = dueDate; // ISO string or null
    this.priority = priority; // 'low' | 'normal' | 'high' | 'urgent'
    this.notes = notes;
    this.checklist = checklist;
    this.done = done;
    this.createdAt = createdAt;
    this.updatedAt = Date.now();
  }

  toggle() { this.done = !this.done; this.touch(); }
  update(fields = {}) { Object.assign(this, fields); this.touch(); }
  touch() { this.updatedAt = Date.now(); }
}