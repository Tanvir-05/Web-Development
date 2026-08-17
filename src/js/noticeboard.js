/* ========================================
   Notice Board — CampusNova
   ======================================== */

const Noticeboard = {
  currentFilter: 'all',

  render() {
    const notices = Storage.get('notices') || [];
    const isAdmin = AppState.isAdmin();
    const filters = ['all', 'announcement', 'event', 'deadline', 'important'];

    const filtered = this.currentFilter === 'all' ? notices : notices.filter(n => n.category === this.currentFilter);

    const content = document.getElementById('main-content');
    content.innerHTML = `
      <div class="noticeboard-container">
        <div class="page-header">
          <div class="page-header-row">
            <div>
              <h1 class="page-title">Notice Board</h1>
              <p class="page-subtitle">Official announcements, events, and academic deadlines from Daffodil International University</p>
            </div>
            ${isAdmin ? `<button class="btn btn-primary" onclick="Noticeboard.showCreateModal()">
              ${Icons.plus} Post New Notice
            </button>` : ''}
          </div>
        </div>

        <div class="filter-pills" style="margin-bottom:var(--space-6)">
          ${filters.map(f => `
            <button class="filter-pill ${this.currentFilter === f ? 'active' : ''}" onclick="Noticeboard.setFilter('${f}')">${f === 'all' ? 'All Notices' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          `).join('')}
        </div>

        ${filtered.length > 0 ? `
          <div class="notice-cards-list">
            ${filtered.map(n => this.renderNoticeCard(n, isAdmin)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">${Icons.clipboard}</div>
            <p class="empty-state-title">No notices found</p>
            <p class="empty-state-text">There are no notices in this category.</p>
          </div>
        `}
      </div>
    `;
  },

  setFilter(f) {
    this.currentFilter = f;
    this.render();
  },

  renderNoticeCard(notice, isAdmin) {
    const priorityMap = {
      high: { badge: 'badge-danger', label: 'High Priority' },
      medium: { badge: 'badge-warning', label: 'Medium Priority' },
      low: { badge: 'badge-success', label: 'Low Priority' }
    };
    const categoryMap = {
      announcement: { badge: 'badge-primary', icon: Icons.clipboard, label: 'Announcement', accent: 'var(--primary)' },
      event: { badge: 'badge-info', icon: Icons.calendar, label: 'Event', accent: 'var(--info)' },
      deadline: { badge: 'badge-danger', icon: Icons.clock, label: 'Deadline', accent: 'var(--danger-dark)' },
      important: { badge: 'badge-warning', icon: Icons.alertCircle, label: 'Important', accent: 'var(--warning-dark)' }
    };

    const cat = categoryMap[notice.category] || categoryMap.announcement;
    const prio = priorityMap[notice.priority] || priorityMap.medium;

    const authorRole = notice.author.includes('Shahin') ? '• Associate Professor'
      : (notice.author.includes('Office') ? '• University Office' : '• Faculty Member');

    return `
      <div class="notice-card" style="border-left: 4px solid ${cat.accent}">
        <div class="notice-card-header">
          <div class="notice-card-header-left">
            <div class="notice-card-icon" style="background:${cat.accent}15; color:${cat.accent}">
              ${cat.icon}
            </div>
            <div>
              <h3 class="notice-card-title">${Utils.escapeHtml(notice.title)}</h3>
              <div class="notice-card-badges">
                <span class="badge ${cat.badge}">${cat.label}</span>
                <span class="badge ${prio.badge}">${prio.label}</span>
              </div>
            </div>
          </div>
          ${isAdmin ? `
            <div class="notice-card-actions">
              <button class="btn btn-sm btn-secondary" onclick="Noticeboard.showEditModal('${notice.id}')" title="Edit Notice">
                ${Icons.edit} Edit
              </button>
              <button class="btn btn-sm btn-ghost" style="color:var(--danger-dark)" onclick="Noticeboard.deleteNotice('${notice.id}')" title="Delete Notice">
                ${Icons.trash} Delete
              </button>
            </div>
          ` : ''}
        </div>
        <p class="notice-card-body">${Utils.escapeHtml(notice.description)}</p>
        <div class="notice-card-footer">
          <div class="notice-card-author">
            ${Utils.renderAvatar(notice.author, 'xs')}
            <span class="notice-card-author-name">${Utils.escapeHtml(notice.author)}</span>
            <span class="notice-card-author-role">${authorRole}</span>
          </div>
          <div class="notice-card-date">
            ${Icons.calendar}
            <span>${Utils.formatDate(notice.date)}</span>
          </div>
        </div>
      </div>
    `;
  },

  showCreateModal() {
    const body = `
      <div class="form-group">
        <label class="form-label">Title</label>
        <input class="form-input" id="notice-title" placeholder="Notice title">
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-input" id="notice-desc" rows="4" placeholder="Write your announcement..."></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-select" id="notice-category">
            <option value="announcement">Announcement</option>
            <option value="event">Event</option>
            <option value="deadline">Deadline</option>
            <option value="important">Important</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Priority</label>
          <select class="form-select" id="notice-priority">
            <option value="low">Low</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="Noticeboard.createNotice()">Publish</button>
    `;

    Modal.show('Create Notice', body, footer);
  },

  createNotice() {
    const title = document.getElementById('notice-title').value.trim();
    const desc = document.getElementById('notice-desc').value.trim();
    const category = document.getElementById('notice-category').value;
    const priority = document.getElementById('notice-priority').value;

    if (!title || !desc) {
      Toast.error('Please fill in the title and description.');
      return;
    }

    const notices = Storage.get('notices') || [];
    notices.unshift({
      id: 'notice-' + Utils.generateId(),
      title, description: desc, category, priority,
      date: new Date().toISOString().split('T')[0],
      author: AppState.getUser().name,
      read: false
    });
    Storage.set('notices', notices);

    Modal.close();
    Toast.success('Notice published!');
    this.render();
  },

  showEditModal(id) {
    const notices = Storage.get('notices') || [];
    const notice = notices.find(n => n.id === id);
    if (!notice) return;

    const body = `
      <div class="form-group">
        <label class="form-label">Title</label>
        <input class="form-input" id="edit-notice-title" value="${Utils.escapeHtml(notice.title)}">
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-input" id="edit-notice-desc" rows="4">${Utils.escapeHtml(notice.description)}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-select" id="edit-notice-category">
            <option value="announcement" ${notice.category === 'announcement' ? 'selected' : ''}>Announcement</option>
            <option value="event" ${notice.category === 'event' ? 'selected' : ''}>Event</option>
            <option value="deadline" ${notice.category === 'deadline' ? 'selected' : ''}>Deadline</option>
            <option value="important" ${notice.category === 'important' ? 'selected' : ''}>Important</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Priority</label>
          <select class="form-select" id="edit-notice-priority">
            <option value="low" ${notice.priority === 'low' ? 'selected' : ''}>Low</option>
            <option value="medium" ${notice.priority === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="high" ${notice.priority === 'high' ? 'selected' : ''}>High</option>
          </select>
        </div>
      </div>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="Noticeboard.updateNotice('${id}')">Save Changes</button>
    `;

    Modal.show('Edit Notice', body, footer);
  },

  updateNotice(id) {
    const notices = Storage.get('notices') || [];
    const idx = notices.findIndex(n => n.id === id);
    if (idx === -1) return;

    notices[idx].title = document.getElementById('edit-notice-title').value.trim();
    notices[idx].description = document.getElementById('edit-notice-desc').value.trim();
    notices[idx].category = document.getElementById('edit-notice-category').value;
    notices[idx].priority = document.getElementById('edit-notice-priority').value;

    Storage.set('notices', notices);
    Modal.close();
    Toast.success('Notice updated.');
    this.render();
  },

  deleteNotice(id) {
    if (!confirm('Delete this notice?')) return;
    let notices = Storage.get('notices') || [];
    notices = notices.filter(n => n.id !== id);
    Storage.set('notices', notices);
    Toast.success('Notice deleted.');
    this.render();
  }
};
