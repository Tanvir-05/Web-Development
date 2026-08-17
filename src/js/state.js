/* ========================================
   Application State — CampusNova
   ======================================== */

const AppState = {
  currentUser: null,
  theme: 'light',
  sidebarOpen: false,
  currentPage: 'login',

  setUser(user) {
    this.currentUser = user;
    Storage.set('user', user);
  },

  getUser() {
    if (!this.currentUser) {
      this.currentUser = Storage.get('user');
    }
    return this.currentUser;
  },

  isLoggedIn() {
    return !!this.getUser();
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  },

  logout() {
    this.currentUser = null;
    Storage.remove('user');
  },

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    Storage.set('settings_theme', theme);
    
    // Update theme toggle icon if present
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? Icons.sun : Icons.moon;
    }
  },

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  },

  loadTheme() {
    const saved = Storage.get('settings_theme');
    if (saved) {
      this.setTheme(saved);
    }
  }
};
