/* ========================================
   Chatbot — CampusNova
   Rule-based assistant
   ======================================== */

const Chatbot = {
  messages: [],

  render() {
    if (this.messages.length === 0) {
      this.messages.push({
        sender: 'bot',
        text: 'Hello! I\'m the CampusNova Assistant. I can help you with teams, tasks, resources, and deadlines. What would you like to know?',
        time: new Date().toISOString()
      });
    }

    const content = document.getElementById('main-content');
    content.innerHTML = `
      <div class="chatbot-container">
        <div class="chatbot-card">
          <div class="chatbot-header">
            <div class="chatbot-avatar">${Icons.bot}</div>
            <div class="chatbot-header-info">
              <h3 class="chatbot-header-name">CampusNova Assistant</h3>
              <p class="chatbot-header-status"><span class="status-dot active"></span> AI Academic Assistant • Online</p>
            </div>
            <button class="btn btn-sm btn-secondary" onclick="Chatbot.clearChat()" title="Clear Chat History">Clear Chat</button>
          </div>

          <div class="chatbot-suggestions">
            <button class="chatbot-suggestion" onclick="Chatbot.askQuestion('How do I create a team?')">✨ How do I create a team?</button>
            <button class="chatbot-suggestion" onclick="Chatbot.askQuestion('What tasks are due soon?')">⚡ What tasks are due soon?</button>
            <button class="chatbot-suggestion" onclick="Chatbot.askQuestion('Show my active projects')">📂 Show my active projects</button>
            <button class="chatbot-suggestion" onclick="Chatbot.askQuestion('How do I upload notes?')">📝 How do I upload notes?</button>
          </div>

          <div class="chat-messages" id="chatbot-messages">
            ${this.messages.map(m => `
              <div class="chat-message ${m.sender === 'bot' ? 'incoming' : 'outgoing'}">
                ${m.sender === 'bot' ? `
                  <div class="avatar avatar-sm chatbot-bot-icon">
                    ${Icons.bot}
                  </div>
                ` : ''}
                <div class="chat-message-content">
                  ${m.sender === 'bot' ? `<p class="chat-sender-name">CampusNova AI</p>` : ''}
                  <div class="chat-bubble">${Utils.escapeHtml(m.text)}</div>
                  <p class="chat-message-time">${Utils.formatTime(m.time)}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="chat-input-wrapper">
            <input class="chat-input" id="chatbot-input" placeholder="Ask CampusNova AI anything..." onkeydown="if(event.key==='Enter') Chatbot.sendMessage()">
            <button class="chat-send-btn" onclick="Chatbot.sendMessage()" title="Send Question">
              ${Icons.send}
            </button>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const container = document.getElementById('chatbot-messages');
      if (container) container.scrollTop = container.scrollHeight;
    }, 50);
  },

  clearChat() {
    this.messages = [];
    this.render();
  },

  askQuestion(question) {
    document.getElementById('chatbot-input').value = question;
    this.sendMessage();
  },

  sendMessage() {
    const input = document.getElementById('chatbot-input');
    const text = input.value.trim();
    if (!text) return;

    // Add user message
    this.messages.push({ sender: 'user', text, time: new Date().toISOString() });
    input.value = '';

    // Generate bot response
    const response = this.getResponse(text);

    setTimeout(() => {
      this.messages.push({ sender: 'bot', text: response, time: new Date().toISOString() });
      this.render();
    }, 500);

    this.render();
  },

  getResponse(input) {
    const q = input.toLowerCase();
    const user = AppState.getUser();
    const tasks = Storage.get('tasks') || [];
    const teams = Storage.get('teams') || [];
    const myTeams = teams.filter(t => t.members.includes(user.id));
    const myTasks = tasks.filter(t => t.assignee === user.id && t.status !== 'completed');

    // Team creation
    if (q.includes('create') && q.includes('team')) {
      return 'To create a team, go to "My Teams" from the sidebar and click the "Create Team" button. You\'ll need to provide a team name, project title, course, and other details.';
    }

    // Task/deadline
    if (q.includes('deadline') || q.includes('due') || q.includes('task')) {
      if (myTasks.length === 0) {
        return 'You have no pending tasks. Great job staying on top of your work!';
      }
      const soonest = myTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];
      return `You have ${myTasks.length} pending task(s). Your nearest deadline is "${soonest.title}" due on ${Utils.formatDate(soonest.deadline)} (${Utils.daysUntil(soonest.deadline)} days from now).`;
    }

    // Active projects
    if (q.includes('project') || q.includes('active')) {
      if (myTeams.length === 0) {
        return 'You are not currently part of any teams. Visit "My Teams" to create or join one.';
      }
      return `You are part of ${myTeams.length} team(s): ${myTeams.map(t => t.name).join(', ')}. Visit "My Teams" to see details.`;
    }

    // Upload notes
    if (q.includes('upload') || q.includes('notes') || q.includes('resource') || q.includes('file')) {
      return 'To upload notes or resources, go to "Resources" from the sidebar and click "Upload File". You can categorize your files as Lecture Notes, Assignments, Slides, References, or Project Files.';
    }

    // Invite teammate
    if (q.includes('invite') || q.includes('teammate') || q.includes('member')) {
      return 'To invite a teammate, open your team details and go to the "Members" tab. If you are the team lead, you\'ll see an "Invite Member" button. You can also find students using the "Search" page.';
    }

    // Search
    if (q.includes('search') || q.includes('find') || q.includes('discover')) {
      return 'Use the "Search" page from the sidebar to find students, teams, courses, and resources. You can filter by department, skills, and availability.';
    }

    // Messages
    if (q.includes('message') || q.includes('chat') || q.includes('communication')) {
      return 'Go to "Messages" from the sidebar to view your conversations. You can chat with individual students or in team group chats.';
    }

    // Noticeboard
    if (q.includes('notice') || q.includes('announcement') || q.includes('event')) {
      return 'Check the "Notice Board" from the sidebar for university announcements, events, and deadline notices. You can filter by category.';
    }

    // Profile
    if (q.includes('profile') || q.includes('edit') && q.includes('profile')) {
      return 'Go to "My Profile" from the sidebar to view and edit your profile. You can update your skills, interests, availability, and privacy settings.';
    }

    // Help
    if (q.includes('help') || q.includes('what can you do') || q.includes('features')) {
      return 'I can help you with: creating teams, checking deadlines, uploading resources, inviting teammates, finding students, and navigating CampusNova. Just ask!';
    }

    // Greeting
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
      return `Hi ${user.name.split(' ')[0]}! How can I help you today? You can ask me about teams, tasks, resources, or anything CampusNova-related.`;
    }

    // Default
    return 'I\'m still a prototype assistant. I can help with teams, tasks, resources, deadlines, profiles, and navigation. Try asking about one of these topics!';
  }
};
