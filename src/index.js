import './styles/style.css';
import { ProjectService } from './core/ProjectService';
import { Store } from './core/Store';
import { mountApp } from './ui/dom';

// Boot sequence: load state → ensure defaults → mount UI
const store = new Store('modular-todo/v1');
const service = new ProjectService(store);


service.init(); // ensures default project and seed data if empty


mountApp({ service });