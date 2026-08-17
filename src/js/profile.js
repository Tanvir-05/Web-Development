/* ========================================
   Profile — CampusNova
   User profile view and edit
   ======================================== */

const Profile = {
  render(params = {}) {
    const currentUser = AppState.getUser();
    const users = Storage.get('users') || [];
    const userId = params.id || currentUser.id;
    const user = users.find(u => u.id === userId);
    const isOwn = userId === currentUser.id;

    if (!user) {
      document.getElementById('main-content').innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${Icons.user}</div>
          <p class="empty-state-title">User not found</p>
          <p class="empty-state-text">This profile does not exist.</p>
          <button class="btn btn-primary btn-sm" onclick="Router.navigate('/search')">Search Students</button>
        </div>
      `;
      return;
    }

    const availabilityMap = {
      'available': { label: 'Available', class: 'badge-success' },
      'busy': { label: 'Busy', class: 'badge-danger' },
      'looking-for-team': { label: 'Looking for Team', class: 'badge-warning' }
    };
    const avail = availabilityMap[user.availability] || availabilityMap['available'];

    const content = document.getElementById('main-content');
    content.innerHTML = `
      <!-- Profile Header -->
      <div class="profile-header-card">
        ${Utils.renderAvatar(user.name, '2xl')}
        <div class="profile-info">
          <h1 class="profile-name">${Utils.escapeHtml(user.name)}</h1>
          <p class="profile-department">${Utils.escapeHtml(user.designation || user.department)}${user.batch ? ` · ${Utils.escapeHtml(user.batch)}` : ''}</p>
          <div class="profile-meta">
            <span class="profile-meta-item">${Icons.calendar} Joined ${Utils.formatDate(user.joinDate)}</span>
            <span class="profile-meta-item"><span class="badge ${avail.class}">${avail.label}</span></span>
            ${user.university ? `<span class="profile-meta-item">${Utils.escapeHtml(user.university)}</span>` : ''}
          </div>
        </div>
        <div>
          ${isOwn ? `<button class="btn btn-primary" onclick="Profile.showEditModal()">
            ${Icons.edit} Edit Profile
          </button>` : `<button class="btn btn-secondary" onclick="Toast.info('Invitation sent (simulated)')">
            ${Icons.userPlus} Invite to Team
          </button>`}
        </div>
      </div>

      <div class="profile-sections">
        <!-- Left Column -->
        <div>
          <!-- Personal Info -->
          <div class="profile-section" style="margin-bottom:var(--space-6)">
            <h3 class="profile-section-title">Personal Information</h3>
            <div class="profile-field"><span class="profile-field-label">Full Name</span><span class="profile-field-value">${Utils.escapeHtml(user.name)}</span></div>
            <div class="profile-field"><span class="profile-field-label">Email</span><span class="profile-field-value">${user.privacy.showEmail || isOwn ? Utils.escapeHtml(user.email) : 'Hidden'}</span></div>
            <div class="profile-field"><span class="profile-field-label">Department</span><span class="profile-field-value">${Utils.escapeHtml(user.department)}</span></div>
            <div class="profile-field"><span class="profile-field-label">Batch</span><span class="profile-field-value">${Utils.escapeHtml(user.batch || 'N/A')}</span></div>
            <div class="profile-field"><span class="profile-field-label">University</span><span class="profile-field-value">${Utils.escapeHtml(user.university)}</span></div>
          </div>

          <!-- Academic Info -->
          <div class="profile-section" style="margin-bottom:var(--space-6)">
            <h3 class="profile-section-title">Academic Information</h3>
            ${user.courses && user.courses.length > 0 ? `
              <div style="margin-bottom:var(--space-3)">
                <p style="font-size:var(--text-sm);font-weight:600;color:var(--text);margin-bottom:var(--space-2)">Courses</p>
                ${user.courses.map(c => `<p style="font-size:var(--text-sm);color:var(--text-secondary);padding:2px 0">• ${Utils.escapeHtml(c)}</p>`).join('')}
              </div>
            ` : ''}
            ${user.interests && user.interests.length > 0 ? `
              <div style="margin-bottom:var(--space-3)">
                <p style="font-size:var(--text-sm);font-weight:600;color:var(--text);margin-bottom:var(--space-2)">Interests</p>
                ${Utils.renderSkillTags(user.interests)}
              </div>
            ` : ''}
          </div>

          <!-- About Me -->
          <div class="profile-section">
            <h3 class="profile-section-title">About Me</h3>
            <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.7">${user.about ? Utils.escapeHtml(user.about) : 'No bio added yet.'}</p>
          </div>
        </div>

        <!-- Right Column -->
        <div>
          <!-- Skills -->
          <div class="profile-section" style="margin-bottom:var(--space-6)">
            <h3 class="profile-section-title">Skills</h3>
            ${user.skills && user.skills.length > 0 ? Utils.renderSkillTags(user.skills) : '<p style="font-size:var(--text-sm);color:var(--text-muted)">No skills added yet.</p>'}
          </div>

          ${isOwn ? `
          <!-- Privacy Settings -->
          <div class="profile-section">
            <h3 class="profile-section-title">Privacy Settings</h3>
            <div class="settings-row">
              <div><span class="settings-row-label">Profile Visibility</span></div>
              <label class="toggle-switch">
                <input type="checkbox" ${user.privacy.profileVisible ? 'checked' : ''} onchange="Profile.updatePrivacy('profileVisible', this.checked)">
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="settings-row">
              <div><span class="settings-row-label">Show Email</span></div>
              <label class="toggle-switch">
                <input type="checkbox" ${user.privacy.showEmail ? 'checked' : ''} onchange="Profile.updatePrivacy('showEmail', this.checked)">
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="settings-row">
              <div><span class="settings-row-label">Show Skills</span></div>
              <label class="toggle-switch">
                <input type="checkbox" ${user.privacy.showSkills ? 'checked' : ''} onchange="Profile.updatePrivacy('showSkills', this.checked)">
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="settings-row">
              <div><span class="settings-row-label">Show Availability</span></div>
              <label class="toggle-switch">
                <input type="checkbox" ${user.privacy.showAvailability ? 'checked' : ''} onchange="Profile.updatePrivacy('showAvailability', this.checked)">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  showEditModal() {
    const user = AppState.getUser();
    const body = `
      <div class="form-group">
        <label class="form-label">Full Name</label>
        <input class="form-input" id="edit-name" value="${Utils.escapeHtml(user.name)}">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Department</label>
          <select class="form-select" id="edit-department">
            <option value="Software Engineering" ${user.department === 'Software Engineering' ? 'selected' : ''}>Software Engineering</option>
            <option value="Computer Science" ${user.department === 'Computer Science' ? 'selected' : ''}>Computer Science</option>
            <option value="Electrical Engineering" ${user.department === 'Electrical Engineering' ? 'selected' : ''}>Electrical Engineering</option>
            <option value="Business Administration" ${user.department === 'Business Administration' ? 'selected' : ''}>Business Administration</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Availability</label>
          <select class="form-select" id="edit-availability">
            <option value="available" ${user.availability === 'available' ? 'selected' : ''}>Available</option>
            <option value="busy" ${user.availability === 'busy' ? 'selected' : ''}>Busy</option>
            <option value="looking-for-team" ${user.availability === 'looking-for-team' ? 'selected' : ''}>Looking for Team</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Skills</label>
        <input class="form-input" id="edit-skills" value="${(user.skills || []).join(', ')}" placeholder="Comma-separated">
      </div>
      <div class="form-group">
        <label class="form-label">Interests</label>
        <input class="form-input" id="edit-interests" value="${(user.interests || []).join(', ')}" placeholder="Comma-separated">
      </div>
      <div class="form-group">
        <label class="form-label">About Me</label>
        <textarea class="form-input" id="edit-about" rows="3">${Utils.escapeHtml(user.about || '')}</textarea>
      </div>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="Profile.saveProfile()">Save Changes</button>
    `;

    Modal.show('Edit Profile', body, footer);
  },

  saveProfile() {
    const user = AppState.getUser();
    const users = Storage.get('users') || [];
    const idx = users.findIndex(u => u.id === user.id);

    if (idx === -1) return;

    users[idx].name = document.getElementById('edit-name').value.trim() || user.name;
    users[idx].department = document.getElementById('edit-department').value;
    users[idx].availability = document.getElementById('edit-availability').value;
    users[idx].skills = document.getElementById('edit-skills').value.split(',').map(s => s.trim()).filter(Boolean);
    users[idx].interests = document.getElementById('edit-interests').value.split(',').map(s => s.trim()).filter(Boolean);
    users[idx].about = document.getElementById('edit-about').value.trim();

    Storage.set('users', users);
    AppState.setUser(users[idx]);

    Modal.close();
    Toast.success('Profile updated successfully.');
    Profile.render();
    App.updateShell();
  },

  updatePrivacy(key, value) {
    const user = AppState.getUser();
    const users = Storage.get('users') || [];
    const idx = users.findIndex(u => u.id === user.id);
    if (idx === -1) return;

    users[idx].privacy[key] = value;
    Storage.set('users', users);
    AppState.setUser(users[idx]);
    Toast.success('Privacy setting updated.');
  }
};
