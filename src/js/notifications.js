/* ========================================
   Notifications — CampusNova
   ======================================== */

const Notifications = {
  currentFilter: 'all',

  render() {
    const notifications = Storage.get('notifications') || [];
    const unreadCount = notifications.filter(n => !n.read).length;
    const filters = ['all', 'unread', 'team-invite', 'deadline', 'message'];

    let filtered = notifications;
    if (this.currentFilter === 'unread') {
      filtered = notifications.filter(n => !n.read);
    } else if (this.currentFilter !== 'all') {
      filtered = notifications.filter(n => n.type === this.currentFilter);
    }

    const filterLabels = {
      all: 'All', unread: `Unread (${unreadCount})`, 'team-invite': 'Team Invites', deadline: 'Deadlines', message: 'Messages'
    };

    const content = document.getElementById('main-content');
    content.innerHTML = `
      <div class="notifications-container">
        <div class="page-header">
          <div class="page-header-row">
            <div>
              <h1 class="page-title">Notifications</h1>
              <p class="page-subtitle">${unreadCount > 0 ? `You have ${unreadCount} unread notification(s)` : 'You\'re all caught up!'}</p>
            </div>
            ${unreadCount > 0 ? `
              <button class="btn btn-secondary" onclick="Notifications.markAllRead()">
                ${Icons.checkCircle} Mark All as Read
              </button>
            ` : ''}
          </div>
        </div>

        <div class="filter-pills" style="margin-bottom:var(--space-6)">
          ${filters.map(f => `
            <button class="filter-pill ${this.currentFilter === f ? 'active' : ''}" onclick="Notifications.setFilter('${f}')">
              ${filterLabels[f] || f}
            </button>
          `).join('')}
        </div>

        ${filtered.length > 0 ? `
          <div class="notifications-page-list">
            ${filtered.map(n => this.renderNotificationCard(n)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">${Icons.bell}</div>
            <p class="empty-state-title">No notifications</p>
            <p class="empty-state-text">You have no notifications in this category.</p>
          </div>
        `}
      </div>
    `;
  },

  setFilter(f) {
    this.currentFilter = f;
    this.render();
  },

  renderNotificationCard(n) {
    const iconMap = {
      'team-invite': { bg: 'var(--primary-lighter)', color: 'var(--primary)', icon: Icons.userPlus },
      'task-assigned': { bg: 'var(--warning-light)', color: 'var(--warning-dark)', icon: Icons.checkSquare },
      'deadline': { bg: 'var(--danger-light)', color: 'var(--danger-dark)', icon: Icons.clock },
      'message': { bg: 'var(--info-light)', color: 'var(--info)', icon: Icons.messageSquare },
      'announcement': { bg: 'var(--success-light)', color: 'var(--success-dark)', icon: Icons.clipboard },
      'resource': { bg: 'var(--primary-lighter)', color: 'var(--primary)', icon: Icons.fileText }
    };
    const style = iconMap[n.type] || iconMap['announcement'];

    return `
      <div class="notification-card ${n.read ? 'read' : 'unread'}">
        <div class="notification-card-icon" style="background:${style.bg};color:${style.color}">
          ${style.icon}
        </div>
        <div class="notification-card-content">
          <div class="notification-card-top">
            <h4 class="notification-card-title">${Utils.escapeHtml(n.title)}</h4>
            <span class="notification-card-time">${Icons.clock} ${Utils.formatRelativeTime(n.time)}</span>
          </div>
          <p class="notification-card-text">${Utils.escapeHtml(n.message)}</p>
          <div class="notification-card-actions">
            ${!n.read ? `<button class="btn btn-sm btn-ghost" onclick="event.stopPropagation(); Notifications.markRead('${n.id}')">${Icons.checkCircle} Mark read</button>` : ''}
            ${n.link ? `<button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); Router.navigate('${n.link}')">View Details</button>` : ''}
          </div>
        </div>
      </div>
    `;
  },

  markRead(id) {
    const notifications = Storage.get('notifications') || [];
    const notif = notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      Storage.set('notifications', notifications);
      this.render();
      App.updateNotificationCount();
    }
  },

  markAllRead() {
    const notifications = Storage.get('notifications') || [];
    notifications.forEach(n => n.read = true);
    Storage.set('notifications', notifications);
    Toast.success('All notifications marked as read.');
    this.render();
    App.updateNotificationCount();
  },

  getUnreadCount() {
    const notifications = Storage.get('notifications') || [];
    return notifications.filter(n => !n.read).length;
  }
};
