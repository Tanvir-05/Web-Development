/* ========================================
   Admin Dashboard — CampusNova
   ======================================== */

const Admin = {
  currentTab: 'overview',

  render() {
    if (!AppState.isAdmin()) {
      document.getElementById('main-content').innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${Icons.shield}</div>
          <p class="empty-state-title">Access Denied</p>
          <p class="empty-state-text">You need administrator privileges to access this page.</p>
          <button class="btn btn-primary btn-sm" onclick="Router.navigate('/dashboard')">Go to Dashboard</button>
        </div>
      `;
      return;
    }

    const users = Storage.get('users') || [];
    const teams = Storage.get('teams') || [];
    const reports = Storage.get('reports') || [];
    const notices = Storage.get('notices') || [];
    const students = users.filter(u => u.role === 'student');
    const pendingReports = reports.filter(r => r.status === 'pending');

    const content = document.getElementById('main-content');
    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-row">
          <div>
            <h1 class="page-title">Admin Dashboard</h1>
            <p class="page-subtitle">Daffodil International University system administration and moderation</p>
          </div>
          <button class="btn btn-primary" onclick="Noticeboard.showCreateModal()">
            ${Icons.plus} Post Notice
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="admin-stats-grid">
        ${this.renderStatCard('Total Students', students.length, Icons.users, 'var(--primary-lighter)', 'var(--primary)')}
        ${this.renderStatCard('Active Teams', teams.length, Icons.users, 'var(--success-light)', 'var(--success-dark)')}
        ${this.renderStatCard('Pending Reports', pendingReports.length, Icons.flag, 'var(--danger-light)', 'var(--danger-dark)')}
        ${this.renderStatCard('Published Notices', notices.length, Icons.clipboard, 'var(--warning-light)', 'var(--warning-dark)')}
      </div>

      <!-- Tabs -->
      <div class="tabs admin-tabs-bar" id="admin-tabs">
        <button class="tab-item ${this.currentTab === 'overview' ? 'active' : ''}" onclick="Admin.switchTab('overview')">${Icons.users} User Management</button>
        <button class="tab-item ${this.currentTab === 'moderation' ? 'active' : ''}" onclick="Admin.switchTab('moderation')">${Icons.flag} Content Moderation</button>
        <button class="tab-item ${this.currentTab === 'notices' ? 'active' : ''}" onclick="Admin.switchTab('notices')">${Icons.clipboard} Notice Management</button>
        <button class="tab-item ${this.currentTab === 'system' ? 'active' : ''}" onclick="Admin.switchTab('system')">${Icons.shield} System Monitoring</button>
      </div>

      <div id="admin-tab-content">
        ${this.renderTabContent()}
      </div>
    `;
  },

  renderStatCard(label, value, icon, bgColor, iconColor) {
    return `
      <div class="admin-stat-card">
        <div class="admin-stat-icon" style="background:${bgColor};color:${iconColor}">${icon}</div>
        <div class="admin-stat-info">
          <div class="admin-stat-value">${value}</div>
          <div class="admin-stat-label">${label}</div>
        </div>
      </div>
    `;
  },

  switchTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('#admin-tabs .tab-item').forEach(t => t.classList.remove('active'));
    document.querySelector(`#admin-tabs .tab-item:nth-child(${['overview', 'moderation', 'notices', 'system'].indexOf(tab) + 1})`).classList.add('active');
    document.getElementById('admin-tab-content').innerHTML = this.renderTabContent();
  },

  renderTabContent() {
    switch (this.currentTab) {
      case 'overview': return this.renderUserManagement();
      case 'moderation': return this.renderModeration();
      case 'notices': return this.renderNoticeManagement();
      case 'system': return this.renderSystemMonitoring();
      default: return '';
    }
  },

  renderUserManagement() {
    const users = Storage.get('users') || [];

    return `
      <div class="section-card">
        <div class="section-card-body" style="padding:0;overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Department</th><th>Role</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:var(--space-2)">
                      ${Utils.renderAvatar(u.name, 'xs')}
                      <span style="font-weight:600;color:var(--text)">${Utils.escapeHtml(u.name)}</span>
                    </div>
                  </td>
                  <td>${Utils.escapeHtml(u.email)}</td>
                  <td>${Utils.escapeHtml(u.department)}</td>
                  <td><span class="badge ${u.role === 'admin' ? 'badge-primary' : 'badge-neutral'}">${u.role}</span></td>
                  <td>${Utils.renderStatusBadge(u.status)}</td>
                  <td>
                    <div style="display:flex;gap:var(--space-1)">
                      <button class="btn btn-sm btn-ghost" onclick="Router.navigate('/profile/${u.id}')">View</button>
                      ${u.role !== 'admin' ? `
                        ${u.status === 'active' ?
                          `<button class="btn btn-sm btn-ghost" style="color:var(--warning)" onclick="Admin.toggleUserStatus('${u.id}', 'suspended')">Suspend</button>` :
                          `<button class="btn btn-sm btn-ghost" style="color:var(--success)" onclick="Admin.toggleUserStatus('${u.id}', 'active')">Activate</button>`
                        }
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  toggleUserStatus(userId, newStatus) {
    const users = Storage.get('users') || [];
    const user = users.find(u => u.id === userId);
    if (user) {
      user.status = newStatus;
      Storage.set('users', users);
      Toast.success(`User ${newStatus === 'suspended' ? 'suspended' : 'activated'}.`);
      this.render();
    }
  },

  renderModeration() {
    const reports = Storage.get('reports') || [];
    const users = Storage.get('users') || [];

    return `
      <div style="display:flex;flex-direction:column;gap:var(--space-3)">
        ${reports.length > 0 ? reports.map(r => {
          const reporter = users.find(u => u.id === r.reportedBy);
          const reported = users.find(u => u.id === r.reportedUser);
          return `
            <div class="moderation-card">
              <div class="notification-icon" style="background:var(--danger-light);color:var(--danger)">${Icons.flag}</div>
              <div class="moderation-card-content">
                <p class="moderation-card-type">Report #${r.id.split('-')[1]} — ${Utils.escapeHtml(r.type)}</p>
                <p class="moderation-card-reason">Reason: ${Utils.escapeHtml(r.reason)}</p>
                <p style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px">${Utils.escapeHtml(r.content)}</p>
                <p style="font-size:var(--text-xs);color:var(--text-muted);margin-top:4px">
                  Reported by: ${reporter ? Utils.escapeHtml(reporter.name) : 'Unknown'} · ${Utils.formatDate(r.date)}
                </p>
              </div>
              <div>
                ${Utils.renderStatusBadge(r.status)}
              </div>
              <div class="moderation-card-actions">
                ${r.status === 'pending' ? `
                  <button class="btn btn-sm btn-secondary" onclick="Admin.resolveReport('${r.id}', 'resolved')">Review</button>
                  <button class="btn btn-sm btn-danger" onclick="Admin.resolveReport('${r.id}', 'resolved')">Remove</button>
                  <button class="btn btn-sm btn-ghost" onclick="Admin.resolveReport('${r.id}', 'dismissed')">Dismiss</button>
                ` : ''}
              </div>
            </div>
          `;
        }).join('') : `
          <div class="empty-state">
            <div class="empty-state-icon">${Icons.flag}</div>
            <p class="empty-state-title">No reports</p>
            <p class="empty-state-text">All content is clean!</p>
          </div>
        `}
      </div>
    `;
  },

  resolveReport(id, status) {
    const reports = Storage.get('reports') || [];
    const report = reports.find(r => r.id === id);
    if (report) {
      report.status = status;
      Storage.set('reports', reports);
      Toast.success(`Report ${status}.`);
      this.render();
    }
  },

  renderNoticeManagement() {
    const notices = Storage.get('notices') || [];

    const categoryMap = {
      announcement: { badge: 'badge-primary', icon: Icons.clipboard, label: 'Announcement', accent: 'var(--primary)' },
      event: { badge: 'badge-info', icon: Icons.calendar, label: 'Event', accent: 'var(--info)' },
      deadline: { badge: 'badge-danger', icon: Icons.clock, label: 'Deadline', accent: 'var(--danger-dark)' },
      important: { badge: 'badge-warning', icon: Icons.alertCircle, label: 'Important', accent: 'var(--warning-dark)' }
    };

    const priorityMap = {
      high: 'badge-danger', medium: 'badge-warning', low: 'badge-success'
    };

    return `
      <div class="admin-notice-header">
        <div>
          <h3 class="admin-notice-title">Notice Management</h3>
          <p class="admin-notice-sub">Publish, edit, or remove university announcements and events</p>
        </div>
        <button class="btn btn-primary btn-sm" onclick="Noticeboard.showCreateModal()">
          ${Icons.plus} Create New Notice
        </button>
      </div>

      ${notices.length > 0 ? `
        <div class="admin-notice-list">
          ${notices.map(n => {
            const cat = categoryMap[n.category] || categoryMap.announcement;
            const prioClass = priorityMap[n.priority] || 'badge-neutral';
            return `
              <div class="admin-notice-card" style="border-left: 4px solid ${cat.accent}">
                <div class="admin-notice-card-top">
                  <div class="admin-notice-card-left">
                    <div class="admin-notice-icon" style="background:${cat.accent}15; color:${cat.accent}">
                      ${cat.icon}
                    </div>
                    <div>
                      <h4 class="admin-notice-card-title">${Utils.escapeHtml(n.title)}</h4>
                      <div class="admin-notice-card-badges">
                        <span class="badge ${cat.badge}">${cat.label}</span>
                        <span class="badge ${prioClass}">${n.priority} priority</span>
                        <span class="admin-notice-date">${Icons.calendar} ${Utils.formatDate(n.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div class="admin-notice-card-actions">
                    <button class="btn btn-sm btn-secondary" onclick="Noticeboard.showEditModal('${n.id}')" title="Edit Notice">
                      ${Icons.edit} Edit
                    </button>
                    <button class="btn btn-sm btn-ghost" style="color:var(--danger-dark)" onclick="Noticeboard.deleteNotice('${n.id}'); Admin.render()" title="Delete Notice">
                      ${Icons.trash} Delete
                    </button>
                  </div>
                </div>
                <p class="admin-notice-card-desc">${Utils.escapeHtml(n.description)}</p>
                <div class="admin-notice-card-footer">
                  <span>Author: <strong>${Utils.escapeHtml(n.author)}</strong></span>
                  <span>ID: <code>${n.id}</code></span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">${Icons.clipboard}</div>
          <p class="empty-state-title">No notices posted</p>
          <p class="empty-state-text">Create your first notice to broadcast announcements to students.</p>
        </div>
      `}
    `;
  },

  renderSystemMonitoring() {
    return `
      <div class="system-status-grid">
        <div class="system-status-card">
          <span class="status-dot operational"></span>
          <div>
            <p class="system-status-label">Application Status</p>
            <p class="system-status-value">Operational</p>
          </div>
        </div>
        <div class="system-status-card">
          <span class="status-dot operational"></span>
          <div>
            <p class="system-status-label">Storage</p>
            <p class="system-status-value">Normal</p>
          </div>
        </div>
        <div class="system-status-card">
          <span class="status-dot operational"></span>
          <div>
            <p class="system-status-label">Notifications</p>
            <p class="system-status-value">Operational</p>
          </div>
        </div>
      </div>
      <div class="section-card" style="margin-top:var(--space-5)">
        <div class="section-card-header"><h3 class="section-card-title">System Information</h3></div>
        <div class="section-card-body">
          <div class="profile-field"><span class="profile-field-label">Application</span><span class="profile-field-value">CampusNova v1.0.0</span></div>
          <div class="profile-field"><span class="profile-field-label">Platform</span><span class="profile-field-value">Electron Desktop</span></div>
          <div class="profile-field"><span class="profile-field-label">Data Storage</span><span class="profile-field-value">localStorage (Prototype)</span></div>
          <div class="profile-field"><span class="profile-field-label">Last Updated</span><span class="profile-field-value">${Utils.formatDate(new Date().toISOString())}</span></div>
        </div>
      </div>
    `;
  }
};
