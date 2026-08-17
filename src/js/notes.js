/* ========================================
   Resources / Notes — CampusNova
   File sharing and resource management
   ======================================== */

const Notes = {
  currentCategory: 'all',

  render() {
    const resources = Storage.get('resources') || [];
    const users = Storage.get('users') || [];
    const categories = ['all', 'Lecture Notes', 'Assignments', 'Slides', 'References', 'Project Files'];

    const filtered = this.currentCategory === 'all' ? resources : resources.filter(r => r.category === this.currentCategory);

    const content = document.getElementById('main-content');
    content.innerHTML = `
      <div class="page-header">
        <div class="page-header-row">
          <div>
            <h1 class="page-title">Resources</h1>
            <p class="page-subtitle">Shared academic resources and project files</p>
          </div>
          <button class="btn btn-primary" onclick="Notes.showUploadModal()">
            ${Icons.upload} Upload File
          </button>
        </div>
      </div>

      <div class="filter-pills" style="margin-bottom:var(--space-5)">
        ${categories.map(c => `
          <button class="filter-pill ${this.currentCategory === c ? 'active' : ''}" onclick="Notes.setCategory('${c}')">${c === 'all' ? 'All' : c}</button>
        `).join('')}
      </div>

      ${filtered.length > 0 ? `
        <div class="resources-grid">
          ${filtered.map(r => this.renderResourceCard(r, users)).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">${Icons.fileText}</div>
          <p class="empty-state-title">No resources found</p>
          <p class="empty-state-text">Upload files to share with your classmates.</p>
        </div>
      `}
    `;
  },

  setCategory(cat) {
    this.currentCategory = cat;
    this.render();
  },

  renderResourceCard(resource, users) {
    const uploader = users.find(u => u.id === resource.uploadedBy);
    const typeColors = {
      pdf: { bg: 'var(--danger-light)', color: 'var(--danger)' },
      docx: { bg: 'var(--info-light)', color: 'var(--info)' },
      pptx: { bg: 'var(--warning-light)', color: 'var(--warning)' },
      png: { bg: 'var(--success-light)', color: 'var(--success)' },
      jpg: { bg: 'var(--success-light)', color: 'var(--success)' }
    };
    const tc = typeColors[resource.type] || { bg: 'var(--primary-lighter)', color: 'var(--primary)' };

    return `
      <div class="resource-card">
        <div class="resource-card-icon" style="background:${tc.bg};color:${tc.color}">
          ${Icons.fileText}
        </div>
        <p class="resource-card-name">${Utils.escapeHtml(resource.name)}</p>
        <p class="resource-card-meta">${resource.type.toUpperCase()} · ${resource.size} · v${resource.version}</p>
        <p class="resource-card-meta">${Utils.escapeHtml(resource.course)}</p>
        <p class="resource-card-meta">By ${uploader ? Utils.escapeHtml(uploader.name) : 'Unknown'} · ${Utils.formatDate(resource.date)}</p>
        <div class="resource-card-actions">
          <button class="btn btn-sm btn-secondary" onclick="Toast.info('File preview is simulated in this prototype.')">${Icons.eye} View</button>
          <button class="btn btn-sm btn-secondary" onclick="Toast.info('Download simulated.')">${Icons.download} Download</button>
          <button class="btn btn-sm btn-ghost btn-icon" onclick="Notes.deleteResource('${resource.id}')" title="Delete">${Icons.trash}</button>
        </div>
      </div>
    `;
  },

  showUploadModal() {
    const body = `
      <div class="form-group">
        <label class="form-label">File Name</label>
        <input class="form-input" id="upload-name" placeholder="e.g., Lecture 05 Notes">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">File Type</label>
          <select class="form-select" id="upload-type">
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="pptx">PPTX</option>
            <option value="png">PNG</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-select" id="upload-category">
            <option value="Lecture Notes">Lecture Notes</option>
            <option value="Assignments">Assignments</option>
            <option value="Slides">Slides</option>
            <option value="References">References</option>
            <option value="Project Files">Project Files</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Course</label>
        <input class="form-input" id="upload-course" placeholder="e.g., SE231 System Analysis & Design">
      </div>
      <p class="form-hint" style="margin-top:var(--space-2)">File upload is simulated in this prototype. The file entry will be added to the resources list.</p>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="Modal.close()">Cancel</button>
      <button class="btn btn-primary" onclick="Notes.uploadResource()">Upload</button>
    `;

    Modal.show('Upload Resource', body, footer);
  },

  uploadResource() {
    const name = document.getElementById('upload-name').value.trim();
    const type = document.getElementById('upload-type').value;
    const category = document.getElementById('upload-category').value;
    const course = document.getElementById('upload-course').value.trim();

    if (!name) {
      Toast.error('Please enter a file name.');
      return;
    }

    const resources = Storage.get('resources') || [];
    resources.push({
      id: 'res-' + Utils.generateId(),
      name,
      type,
      category,
      course: course || 'General',
      uploadedBy: AppState.getUser().id,
      date: new Date().toISOString().split('T')[0],
      version: '1.0',
      size: (Math.random() * 5 + 0.5).toFixed(1) + ' MB'
    });
    Storage.set('resources', resources);

    Modal.close();
    Toast.success('Resource uploaded successfully!');
    this.render();
  },

  deleteResource(id) {
    if (!confirm('Delete this resource?')) return;
    let resources = Storage.get('resources') || [];
    resources = resources.filter(r => r.id !== id);
    Storage.set('resources', resources);
    Toast.success('Resource deleted.');
    this.render();
  }
};
