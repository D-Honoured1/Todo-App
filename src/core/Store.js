// Persistence boundary. Swappable (e.g., to IndexedDB) if needed.
export class Store {
  constructor(namespace = 'app') {
    this.ns = namespace;
  }

  load() {
    try {
      const raw = localStorage.getItem(this.ns);
      if (!raw) return null; // handle missing gracefully
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Failed to load state, ignoring…', e);
      return null;
    }
  }

  save(state) {
    try {
      localStorage.setItem(this.ns, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state', e);
    }
  }
}