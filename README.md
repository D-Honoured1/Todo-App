# 📌 Modular Todo List App

A clean, modular **Todo List application** built with **JavaScript (ES Modules)** and bundled using **Webpack**.  
Supports **multiple projects**, persistent data storage via **localStorage**, and a responsive UI with animations.

---

## 🚀 Features
- ✅ Create, edit, and delete todos  
- 📂 Multiple projects (with a default project on first load)  
- 📝 Todo properties:  
  - Title  
  - Description  
  - Due date (formatted with **date-fns**)  
  - Priority (color coded)  
  - Optional notes & checklist  
- 🎯 Mark todos as complete  
- 🔄 LocalStorage persistence (saves automatically)  
- 🎨 Clean, responsive UI with icons & animations  
- 🔍 Filter/sort by priority or due date  

---

## 🛠️ Tech Stack
- **JavaScript (ES Modules)**  
- **Webpack 5** (bundling & dev server)  
- **date-fns** (date formatting)  
- **localStorage** (data persistence)  
- **CSS3 / Flexbox / Grid** for layout  

---

## 📂 Project Structure
.
├── dist/ # Production-ready output (after build)
├── src/
│ ├── core/ # Application logic (Todo, Project, Storage)
│ ├── ui/ # DOM manipulation & UI handling
│ ├── styles/ # CSS files
│ ├── utils/ # Helper functions (e.g., date formatting)
│ └── index.js # Entry point
├── package.json
├── webpack.config.js
└── README.md