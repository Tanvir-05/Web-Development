/* ========================================
   Teams — CampusNova
   Team listing and team details
   ======================================== */

const Teams = {
  render() {
    const user = AppState.getUser();
    const teams = Storage.get('teams') || [];
    const users = Storage.get('users') || [];
    const myTeams = teams.filter(t => t.members.includes(user.id));

    const content = document.getElementById('main-content');
    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-row">
          <div>
            <h1 class="page-title">My Teams</h1>
            <p class="page-subtitle">Manage your project teams and collaborations</p>
          </div>
          <button class="btn btn-primary" onclick="Teams.showCreateModal()">
            ${Icons.plus} Create Team
          </button>
        </div>
      </div>

      ${myTeams.length > 0 ? `
        <div class="teams-grid">
          ${myTeams.map(t => this.renderTeamCard(t, users)).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">${Icons.users}</div>
          <p class="empty-state-title">You haven't joined any teams yet</p>
          <p class="empty-state-text">Create a new team or search for existing ones to join.</p>
          <button class="btn btn-primary" onclick="Router.navigate('/search')">Find a Team</button>
        </div>
      `}
    `;
  },

  renderTeamCard(team, users) {
    const lead = users.find(u => u.id === team.leadId);
    const daysLeft = Utils.daysUntil(team.deadline);

    return `
      <div class="team-card" onclick="Router.navigate('/teams/${team.id}')">
        <div class="team-card-header">
          <div>
            <p class="team-card-name">${Utils.escapeHtml(team.name)}</p>
            <p class="team-card-course">${Utils.escapeHtml(team.project)}</p>
          </div>
          ${Utils.renderStatusBadge(team.status)}
        </div>
        <p style="font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--space-3)">${Utils.escapeHtml(team.course)}</p>
        <div class="team-card-meta">
          <span class="team-card-meta-item">${Icons.user} ${lead ? Utils.escapeHtml(lead.name) : 'Unknown'}</span>
          <span class="team-card-meta-item">${Icons.users} ${team.members.length}/${team.maxMembers}</span>
          <span class="team-card-meta-item">${Icons.calendar} ${daysLeft > 0 ? daysLeft + 'd left' : 'Overdue'}</span>
        </div>
        <div style="margin-top:var(--space-3)">
          <div style="display:flex;justify-content:space-between;font-size:var(--text-xs);color:var(--text-muted);margin-bottom:4px">
            <span>Progress</span><span>${team.progress}%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:${team.progress}%"></div></div>
        </div>
      </div>
    `;
  },

  renderDetail(params) {
    const teamId = params.id;
    const teams = Storage.get('teams') || [];
    const team = teams.find(t => t.id === teamId);
    const users = Storage.get('users') || [];
    const tasks = Storage.get('tasks') || [];
    const discussions = Storage.get('discussions') || [];
    const resources = Storage.get('resources') || [];
    const currentUser = AppState.getUser();

    if (!team) {
      document.getElementById('main-content').innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${Icons.users}</div>
          <p class="empty-state-title">Team not found</p>
          <button class="btn btn-primary btn-sm" onclick="Router.navigate('/teams')">Back to Teams</button>
        </div>
      `;
      return;
    }

    const lead = users.find(u => u.id === team.leadId);
    const isLead = currentUser.id === team.leadId;
    const teamTasks = tasks.filter(t => t.teamId === teamId);
    const teamDiscussions = discussions.filter(d => d.teamId === teamId);
    const daysLeft = Utils.daysUntil(team.deadline);

    const content = document.getElementById('main-content');
    content.innerHTML = `
      <button class="btn btn-ghost btn-sm" onclick="Router.navigate('/teams')" style="margin-bottom:var(--space-4)">← Back to Teams</button>

      <div class="team-detail-header">
        <div style="display:flex;align-items:flex-start;justify-content:space-between">
          <div>
            <h1 class="team-detail-title">${Utils.escapeHtml(team.name)}</h1>
            <p class="team-detail-project">${Utils.escapeHtml(team.project)} · ${Utils.escapeHtml(team.course)}</p>
          </div>
          ${Utils.renderStatusBadge(team.status)}
        </div>
        <div class="team-detail-meta">
          <span class="project-card-meta-item">${Icons.user} <strong>Lead:</strong> ${lead ? Utils.escapeHtml(lead.name) : 'Unknown'}</span>
          <span class="project-card-meta-item">${Icons.users} ${team.members.length}/${team.maxMembers} members</span>
          <span class="project-card-meta-item">${Icons.calendar} ${daysLeft > 0 ? daysLeft + ' days left' : 'Overdue'}</span>
          <span class="project-card-meta-item">Progress: <strong>${team.progress}%</strong></span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs" id="team-tabs">
        <button class="tab-item active" data-tab="overview" onclick="Teams.switchTab('overview')">Overview</button>
        <button class="tab-item" data-tab="tasks" onclick="Teams.switchTab('tasks')">Tasks (${teamTasks.length})</button>
        <button class="tab-item" data-tab="members" onclick="Teams.switchTab('members')">Members (${team.members.length})</button>
        <button class="tab-item" data-tab="notes" onclick="Teams.switchTab('notes')">Notes</button>
        <button class="tab-item" data-tab="discussion" onclick="Teams.switchTab('discussion')">Discussion</button>
      </div>

      <div id="team-tab-content">
        ${this.renderOverviewTab(team, teamTasks, users)}
      </div>
    `;

    // Store current team for tab rendering
    this._currentTeam = team;
    this._teamTasks = teamTasks;
    this._teamDiscussions = teamDiscussions;
    this._isLead = isLead;
  },

  switchTab(tab) {
    document.querySelectorAll('#team-tabs .tab-item').forEach(t => t.classList.remove('active'));
    document.querySelector(`#team-tabs .tab-item[data-tab="${tab}"]`).classList.add('active');

    const team = this._currentTeam;
    const tasks = this._teamTasks;
    const discussions = this._teamDiscussions;
    const users = Storage.get('users') || [];
    const resources = Storage.get('resources') || [];
    const isLead = this._isLead;

    const container = document.getElementById('team-tab-content');

    switch (tab) {
      case 'overview':
        container.innerHTML = this.renderOverviewTab(team, tasks, users);
        break;
      case 'tasks':
        container.innerHTML = this.renderTasksTab(team, tasks, users);
        break;
      case 'members':
        container.innerHTML = this.renderMembersTab(team, users, isLead);
        break;
      case 'notes':
        container.innerHTML = this.renderNotesTab(team, resources, users);
        break;
      case 'discussion':
        container.innerHTML = this.renderDiscussionTab(team, discussions, users);
        break;
    }
  },

  renderOverviewTab(team, tasks, users) {
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;

    return `
      <div class="section-card">
        <div class="section-card-header"><h3 class="section-card-title">Project Description</h3></div>
        <div class="section-card-body">
          <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.7">${Utils.escapeHtml(team.description)}</p>
          <div style="margin-top:var(--space-4)">
            <p style="font-size:var(--text-sm);font-weight:600;margin-bottom:var(--space-2)">Required Skills</p>
            ${Utils.renderSkillTags(team.requiredSkills)}
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-top:var(--space-5)">
            <div class="stat-card">
              <div class="stat-card-icon" style="background:var(--success-light);color:var(--success)">${Icons.checkSquare}</div>
              <div><div class="stat-card-value">${completedTasks}</div><div class="stat-card-label">Completed</div></div>
            </div>
            <div class="stat-card">
              <div class="stat-card-icon" style="background:var(--info-light);color:var(--info)">${Icons.clock}</div>
              <div><div class="stat-card-value">${inProgressTasks}</div><div class="stat-card-label">In Progress</div></div>
            </div>
            <div class="stat-card">
              <div class="stat-card-icon" style="background:var(--warning-light);color:var(--warning)">${Icons.flag}</div>
              <div><div class="stat-card-value">${tasks.length - completedTasks - inProgressTasks}</div><div class="stat-card-label">Remaining</div></div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderTasksTab(team, tasks, users) {
    return `
      <div style="display:flex;justify-content:flex-end;margin-bottom:var(--space-4)">
        <button class="btn btn-primary btn-sm" onclick="Tasks.showCreateModal('${team.id}')">
          ${Icons.plus} Add Task
        </button>
      </div>
      ${tasks.length > 0 ? `
        <div class="section-card">
          <div class="section-card-body" style="padding:0">
            <table class="data-table">
              <thead>
                <tr><th>Task</th><th>Assignee</th><th>Priority</th><th>Deadline</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                ${tasks.map(t => {
                  const assignee = users.find(u => u.id === t.assignee);
                  return `
                    <tr>
                      <td style="font-weight:600;color:var(--text)">${Utils.escapeHtml(t.title)}</td>
                      <td><div style="display:flex;align-items:center;gap:var(--space-2)">${assignee ? Utils.renderAvatar(assignee.name, 'xs') : ''} ${assignee ? Utils.escapeHtml(assignee.name) : 'Unassigned'}</div></td>
                      <td>${Utils.renderPriorityBadge(t.priority)}</td>
                      <td>${Utils.formatDate(t.deadline)}</td>
                      <td>${Utils.renderStatusBadge(t.status)}</td>
                      <td>
                        <select class="form-select" style="width:auto;padding:2px 24px 2px 8px;font-size:var(--text-xs)" onchange="Tasks.changeStatus('${t.id}', this.value)">
                          <option value="todo" ${t.status === 'todo' ? 'selected' : ''}>To Do</option>
                          <option value="in-progress" ${t.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                          <option value="review" ${t.status === 'review' ? 'selected' : ''}>Review</option>
                          <option value="completed" ${t.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">${Icons.checkSquare}</div>
          <p class="empty-state-title">No tasks yet</p>
          <p class="empty-state-text">Add tasks to track your team's progress.</p>
        </div>
      `}
    `;
  },

  renderMembersTab(team, users, isLead) {
    return `
      ${isLead ? `
        <div style="display:flex;justify-content:flex-end;margin-bottom:var(--space-4)">
          <button class="btn btn-primary btn-sm" onclick="Teams.showInviteModal('${team.id}')">
            ${Icons.userPlus} Invite Member
          </button>
        </div>
      ` : ''}
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-3)">
        ${team.members.map(mId => {
          const member = users.find(u => u.id === mId);
          if (!member) return '';
          const isTeamLead = member.id === team.leadId;
          return `
            <div class="team-member-card">
              ${Utils.renderAvatar(member.name, 'md')}
              <div class="team-member-info">
                <p class="team-member-name">${Utils.escapeHtml(member.name)} ${isTeamLead ? '<span class="badge badge-primary" style="margin-left:4px">Lead</span>' : ''}</p>
                <p class="team-member-role">${Utils.escapeHtml(member.department)}</p>
                <div style="margin-top:4px">${Utils.renderSkillTags(member.skills.slice(0, 3))}</div>
              </div>
              <div class="team-member-actions">
                <button class="btn btn-sm btn-ghost btn-icon" onclick="Router.navigate('/profile/${member.id}')" title="View Profile">${Icons.eye}</button>
                ${isLead && !isTeamLead ? `<button class="btn btn-sm btn-ghost btn-icon" onclick="Teams.removeMember('${team.id}', '${member.id}')" title="Remove">${Icons.trash}</button>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  renderNotesTab(team, resources, users) {
    const teamResources = resources.filter(r => team.members.includes(r.uploadedBy));
    return `
      <div style="display:flex;justify-content:flex-end;margin-bottom:var(--space-4)">
        <button class="btn btn-primary btn-sm" onclick="Notes.showUploadModal()">
          ${Icons.upload} Upload File
        </button>
      </div>
      ${teamResources.length > 0 ? `
        <div class="resources-grid">
          ${teamResources.map(r => Notes.renderResourceCard(r, users)).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">${Icons.fileText}</div>
          <p class="empty-state-title">No shared files yet</p>
          <p class="empty-state-text">Upload files to share with your team.</p>
        </div>
      `}
    `;
  },

  renderDiscussionTab(team, discussions, users) {
    return `
      <div class="section-card">
        <div class="section-card-body">
          <div style="margin-bottom:var(--space-4)">
            <div style="display:flex;gap:var(--space-3)">
              ${Utils.renderAvatar(AppState.getUser().name, 'sm')}
              <div style="flex:1;display:flex;gap:var(--space-2)">
                <input class="form-input" id="discussion-input" placeholder="Write a message..." style="flex:1">
                <button class="btn btn-primary btn-sm" onclick="Teams.postDiscussion('${team.id}')">Post</button>
              </div>
            </div>
          </div>
          ${discussions.length > 0 ? discussions.map(d => {
            const author = users.find(u => u.id === d.authorId);
            return `
              <div class="discussion-post">
                ${Utils.renderAvatar(author ? author.name : '?', 'sm')}
                <div class="discussion-post-content">
                  <div class="discussion-post-header">
                    <span class="discussion-post-author">${author ? Utils.escapeHtml(author.name) : 'Unknown'}</span>
                    <span class="discussion-post-time">${Utils.formatRelativeTime(d.time)}</span>
                  </div>
                  <p class="discussion-post-body">${Utils.escapeHtml(d.content)}</p>
                </div>
              </div>
            `;
          }).join('') : '<p style="font-size:var(--text-sm);color:var(--text-muted);text-align:center;padding:var(--space-6)">No discussions yet. Start the conversation!</p>'}
        </div>
      </div>
    `;
  },

  postDiscussion(teamId) {
    const input = document.getElementById('discussion-input');
    const text = input.value.trim();
    if (!text) return;

    const discussions = Storage.get('discussions') || [];
    discussions.push({
      id: 'disc-' + Utils.generateId(),
      teamId,
      authorId: AppState.getUser().id,
      content: text,
      time: new Date().toISOString()
    });
    Storage.set('discussions', discussions);
    this._teamDiscussions = discussions.filter(d => d.teamId === teamId);
    input.value = '';
    this.switchTab('discussion');
    Toast.success('Message posted.');
  },

  showCreateModal() {
    const body = `
      <div class="form-group">
        <label class="form-label">Team Name</label>
        <input class="form-input" id="create-team-name" placeholder="e.g., Web Engineering Team">
      </div>
      <div class="form-group">
        <label class="form-label">Project Title</label>
        <input class="form-input" id="create-team-project" placeholder="e.g., Student Collaboration Platform">
      </div>
      <div class="form-group">
        <label class="form-label">Course</label>
        <input class="form-input" id="create-team-course" placeholder="e.g., SE231 System Analysis & Design">
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-input" id="create-team-desc" rows="3" placeholder="Describe your project..."></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Required Skills</label>
          <input class="form-input" id="create-team-skills" placeholder="Comma-separated">
        </div>
        <div class="form-group">
          <label class="form-label">Max Members</label>
          <input class="form-input" type="number" id="create-team-max" value="5" min="2" max="10">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Deadline</label>
        <input class="form-input" type="date" id="create-team-deadline">
      </div>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="Teams.createTeam()">Create Team</button>
    `;

    Modal.show('Create Team', body, footer);
  },

  createTeam() {
    const name = document.getElementById('create-team-name').value.trim();
    const project = document.getElementById('create-team-project').value.trim();
    const course = document.getElementById('create-team-course').value.trim();
    const desc = document.getElementById('create-team-desc').value.trim();
    const skills = document.getElementById('create-team-skills').value.split(',').map(s => s.trim()).filter(Boolean);
    const max = parseInt(document.getElementById('create-team-max').value) || 5;
    const deadline = document.getElementById('create-team-deadline').value;

    if (!name || !project) {
      Toast.error('Please enter a team name and project title.');
      return;
    }

    const user = AppState.getUser();
    const teams = Storage.get('teams') || [];
    const newTeam = {
      id: 'team-' + Utils.generateId(),
      name, project, course,
      description: desc,
      leadId: user.id,
      members: [user.id],
      requiredSkills: skills,
      maxMembers: max,
      progress: 0,
      deadline: deadline || '2026-09-30',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    teams.push(newTeam);
    Storage.set('teams', teams);

    Modal.close();
    Toast.success('Team created successfully!');
    this.render();
  },

  showInviteModal(teamId) {
    const users = Storage.get('users') || [];
    const team = (Storage.get('teams') || []).find(t => t.id === teamId);
    const nonMembers = users.filter(u => u.role === 'student' && !team.members.includes(u.id));

    const body = `
      <p style="font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--space-4)">Select a student to invite:</p>
      ${nonMembers.map(u => `
        <div class="teammate-card" style="margin-bottom:var(--space-2)">
          ${Utils.renderAvatar(u.name, 'sm')}
          <div class="teammate-info">
            <p class="teammate-name">${Utils.escapeHtml(u.name)}</p>
            <p class="teammate-department">${u.department}</p>
          </div>
          <button class="btn btn-sm btn-primary" onclick="Teams.inviteMember('${teamId}', '${u.id}')">Invite</button>
        </div>
      `).join('')}
      ${nonMembers.length === 0 ? '<p style="font-size:var(--text-sm);color:var(--text-muted)">No available students to invite.</p>' : ''}
    `;

    Modal.show('Invite Member', body);
  },

  inviteMember(teamId, userId) {
    const teams = Storage.get('teams') || [];
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    if (team.members.length >= team.maxMembers) {
      Toast.warning('Team is full.');
      return;
    }

    team.members.push(userId);
    Storage.set('teams', teams);
    Modal.close();
    Toast.success('Member invited successfully!');
    this.renderDetail({ id: teamId });
  },

  removeMember(teamId, userId) {
    if (!confirm('Remove this member from the team?')) return;
    const teams = Storage.get('teams') || [];
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    team.members = team.members.filter(m => m !== userId);
    Storage.set('teams', teams);
    Toast.success('Member removed.');
    this.renderDetail({ id: teamId });
  }
};
