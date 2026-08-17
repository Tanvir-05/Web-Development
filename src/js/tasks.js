/* ========================================
   Tasks — CampusNova
   Kanban task board
   ======================================== */

const Tasks = {
  render() {
    const user = AppState.getUser();
    const tasks = Storage.get('tasks') || [];
    const teams = Storage.get('teams') || [];
    const users = Storage.get('users') || [];
    const myTeams = teams.filter(t => t.members.includes(user.id));
    const myTasks = tasks.filter(t => myTeams.some(team => team.id === t.teamId));

    const columns = [
      { key: 'todo', label: 'TO DO', color: 'var(--text-muted)' },
      { key: 'in-progress', label: 'IN PROGRESS', color: 'var(--info)' },
      { key: 'review', label: 'REVIEW', color: 'var(--warning)' },
      { key: 'completed', label: 'COMPLETED', color: 'var(--success)' }
    ];

    const content = document.getElementById('main-content');
    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-row">
          <div>
            <h1 class="page-title">Task Board</h1>
            <p class="page-subtitle">Manage and track your project tasks</p>
          </div>
          <button class="btn btn-primary" onclick="Tasks.showCreateModal()">
            ${Icons.plus} Add Task
          </button>
        </div>
      </div>

      <div class="task-board">
        ${columns.map(col => {
          const colTasks = myTasks.filter(t => t.status === col.key);
          return `
            <div class="task-column">
              <div class="task-column-header">
                <span class="task-column-title">
                  <span class="status-dot" style="background:${col.color}"></span>
                  ${col.label}
                  <span class="task-column-count">${colTasks.length}</span>
                </span>
              </div>
              <div class="task-column-body">
                ${colTasks.map(t => this.renderTaskCard(t, teams, users)).join('')}
                ${colTasks.length === 0 ? '<p style="font-size:var(--text-xs);color:var(--text-muted);text-align:center;padding:var(--space-4)">No tasks</p>' : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  renderTaskCard(task, teams, users) {
    const team = teams.find(t => t.id === task.teamId);
    const assignee = users.find(u => u.id === task.assignee);
    const daysLeft = Utils.daysUntil(task.deadline);
    const isUrgent = daysLeft <= 2;

    return `
      <div class="task-card" onclick="Tasks.showTaskDetail('${task.id}')">
        <div class="task-card-header">
          ${Utils.renderPriorityBadge(task.priority)}
          ${team ? `<span class="task-card-team-tag">${Utils.escapeHtml(team.name)}</span>` : ''}
        </div>

        <h4 class="task-card-title">${Utils.escapeHtml(task.title)}</h4>
        <p class="task-card-desc">${Utils.escapeHtml(task.description)}</p>

        <div class="task-card-footer">
          <div class="task-card-assignee">
            ${assignee ? `
              ${Utils.renderAvatar(assignee.name, 'xs')}
              <span class="task-card-assignee-name">${Utils.escapeHtml(assignee.name.split(' ')[0])}</span>
            ` : '<span class="task-card-assignee-name">Unassigned</span>'}
          </div>
          <div class="task-card-deadline ${isUrgent ? 'urgent' : ''}">
            ${Icons.calendar}
            <span>${Utils.formatDate(task.deadline)}</span>
          </div>
        </div>
      </div>
    `;
  },

  showTaskDetail(taskId) {
    const tasks = Storage.get('tasks') || [];
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const users = Storage.get('users') || [];
    const teams = Storage.get('teams') || [];
    const team = teams.find(t => t.id === task.teamId);
    const assignee = users.find(u => u.id === task.assignee);

    const body = `
      <div class="form-group">
        <label class="form-label">Title</label>
        <input class="form-input" id="edit-task-title" value="${Utils.escapeHtml(task.title)}">
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-input" id="edit-task-desc" rows="3">${Utils.escapeHtml(task.description)}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Assignee</label>
          <select class="form-select" id="edit-task-assignee">
            ${team ? team.members.map(mId => {
              const m = users.find(u => u.id === mId);
              return m ? `<option value="${m.id}" ${m.id === task.assignee ? 'selected' : ''}>${Utils.escapeHtml(m.name)}</option>` : '';
            }).join('') : ''}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Priority</label>
          <select class="form-select" id="edit-task-priority">
            <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
            <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Deadline</label>
          <input class="form-input" type="date" id="edit-task-deadline" value="${task.deadline}">
        </div>
        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-select" id="edit-task-status">
            <option value="todo" ${task.status === 'todo' ? 'selected' : ''}>To Do</option>
            <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
            <option value="review" ${task.status === 'review' ? 'selected' : ''}>Review</option>
            <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
          </select>
        </div>
      </div>
    `;

    const footer = `
      <button class="btn btn-danger btn-sm" onclick="Tasks.deleteTask('${task.id}')" style="margin-right:auto">${Icons.trash} Delete</button>
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="Tasks.updateTask('${task.id}')">Save Changes</button>
    `;

    Modal.show('Edit Task', body, footer);
  },

  showCreateModal(teamId) {
    const user = AppState.getUser();
    const teams = Storage.get('teams') || [];
    const users = Storage.get('users') || [];
    const myTeams = teams.filter(t => t.members.includes(user.id));

    const body = `
      <div class="form-group">
        <label class="form-label">Team</label>
        <select class="form-select" id="new-task-team" onchange="Tasks.updateAssigneeOptions()">
          ${myTeams.map(t => `<option value="${t.id}" ${t.id === teamId ? 'selected' : ''}>${Utils.escapeHtml(t.name)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Title</label>
        <input class="form-input" id="new-task-title" placeholder="Task title">
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-input" id="new-task-desc" rows="2" placeholder="Describe the task..."></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Assignee</label>
          <select class="form-select" id="new-task-assignee"></select>
        </div>
        <div class="form-group">
          <label class="form-label">Priority</label>
          <select class="form-select" id="new-task-priority">
            <option value="low">Low</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Deadline</label>
        <input class="form-input" type="date" id="new-task-deadline">
      </div>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="Tasks.createTask()">Create Task</button>
    `;

    Modal.show('Create Task', body, footer);
    this.updateAssigneeOptions();
  },

  updateAssigneeOptions() {
    const teamId = document.getElementById('new-task-team').value;
    const teams = Storage.get('teams') || [];
    const users = Storage.get('users') || [];
    const team = teams.find(t => t.id === teamId);
    const select = document.getElementById('new-task-assignee');

    if (team && select) {
      select.innerHTML = team.members.map(mId => {
        const m = users.find(u => u.id === mId);
        return m ? `<option value="${m.id}">${Utils.escapeHtml(m.name)}</option>` : '';
      }).join('');
    }
  },

  createTask() {
    const teamId = document.getElementById('new-task-team').value;
    const title = document.getElementById('new-task-title').value.trim();
    const desc = document.getElementById('new-task-desc').value.trim();
    const assignee = document.getElementById('new-task-assignee').value;
    const priority = document.getElementById('new-task-priority').value;
    const deadline = document.getElementById('new-task-deadline').value;

    if (!title) {
      Toast.error('Please enter a task title.');
      return;
    }

    const tasks = Storage.get('tasks') || [];
    tasks.push({
      id: 'task-' + Utils.generateId(),
      teamId,
      title,
      description: desc,
      assignee,
      priority,
      deadline: deadline || '2026-09-30',
      status: 'todo',
      createdAt: new Date().toISOString().split('T')[0]
    });
    Storage.set('tasks', tasks);

    Modal.close();
    Toast.success('Task created successfully!');
    this.render();
  },

  updateTask(taskId) {
    const tasks = Storage.get('tasks') || [];
    const idx = tasks.findIndex(t => t.id === taskId);
    if (idx === -1) return;

    tasks[idx].title = document.getElementById('edit-task-title').value.trim();
    tasks[idx].description = document.getElementById('edit-task-desc').value.trim();
    tasks[idx].assignee = document.getElementById('edit-task-assignee').value;
    tasks[idx].priority = document.getElementById('edit-task-priority').value;
    tasks[idx].deadline = document.getElementById('edit-task-deadline').value;
    tasks[idx].status = document.getElementById('edit-task-status').value;

    Storage.set('tasks', tasks);
    Modal.close();
    Toast.success('Task updated.');
    this.render();
  },

  changeStatus(taskId, newStatus) {
    const tasks = Storage.get('tasks') || [];
    const idx = tasks.findIndex(t => t.id === taskId);
    if (idx === -1) return;

    tasks[idx].status = newStatus;
    Storage.set('tasks', tasks);
    Toast.success('Task status updated.');

    // Re-render current page if on tasks page, or refresh team detail
    const path = Router.getPath();
    if (path === '/tasks') {
      this.render();
    }
  },

  deleteTask(taskId) {
    if (!confirm('Delete this task?')) return;
    let tasks = Storage.get('tasks') || [];
    tasks = tasks.filter(t => t.id !== taskId);
    Storage.set('tasks', tasks);
    Modal.close();
    Toast.success('Task deleted.');
    this.render();
  }
};
