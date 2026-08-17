/* ========================================
   Search & Discovery — CampusNova
   ======================================== */

const Search = {
  currentCategory: 'students',
  query: '',

  render() {
    const content = document.getElementById('main-content');
    content.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Search & Discovery</h1>
        <p class="page-subtitle">Find students, teams, courses, and resources</p>
      </div>

      <div class="search-header">
        <div class="search-bar search-input-wrapper">
          <span class="search-icon">${Icons.search}</span>
          <input class="form-input" id="search-input" placeholder="Search students, teams, courses, resources..." value="${Utils.escapeHtml(this.query)}" oninput="Search.onSearch(this.value)">
        </div>

        <div class="filter-pills" style="margin-top:var(--space-4)" id="search-categories">
          <button class="filter-pill ${this.currentCategory === 'students' ? 'active' : ''}" onclick="Search.setCategory('students')">Students</button>
          <button class="filter-pill ${this.currentCategory === 'teams' ? 'active' : ''}" onclick="Search.setCategory('teams')">Teams</button>
          <button class="filter-pill ${this.currentCategory === 'courses' ? 'active' : ''}" onclick="Search.setCategory('courses')">Courses</button>
          <button class="filter-pill ${this.currentCategory === 'resources' ? 'active' : ''}" onclick="Search.setCategory('resources')">Resources</button>
          <button class="filter-pill ${this.currentCategory === 'announcements' ? 'active' : ''}" onclick="Search.setCategory('announcements')">Announcements</button>
        </div>
      </div>

      <div id="search-results" class="search-results" style="margin-top:var(--space-5)">
        ${this.renderResults()}
      </div>
    `;
  },

  onSearch(value) {
    this.query = value;
    document.getElementById('search-results').innerHTML = this.renderResults();
  },

  setCategory(cat) {
    this.currentCategory = cat;
    this.render();
  },

  renderResults() {
    const q = this.query.toLowerCase().trim();

    switch (this.currentCategory) {
      case 'students': return this.searchStudents(q);
      case 'teams': return this.searchTeams(q);
      case 'courses': return this.searchCourses(q);
      case 'resources': return this.searchResources(q);
      case 'announcements': return this.searchAnnouncements(q);
      default: return '';
    }
  },

  searchStudents(q) {
    const users = (Storage.get('users') || []).filter(u => u.role === 'student');
    const currentUser = AppState.getUser();
    const results = users.filter(u => {
      if (!q) return true;
      return u.name.toLowerCase().includes(q) ||
             u.department.toLowerCase().includes(q) ||
             (u.skills || []).some(s => s.toLowerCase().includes(q)) ||
             (u.batch || '').toLowerCase().includes(q);
    });

    if (results.length === 0) {
      return `<div class="empty-state"><div class="empty-state-icon">${Icons.search}</div><p class="empty-state-title">No students found</p><p class="empty-state-text">Try a different search term.</p></div>`;
    }

    return results.map(u => {
      const availMap = { available: 'badge-success', busy: 'badge-danger', 'looking-for-team': 'badge-warning' };
      const availLabel = { available: 'Available', busy: 'Busy', 'looking-for-team': 'Looking for Team' };
      return `
        <div class="search-result-card">
          ${Utils.renderAvatar(u.name, 'lg')}
          <div class="search-result-info">
            <p class="search-result-name">${Utils.escapeHtml(u.name)}</p>
            <p class="search-result-detail">${Utils.escapeHtml(u.department)} · ${Utils.escapeHtml(u.batch || '')}</p>
            <div style="margin-top:var(--space-2)">${Utils.renderSkillTags(u.skills.slice(0, 4))}</div>
          </div>
          <span class="badge ${availMap[u.availability] || 'badge-neutral'}">${availLabel[u.availability] || u.availability}</span>
          <div class="search-result-actions">
            <button class="btn btn-sm btn-secondary" onclick="Router.navigate('/profile/${u.id}')">View Profile</button>
            ${u.id !== currentUser.id ? `<button class="btn btn-sm btn-primary" onclick="Toast.info('Invitation sent (simulated)')">Invite to Team</button>` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  searchTeams(q) {
    const teams = Storage.get('teams') || [];
    const users = Storage.get('users') || [];
    const results = teams.filter(t => {
      if (!q) return true;
      return t.name.toLowerCase().includes(q) ||
             t.project.toLowerCase().includes(q) ||
             t.course.toLowerCase().includes(q) ||
             (t.requiredSkills || []).some(s => s.toLowerCase().includes(q));
    });

    if (results.length === 0) {
      return `<div class="empty-state"><div class="empty-state-icon">${Icons.search}</div><p class="empty-state-title">No teams found</p><p class="empty-state-text">Try a different search term.</p></div>`;
    }

    return results.map(t => {
      const lead = users.find(u => u.id === t.leadId);
      const seatsLeft = t.maxMembers - t.members.length;
      return `
        <div class="search-result-card">
          <div class="avatar avatar-lg" style="background:${Utils.getAvatarColor(t.name)};font-size:var(--text-md)">${t.name.charAt(0)}</div>
          <div class="search-result-info">
            <p class="search-result-name">${Utils.escapeHtml(t.name)}</p>
            <p class="search-result-detail">${Utils.escapeHtml(t.course)} · ${t.members.length} members · ${seatsLeft > 0 ? seatsLeft + ' seats left' : 'Full'}</p>
            <div style="margin-top:var(--space-2)">${Utils.renderSkillTags(t.requiredSkills)}</div>
          </div>
          <div class="search-result-actions">
            <button class="btn btn-sm btn-primary" onclick="Router.navigate('/teams/${t.id}')">View Team</button>
          </div>
        </div>
      `;
    }).join('');
  },

  searchCourses(q) {
    const users = Storage.get('users') || [];
    const allCourses = [...new Set(users.flatMap(u => u.courses || []))];
    const results = allCourses.filter(c => !q || c.toLowerCase().includes(q));

    if (results.length === 0) {
      return `<div class="empty-state"><div class="empty-state-icon">${Icons.search}</div><p class="empty-state-title">No courses found</p></div>`;
    }

    return results.map(c => {
      const enrolled = users.filter(u => (u.courses || []).includes(c)).length;
      return `
        <div class="search-result-card">
          <div class="avatar avatar-lg" style="background:var(--primary-lighter);color:var(--primary)">${Icons.folder}</div>
          <div class="search-result-info">
            <p class="search-result-name">${Utils.escapeHtml(c)}</p>
            <p class="search-result-detail">${enrolled} students enrolled</p>
          </div>
        </div>
      `;
    }).join('');
  },

  searchResources(q) {
    const resources = Storage.get('resources') || [];
    const users = Storage.get('users') || [];
    const results = resources.filter(r => {
      if (!q) return true;
      return r.name.toLowerCase().includes(q) ||
             r.course.toLowerCase().includes(q) ||
             r.category.toLowerCase().includes(q);
    });

    if (results.length === 0) {
      return `<div class="empty-state"><div class="empty-state-icon">${Icons.search}</div><p class="empty-state-title">No resources found</p></div>`;
    }

    return results.map(r => {
      const uploader = users.find(u => u.id === r.uploadedBy);
      return `
        <div class="search-result-card">
          <div class="avatar avatar-lg" style="background:var(--warning-light);color:var(--warning)">${Icons.fileText}</div>
          <div class="search-result-info">
            <p class="search-result-name">${Utils.escapeHtml(r.name)}</p>
            <p class="search-result-detail">${Utils.escapeHtml(r.course)} · ${r.type.toUpperCase()} · ${r.size}</p>
            <p class="search-result-detail">Uploaded by ${uploader ? Utils.escapeHtml(uploader.name) : 'Unknown'} · ${Utils.formatDate(r.date)}</p>
          </div>
        </div>
      `;
    }).join('');
  },

  searchAnnouncements(q) {
    const notices = Storage.get('notices') || [];
    const results = notices.filter(n => {
      if (!q) return true;
      return n.title.toLowerCase().includes(q) ||
             n.description.toLowerCase().includes(q);
    });

    if (results.length === 0) {
      return `<div class="empty-state"><div class="empty-state-icon">${Icons.search}</div><p class="empty-state-title">No announcements found</p></div>`;
    }

    return results.map(n => `
      <div class="search-result-card">
        <div class="avatar avatar-lg" style="background:var(--success-light);color:var(--success)">${Icons.clipboard}</div>
        <div class="search-result-info">
          <p class="search-result-name">${Utils.escapeHtml(n.title)}</p>
          <p class="search-result-detail">${Utils.truncate(n.description, 100)}</p>
          <p class="search-result-detail">${Utils.formatDate(n.date)} · ${Utils.escapeHtml(n.author)}</p>
        </div>
      </div>
    `).join('');
  }
};
