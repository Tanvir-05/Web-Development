/* ========================================
   App — CampusNova
   Main entry point
   ======================================== */

const App = {
  init() {
    // Initialize mock data
    MockData.init();

    // Load theme
    AppState.loadTheme();

    // Register routes
    this.registerRoutes();

    // Start router
    Router.init();
  },

  registerRoutes() {
    Router.on('/login', () => Auth.renderLogin());
    Router.on('/register', () => Auth.renderRegister());

    Router.on('/dashboard', () => { this.renderShell('Dashboard'); Dashboard.render(); });
    Router.on('/profile', () => { this.renderShell('My Profile'); Profile.render(); });
    Router.on('/profile/:id', (params) => { this.renderShell('Profile'); Profile.render(params); });
    Router.on('/search', () => { this.renderShell('Search & Discovery'); Search.render(); });
    Router.on('/teams', () => { this.renderShell('My Teams'); Teams.render(); });
    Router.on('/teams/:id', (params) => { this.renderShell('Team Details'); Teams.renderDetail(params); });
    Router.on('/tasks', () => { this.renderShell('Task Board'); Tasks.render(); });
    Router.on('/resources', () => { this.renderShell('Resources'); Notes.render(); });
    Router.on('/messages', () => { this.renderShell('Messages'); Chat.render(); });
    Router.on('/chatbot', () => { this.renderShell('CampusNova Assistant'); Chatbot.render(); });
    Router.on('/noticeboard', () => { this.renderShell('Notice Board'); Noticeboard.render(); });
    Router.on('/notifications', () => { this.renderShell('Notifications'); Notifications.render(); });
    Router.on('/settings', () => { this.renderShell('Settings'); this.renderSettings(); });
    Router.on('/admin', () => { this.renderShell('Admin Dashboard'); Admin.render(); });
    Router.on('/suggestions', () => { this.renderShell('Smart Suggestions'); AutoGeneration.render(); });
  },

  renderShell(pageTitle) {
    const app = document.getElementById('app');
    const user = AppState.getUser();
    if (!user) return;

    const isAdmin = user.role === 'admin';
    const unreadCount = Notifications.getUnreadCount();

    // Only re-render shell if not already present
    if (!document.getElementById('main-content')) {
      app.innerHTML = `
        <!-- Sidebar Overlay -->
        <div class="sidebar-overlay" id="sidebar-overlay" onclick="App.toggleSidebar()"></div>

        <div class="app-shell">
          <!-- Sidebar -->
          <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
              <div class="sidebar-logo">CN</div>
              <div class="sidebar-brand">
                <span class="sidebar-brand-name">CampusNova</span>
                <span class="sidebar-brand-tagline">Collaboration Hub</span>
              </div>
            </div>

            <nav class="sidebar-nav">
              <div class="sidebar-section-label">Main</div>
              ${this.navItem('/dashboard', Icons.dashboard, 'Dashboard')}
              ${this.navItem('/profile', Icons.user, 'My Profile')}
              ${this.navItem('/search', Icons.search, 'Search')}
              ${this.navItem('/teams', Icons.users, 'My Teams')}
              ${this.navItem('/tasks', Icons.checkSquare, 'Tasks')}
              ${this.navItem('/resources', Icons.fileText, 'Resources')}

              <div class="sidebar-section-label">Communication</div>
              ${this.navItem('/messages', Icons.messageSquare, 'Messages')}
              ${this.navItem('/chatbot', Icons.bot, 'Chatbot')}
              ${this.navItem('/noticeboard', Icons.clipboard, 'Notice Board')}
              ${this.navItem('/notifications', Icons.bell, 'Notifications', unreadCount)}

              <div class="sidebar-section-label">Discover</div>
              ${this.navItem('/suggestions', Icons.zap, 'Smart Suggestions')}

              ${isAdmin ? `
                <div class="sidebar-section-label">Administration</div>
                ${this.navItem('/admin', Icons.shield, 'Admin Dashboard')}
              ` : ''}
            </nav>

            <div class="sidebar-bottom">
              ${this.navItem('/settings', Icons.settings, 'Settings')}
              <button class="sidebar-nav-item" onclick="Auth.logout()" style="width:100%">
                <span class="nav-icon">${Icons.logOut}</span>
                <span>Logout</span>
              </button>
            </div>
          </aside>

          <!-- Main Wrapper -->
          <div class="main-wrapper">
            <!-- Header -->
            <header class="header" id="app-header">
              <div class="header-left">
                <button class="header-menu-btn" onclick="App.toggleSidebar()">
                  ${Icons.menu}
                </button>
                <h2 class="header-title" id="header-title">${pageTitle}</h2>
              </div>

              <div class="header-right">
                <button class="header-icon-btn" id="theme-toggle-btn" onclick="AppState.toggleTheme()" title="Toggle Dark Mode">
                  ${AppState.theme === 'dark' ? Icons.sun : Icons.moon}
                </button>
                <button class="header-icon-btn" onclick="Router.navigate('/search')" title="Search">
                  ${Icons.search}
                </button>
                <button class="header-icon-btn" onclick="Router.navigate('/notifications')" title="Notifications">
                  ${Icons.bell}
                  ${unreadCount > 0 ? `<span class="header-notification-count">${unreadCount}</span>` : ''}
                </button>

                <div class="header-user dropdown" id="header-user-dropdown">
                  <div onclick="App.toggleUserDropdown()">
                    <div style="display:flex;align-items:center;gap:var(--space-2)">
                      ${Utils.renderAvatar(user.name, 'sm')}
                      <div class="header-user-info">
                        <span class="header-user-name">${Utils.escapeHtml(user.name)}</span>
                        <span class="header-user-role">${user.role === 'admin' ? 'Administrator' : 'Student'}</span>
                      </div>
                    </div>
                  </div>
                  <div class="dropdown-menu" id="user-dropdown-menu">
                    <button class="dropdown-item" onclick="Router.navigate('/profile'); App.closeDropdowns()">
                      ${Icons.user} Profile
                    </button>
                    <button class="dropdown-item" onclick="Router.navigate('/settings'); App.closeDropdowns()">
                      ${Icons.settings} Settings
                    </button>
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item danger" onclick="Auth.logout()">
                      ${Icons.logOut} Logout
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <!-- Main Content -->
            <main class="main-content" id="main-content"></main>
          </div>
        </div>
      `;

      // Close dropdowns on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#header-user-dropdown')) {
          this.closeDropdowns();
        }
      });
    } else {
      // Just update the header title
      const headerTitle = document.getElementById('header-title');
      if (headerTitle) headerTitle.textContent = pageTitle;
      this.updateNotificationCount();
    }
  },

  navItem(route, icon, label, badge = 0) {
    return `
      <button class="sidebar-nav-item" data-route="${route}" onclick="Router.navigate('${route}'); App.closeSidebar()">
        <span class="nav-icon">${icon}</span>
        <span>${label}</span>
        ${badge > 0 ? `<span class="nav-badge">${badge}</span>` : ''}
      </button>
    `;
  },

  updateShell() {
    // Force re-render of shell on next navigation
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.parentElement.parentElement.remove();
      const overlay = document.getElementById('sidebar-overlay');
      if (overlay) overlay.remove();
    }
  },

  updateNotificationCount() {
    const count = Notifications.getUnreadCount();
    // Update header bell
    const bellBtns = document.querySelectorAll('.header-icon-btn');
    bellBtns.forEach(btn => {
      if (btn.title === 'Notifications') {
        const existing = btn.querySelector('.header-notification-count');
        if (existing) existing.remove();
        if (count > 0) {
          btn.insertAdjacentHTML('beforeend', `<span class="header-notification-count">${count}</span>`);
        }
      }
    });

    // Update sidebar badge
    const navItems = document.querySelectorAll('.sidebar-nav-item[data-route="/notifications"]');
    navItems.forEach(item => {
      const existing = item.querySelector('.nav-badge');
      if (existing) existing.remove();
      if (count > 0) {
        item.insertAdjacentHTML('beforeend', `<span class="nav-badge">${count}</span>`);
      }
    });
  },

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
  },

  closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
  },

  toggleUserDropdown() {
    const menu = document.getElementById('user-dropdown-menu');
    if (menu) menu.classList.toggle('show');
  },

  closeDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
  },

  renderSettings() {
    const user = AppState.getUser();
    const settings = Storage.get('settings') || MockData.defaultSettings;
    const currentTheme = Storage.get('settings_theme') || 'light';

    const content = document.getElementById('main-content');
    content.innerHTML = `
      <div class="settings-container">
        <div class="page-header">
          <div class="page-header-row">
            <div>
              <h1 class="page-title">Settings</h1>
              <p class="page-subtitle">Manage your Daffodil International University account and preferences</p>
            </div>
          </div>
        </div>

        <!-- Profile / Account -->
        <div class="settings-section-card">
          <div class="settings-section-header">
            <div class="settings-header-icon" style="background:var(--primary-lighter);color:var(--primary)">${Icons.user}</div>
            <div>
              <h3 class="settings-section-title">Account Profile</h3>
              <p class="settings-section-sub">Your personal student details</p>
            </div>
          </div>
          <div class="settings-section-body">
            <div class="settings-row">
              <div>
                <span class="settings-row-label">Full Name</span>
                <p class="settings-row-desc">${Utils.escapeHtml(user.name)}</p>
              </div>
              <button class="btn btn-sm btn-secondary" onclick="Router.navigate('/profile')">Edit Profile</button>
            </div>
            <div class="settings-row">
              <div>
                <span class="settings-row-label">Institutional Email</span>
                <p class="settings-row-desc">${Utils.escapeHtml(user.email)}</p>
              </div>
              <span class="badge badge-success">Verified</span>
            </div>
            <div class="settings-row">
              <div>
                <span class="settings-row-label">University & Batch</span>
                <p class="settings-row-desc">${Utils.escapeHtml(user.university || 'Daffodil International University')} · ${user.batch || 'Batch 43'}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Appearance (Theme Cards) -->
        <div class="settings-section-card">
          <div class="settings-section-header">
            <div class="settings-header-icon" style="background:var(--info-light);color:var(--info)">${Icons.sun}</div>
            <div>
              <h3 class="settings-section-title">Appearance</h3>
              <p class="settings-section-sub">Customize how CampusNova looks for you</p>
            </div>
          </div>
          <div class="settings-section-body">
            <div class="theme-selector-grid">
              <div class="theme-card ${currentTheme === 'light' ? 'active' : ''}" onclick="AppState.setTheme('light'); App.renderSettings()">
                <div class="theme-card-preview light">
                  <div class="theme-preview-header"></div>
                  <div class="theme-preview-body"></div>
                </div>
                <div class="theme-card-label">
                  ${Icons.sun} Light Theme
                </div>
              </div>
              <div class="theme-card ${currentTheme === 'dark' ? 'active' : ''}" onclick="AppState.setTheme('dark'); App.renderSettings()">
                <div class="theme-card-preview dark">
                  <div class="theme-preview-header"></div>
                  <div class="theme-preview-body"></div>
                </div>
                <div class="theme-card-label">
                  ${Icons.moon} Dark Theme
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div class="settings-section-card">
          <div class="settings-section-header">
            <div class="settings-header-icon" style="background:var(--warning-light);color:var(--warning-dark)">${Icons.bell}</div>
            <div>
              <h3 class="settings-section-title">Notification Preferences</h3>
              <p class="settings-section-sub">Control how you get notified</p>
            </div>
          </div>
          <div class="settings-section-body">
            <div class="settings-row">
              <div>
                <span class="settings-row-label">Email Notifications</span>
                <p class="settings-row-desc">Receive email digests for team invites & system updates</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" ${settings.emailNotifications ? 'checked' : ''} onchange="App.updateSetting('emailNotifications', this.checked)">
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="settings-row">
              <div>
                <span class="settings-row-label">Task Reminders</span>
                <p class="settings-row-desc">Get notified 24h before task deadlines</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" ${settings.taskReminders ? 'checked' : ''} onchange="App.updateSetting('taskReminders', this.checked)">
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="settings-row">
              <div>
                <span class="settings-row-label">Announcement Alerts</span>
                <p class="settings-row-desc">Instant alerts when faculty posts new notices</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" ${settings.announcementNotifications ? 'checked' : ''} onchange="App.updateSetting('announcementNotifications', this.checked)">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Data & System Reset -->
        <div class="settings-section-card">
          <div class="settings-section-header">
            <div class="settings-header-icon" style="background:var(--danger-light);color:var(--danger-dark)">${Icons.trash}</div>
            <div>
              <h3 class="settings-section-title">System & Data</h3>
              <p class="settings-section-sub">Manage prototype data state</p>
            </div>
          </div>
          <div class="settings-section-body">
            <div class="settings-row">
              <div>
                <span class="settings-row-label">Reset Prototype Data</span>
                <p class="settings-row-desc">Restore mock teams, tasks, and users to original state</p>
              </div>
              <button class="btn btn-sm btn-danger" onclick="if(confirm('Reset all demo data to default values?')) { MockData.reset(); Auth.logout(); }">Reset Demo Data</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  updateSetting(key, value) {
    const settings = Storage.get('settings') || MockData.defaultSettings;
    settings[key] = value;
    Storage.set('settings', settings);
    Toast.success('Setting updated.');
  }
};

// Start the application
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
