/* ========================================
   Dashboard — CampusNova
   ======================================== */

const Dashboard = {
  render() {
    const user = AppState.getUser();
    const teams = Storage.get('teams') || [];
    const tasks = Storage.get('tasks') || [];
    const notifications = Storage.get('notifications') || [];
    const notices = Storage.get('notices') || [];
    const users = Storage.get('users') || [];

    const myTeams = teams.filter(t => t.members.includes(user.id));
    const myTasks = tasks.filter(t => t.assignee === user.id && t.status !== 'completed');
    const unreadNotifs = notifications.filter(n => !n.read);
    const upcomingDeadlines = myTasks.filter(t => Utils.daysUntil(t.deadline) <= 7 && Utils.daysUntil(t.deadline) >= 0);

    const content = document.getElementById('main-content');
    content.innerHTML = `
      <div class="dashboard-greeting">
        <h1>${Utils.getGreeting()}, ${user.name.split(' ')[0]}</h1>
        <p>Here's what's happening with your academic collaboration.</p>
      </div>

      <!-- Quick Stats -->
      <div class="dashboard-stats">
        ${this.renderStatCard('Active Teams', myTeams.length, Icons.users, 'var(--primary-lighter)', 'var(--primary)')}
        ${this.renderStatCard('Pending Tasks', myTasks.length, Icons.checkSquare, 'var(--warning-light)', 'var(--warning)')}
        ${this.renderStatCard('Upcoming Deadlines', upcomingDeadlines.length, Icons.calendar, 'var(--danger-light)', 'var(--danger)')}
        ${this.renderStatCard('Unread Notifications', unreadNotifs.length, Icons.bell, 'var(--success-light)', 'var(--success)')}
      </div>

      <div class="dashboard-grid">
        <!-- Left Column -->
        <div>
          <!-- My Projects -->
          <div class="section-card" style="margin-bottom: var(--space-6)">
            <div class="section-card-header">
              <h3 class="section-card-title">My Projects</h3>
              <button class="btn btn-sm btn-secondary" onclick="Router.navigate('/teams')">View All</button>
            </div>
            <div class="section-card-body">
              ${myTeams.length > 0 ? myTeams.map(team => this.renderProjectCard(team, users)).join('') : `
                <div class="empty-state">
                  <div class="empty-state-icon">${Icons.users}</div>
                  <p class="empty-state-title">No teams yet</p>
                  <p class="empty-state-text">Join or create a team to start collaborating.</p>
                  <button class="btn btn-primary btn-sm" onclick="Router.navigate('/teams')">Find a Team</button>
                </div>
              `}
            </div>
          </div>

          <!-- Upcoming Tasks -->
          <div class="section-card">
            <div class="section-card-header">
              <h3 class="section-card-title">Upcoming Tasks</h3>
              <button class="btn btn-sm btn-secondary" onclick="Router.navigate('/tasks')">View All</button>
            </div>
            <div class="section-card-body">
              ${myTasks.length > 0 ? myTasks.slice(0, 5).map(task => {
                const team = teams.find(t => t.id === task.teamId);
                return this.renderTaskRow(task, team);
              }).join('') : `
                <div class="empty-state">
                  <div class="empty-state-icon">${Icons.checkSquare}</div>
                  <p class="empty-state-title">No pending tasks</p>
                  <p class="empty-state-text">You're all caught up!</p>
                </div>
              `}
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div>
          <!-- Recent Notifications -->
          <div class="section-card" style="margin-bottom: var(--space-6)">
            <div class="section-card-header">
              <h3 class="section-card-title">Recent Notifications</h3>
              <button class="btn btn-sm btn-secondary" onclick="Router.navigate('/notifications')">View All</button>
            </div>
            <div class="section-card-body" style="padding: var(--space-2)">
              ${notifications.slice(0, 4).map(n => this.renderNotificationItem(n)).join('')}
            </div>
          </div>

          <!-- Notice Board Preview -->
          <div class="section-card" style="margin-bottom: var(--space-6)">
            <div class="section-card-header">
              <h3 class="section-card-title">Notice Board</h3>
              <button class="btn btn-sm btn-secondary" onclick="Router.navigate('/noticeboard')">View All</button>
            </div>
            <div class="section-card-body">
              ${notices.slice(0, 3).map(n => `
                <div style="padding: var(--space-2) 0; border-bottom: 1px solid var(--border-light);">
                  <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:2px">
                    ${this.getNoticeCategoryBadge(n.category)}
                    <span style="font-size:var(--text-xs);color:var(--text-muted)">${Utils.formatDate(n.date)}</span>
                  </div>
                  <p style="font-size:var(--text-sm);font-weight:600;color:var(--text)">${Utils.escapeHtml(n.title)}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Recommended Teammates -->
          <div class="section-card">
            <div class="section-card-header">
              <h3 class="section-card-title">Recommended Teammates</h3>
            </div>
            <div class="section-card-body" style="display:flex;flex-direction:column;gap:var(--space-3)">
              ${this.getRecommendedTeammates(user, users).map(u => `
                <div class="teammate-card">
                  ${Utils.renderAvatar(u.name, 'sm')}
                  <div class="teammate-info">
                    <p class="teammate-name">${Utils.escapeHtml(u.name)}</p>
                    <p class="teammate-department">${u.department} · ${u.skills.slice(0, 2).join(', ')}</p>
                  </div>
                  <button class="btn btn-sm btn-secondary" onclick="Router.navigate('/profile/${u.id}')">View</button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderStatCard(label, value, icon, bgColor, iconColor) {
    return `
      <div class="stat-card">
        <div class="stat-card-icon" style="background:${bgColor}; color:${iconColor}">
          ${icon}
        </div>
        <div>
          <div class="stat-card-value">${value}</div>
          <div class="stat-card-label">${label}</div>
        </div>
      </div>
    `;
  },

  renderProjectCard(team, users) {
    const lead = users.find(u => u.id === team.leadId);
    const daysLeft = Utils.daysUntil(team.deadline);
    const progressClass = team.progress >= 80 ? 'success' : team.progress >= 50 ? '' : 'warning';

    return `
      <div class="project-card" style="margin-bottom: var(--space-4)">
        <div class="project-card-header">
          <div>
            <p class="project-card-title">${Utils.escapeHtml(team.project)}</p>
            <p class="project-card-course">${Utils.escapeHtml(team.course)}</p>
          </div>
          ${Utils.renderStatusBadge(team.status)}
        </div>
        <div class="project-card-meta">
          <span class="project-card-meta-item">
            ${Icons.users}<span>${team.members.length} members</span>
          </span>
          <span class="project-card-meta-item">
            ${Icons.calendar}<span>${daysLeft > 0 ? daysLeft + ' days left' : 'Overdue'}</span>
          </span>
        </div>
        <div class="project-card-progress">
          <div class="project-card-progress-header">
            <span>Progress</span>
            <span>${team.progress}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill ${progressClass}" style="width:${team.progress}%"></div>
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-sm btn-primary" onclick="Router.navigate('/teams/${team.id}')">Open Team</button>
        </div>
      </div>
    `;
  },

  renderTaskRow(task, team) {
    const daysLeft = Utils.daysUntil(task.deadline);
    const deadlineClass = daysLeft <= 2 ? 'color:var(--danger)' : daysLeft <= 5 ? 'color:var(--warning)' : '';

    return `
      <div class="task-row">
        <span class="task-row-title">${Utils.escapeHtml(task.title)}</span>
        <span class="task-row-project">${team ? Utils.escapeHtml(team.name) : ''}</span>
        ${Utils.renderPriorityBadge(task.priority)}
        <span class="task-row-deadline" style="${deadlineClass}">${Utils.formatDate(task.deadline)}</span>
        ${Utils.renderStatusBadge(task.status)}
      </div>
    `;
  },

  renderNotificationItem(n) {
    const iconMap = {
      'team-invite': { bg: 'var(--primary-lighter)', color: 'var(--primary)', icon: Icons.userPlus },
      'task-assigned': { bg: 'var(--warning-light)', color: 'var(--warning)', icon: Icons.checkSquare },
      'deadline': { bg: 'var(--danger-light)', color: 'var(--danger)', icon: Icons.clock },
      'message': { bg: 'var(--info-light)', color: 'var(--info)', icon: Icons.messageSquare },
      'announcement': { bg: 'var(--success-light)', color: 'var(--success)', icon: Icons.clipboard },
      'resource': { bg: 'var(--primary-lighter)', color: 'var(--primary)', icon: Icons.fileText }
    };
    const style = iconMap[n.type] || iconMap['announcement'];

    return `
      <div class="notification-item ${n.read ? '' : 'unread'}" onclick="if('${n.link}') Router.navigate('${n.link}')">
        <div class="notification-icon" style="background:${style.bg};color:${style.color}">
          ${style.icon}
        </div>
        <div class="notification-content">
          <p class="notification-title">${Utils.escapeHtml(n.title)}</p>
          <p class="notification-text">${Utils.escapeHtml(n.message)}</p>
        </div>
        <span class="notification-time">${Utils.formatRelativeTime(n.time)}</span>
      </div>
    `;
  },

  getNoticeCategoryBadge(category) {
    const map = {
      announcement: 'badge-info',
      event: 'badge-primary',
      deadline: 'badge-danger',
      important: 'badge-warning'
    };
    return `<span class="badge ${map[category] || 'badge-neutral'}">${category}</span>`;
  },

  getRecommendedTeammates(currentUser, allUsers) {
    return allUsers
      .filter(u => u.id !== currentUser.id && u.role === 'student' && u.availability !== 'busy')
      .sort((a, b) => {
        const aMatch = a.skills.filter(s => currentUser.skills.includes(s)).length;
        const bMatch = b.skills.filter(s => currentUser.skills.includes(s)).length;
        return bMatch - aMatch;
      })
      .slice(0, 3);
  }
};
