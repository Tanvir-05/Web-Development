/* ========================================
   Auto Generation / Smart Suggestions — CampusNova
   Mock recommendation system
   ======================================== */

const AutoGeneration = {
  render() {
    const user = AppState.getUser();
    const users = Storage.get('users') || [];
    const teams = Storage.get('teams') || [];
    const tasks = Storage.get('tasks') || [];
    const resources = Storage.get('resources') || [];

    const recommendedTeams = teams.filter(t => !t.members.includes(user.id) && t.members.length < t.maxMembers);
    const recommendedPartners = users.filter(u => u.id !== user.id && u.availability !== 'busy')
      .sort((a, b) => {
        const aMatch = a.skills ? a.skills.filter(s => user.skills.includes(s)).length : 0;
        const bMatch = b.skills ? b.skills.filter(s => user.skills.includes(s)).length : 0;
        return bMatch - aMatch;
      }).slice(0, 4);

    const upcomingTasks = tasks.filter(t => t.assignee === user.id && t.status !== 'completed')
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 3);

    const recommendedResources = resources.slice(0, 4);

    const content = document.getElementById('main-content');
    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-row">
          <div>
            <h1 class="page-title">Smart Suggestions</h1>
            <p class="page-subtitle">AI-powered recommendations based on your Daffodil academic profile and skills</p>
          </div>
        </div>
      </div>

      <!-- Skill Match Hero Banner -->
      <div class="suggestions-hero-banner">
        <div class="suggestions-hero-icon">
          ${Icons.zap}
        </div>
        <div class="suggestions-hero-content">
          <h3 class="suggestions-hero-title">Matched for your expertise in ${user.skills ? user.skills.slice(0, 3).map(s => `<span class="suggestions-skill-badge">${Utils.escapeHtml(s)}</span>`).join('') : '<span class="suggestions-skill-badge">Software Engineering</span>'}</h3>
          <p class="suggestions-hero-subtitle">We found personalized team invitations, academic partners, and resources matching your profile.</p>
        </div>
      </div>

      <div class="suggestions-grid">
        <!-- Recommended Teams -->
        <div class="section-card">
          <div class="section-card-header">
            <h3 class="section-card-title">${user.role === 'admin' ? 'Capstone & Project Teams' : 'Recommended Teams'}</h3>
            <span class="badge badge-primary">${recommendedTeams.length} available</span>
          </div>
          <div class="section-card-body">
            ${recommendedTeams.length > 0 ? recommendedTeams.map(t => `
              <div class="suggestion-item-card">
                <div class="avatar avatar-md" style="background:${Utils.getAvatarColor(t.name)}">${t.name.charAt(0)}</div>
                <div class="suggestion-item-info">
                  <div class="suggestion-item-title-row">
                    <h4 class="suggestion-item-title">${Utils.escapeHtml(t.name)}</h4>
                    <span class="badge badge-success">${t.maxMembers - t.members.length} seats left</span>
                  </div>
                  <p class="suggestion-item-sub">${Utils.escapeHtml(t.course)}</p>
                  <div style="margin-top:var(--space-2)">${Utils.renderSkillTags(t.requiredSkills.slice(0, 3))}</div>
                </div>
                <button class="btn btn-sm btn-primary" style="flex-shrink:0" onclick="Router.navigate('/teams/${t.id}')">View Team</button>
              </div>
            `).join('') : '<p class="empty-state-text" style="padding:var(--space-4);text-align:center">No team recommendations at this time.</p>'}
          </div>
        </div>

        <!-- Recommended Academic Partners -->
        <div class="section-card">
          <div class="section-card-header">
            <h3 class="section-card-title">${user.role === 'admin' ? 'Recommended Students & Collaborators' : 'Recommended Study Partners'}</h3>
            <span class="badge badge-info">${recommendedPartners.length} matches</span>
          </div>
          <div class="section-card-body">
            ${recommendedPartners.map(u => {
              const matchCount = u.skills ? u.skills.filter(s => user.skills.includes(s)).length : 0;
              const roleTag = u.role === 'admin' 
                ? `<span class="badge badge-primary">${Utils.escapeHtml(u.designation || 'Administrator')}</span>`
                : `<span class="badge badge-warning">⚡ ${matchCount} skill match(es)</span>`;
              
              const subtitle = u.role === 'admin'
                ? `${Utils.escapeHtml(u.designation || 'Associate Professor')} · ${Utils.escapeHtml(u.department)}`
                : `${Utils.escapeHtml(u.department)}${u.batch ? ` · ${Utils.escapeHtml(u.batch)}` : ''}`;

              return `
                <div class="suggestion-item-card">
                  ${Utils.renderAvatar(u.name, 'md')}
                  <div class="suggestion-item-info">
                    <div class="suggestion-item-title-row">
                      <h4 class="suggestion-item-title">${Utils.escapeHtml(u.name)}</h4>
                      ${roleTag}
                    </div>
                    <p class="suggestion-item-sub">${subtitle}</p>
                  </div>
                  <div class="suggestion-item-actions">
                    <button class="btn btn-sm btn-secondary" onclick="Router.navigate('/profile/${u.id}')">Profile</button>
                    ${u.role !== 'admin' ? `<button class="btn btn-sm btn-primary" onclick="Toast.success('Invitation sent to ${Utils.escapeHtml(u.name)}!')">Invite</button>` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Task & Deadline Reminders -->
        <div class="section-card">
          <div class="section-card-header">
            <h3 class="section-card-title">Task & Deadline Reminders</h3>
          </div>
          <div class="section-card-body">
            ${upcomingTasks.length > 0 ? upcomingTasks.map(t => {
              const daysLeft = Utils.daysUntil(t.deadline);
              const isUrgent = daysLeft <= 2;
              return `
                <div class="suggestion-list-item">
                  <div class="notification-icon" style="background:${isUrgent ? 'var(--danger-light)' : 'var(--warning-light)'};color:${isUrgent ? 'var(--danger-dark)' : 'var(--warning-dark)'}">
                    ${Icons.clock}
                  </div>
                  <div style="flex:1">
                    <h4 class="suggestion-item-title">${Utils.escapeHtml(t.title)}</h4>
                    <p class="suggestion-item-sub">${daysLeft > 0 ? daysLeft + ' days left' : 'Overdue!'} · Due ${Utils.formatDate(t.deadline)}</p>
                  </div>
                  ${Utils.renderPriorityBadge(t.priority)}
                </div>
              `;
            }).join('') : '<p class="empty-state-text" style="padding:var(--space-4);text-align:center">No upcoming deadlines. Great work!</p>'}
          </div>
        </div>

        <!-- Resource Recommendations -->
        <div class="section-card">
          <div class="section-card-header">
            <h3 class="section-card-title">Resource Recommendations</h3>
          </div>
          <div class="section-card-body">
            ${recommendedResources.map(r => {
              return `
                <div class="suggestion-list-item">
                  <div class="notification-icon" style="background:var(--primary-lighter);color:var(--primary)">
                    ${Icons.fileText}
                  </div>
                  <div style="flex:1">
                    <h4 class="suggestion-item-title">${Utils.escapeHtml(r.name)}</h4>
                    <p class="suggestion-item-sub">${Utils.escapeHtml(r.course)} · ${r.type.toUpperCase()}</p>
                  </div>
                  <button class="btn btn-sm btn-secondary" onclick="Router.navigate('/resources')">View File</button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }
};
