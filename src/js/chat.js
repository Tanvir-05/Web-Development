/* ========================================
   Chat / Messages — CampusNova
   Messaging interface
   ======================================== */

const Chat = {
  activeConversation: null,

  render() {
    const user = AppState.getUser();
    const conversations = Storage.get('conversations') || [];
    const users = Storage.get('users') || [];

    const content = document.getElementById('main-content');
    content.innerHTML = `
      <div class="messages-layout">
        <!-- Conversations Panel -->
        <div class="conversations-panel" id="conversations-panel">
          <div class="conversations-header">
            <div class="search-input-wrapper">
              <span class="search-icon">${Icons.search}</span>
              <input class="form-input" placeholder="Search conversations..." oninput="Chat.filterConversations(this.value)">
            </div>
          </div>
          <div class="conversations-list" id="conversations-list">
            ${conversations.map(c => this.renderConversationItem(c, user, users)).join('')}
          </div>
        </div>

        <!-- Chat Panel -->
        <div class="chat-panel" id="chat-panel">
          ${this.activeConversation ? this.renderChatPanel(this.activeConversation, user, users) : `
            <div class="chat-empty">
              <div class="chat-empty-icon">${Icons.messageSquare}</div>
              <h3 class="chat-empty-title">Your Messages</h3>
              <p class="chat-empty-text">Select a student or team conversation from the list to start collaborating.</p>
            </div>
          `}
        </div>
      </div>
    `;
  },

  renderConversationItem(conv, currentUser, users) {
    let name, lastMsg, avatar;

    if (conv.type === 'team') {
      name = conv.name;
      avatar = `<div class="avatar avatar-md" style="background:${Utils.getAvatarColor(name)}">${name.charAt(0)}</div>`;
    } else {
      const otherId = conv.participantIds.find(id => id !== currentUser.id);
      const other = users.find(u => u.id === otherId);
      name = other ? other.name : 'Unknown';
      avatar = `
        <div class="avatar-wrapper">
          ${Utils.renderAvatar(name, 'md')}
          <span class="avatar-status online"></span>
        </div>
      `;
    }

    lastMsg = conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;
    const preview = lastMsg ? (lastMsg.senderId === currentUser.id ? 'You: ' : '') + Utils.truncate(lastMsg.text, 35) : 'No messages yet';
    const time = lastMsg ? Utils.formatRelativeTime(lastMsg.time) : '';
    const isActive = this.activeConversation && this.activeConversation.id === conv.id;

    return `
      <div class="conversation-item ${isActive ? 'active' : ''}" onclick="Chat.openConversation('${conv.id}')">
        ${avatar}
        <div class="conversation-info">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <p class="conversation-name">${Utils.escapeHtml(name)}</p>
            <span class="conversation-time">${time}</span>
          </div>
          <p class="conversation-preview">${Utils.escapeHtml(preview)}</p>
        </div>
      </div>
    `;
  },

  renderChatPanel(conv, currentUser, users) {
    let name, statusHtml, avatar;

    if (conv.type === 'team') {
      name = conv.name;
      avatar = `<div class="avatar avatar-md" style="background:${Utils.getAvatarColor(name)}">${name.charAt(0)}</div>`;
      statusHtml = `<span class="chat-header-status">${conv.participantIds.length} team members</span>`;
    } else {
      const otherId = conv.participantIds.find(id => id !== currentUser.id);
      const other = users.find(u => u.id === otherId);
      name = other ? other.name : 'Unknown';
      avatar = `
        <div class="avatar-wrapper">
          ${Utils.renderAvatar(name, 'md')}
          <span class="avatar-status online"></span>
        </div>
      `;
      statusHtml = `<span class="chat-header-status online"><span class="status-dot active"></span> Active Now</span>`;
    }

    return `
      <div class="chat-header">
        <div style="display:flex;align-items:center;gap:var(--space-3)">
          ${avatar}
          <div class="chat-header-info">
            <p class="chat-header-name">${Utils.escapeHtml(name)}</p>
            ${statusHtml}
          </div>
        </div>
      </div>

      <div class="chat-messages" id="chat-messages">
        <div class="chat-date-divider"><span>Today</span></div>
        ${conv.messages.map(msg => {
          const isOutgoing = msg.senderId === currentUser.id;
          const sender = users.find(u => u.id === msg.senderId);
          return `
            <div class="chat-message ${isOutgoing ? 'outgoing' : 'incoming'}">
              ${!isOutgoing ? Utils.renderAvatar(sender ? sender.name : '?', 'sm') : ''}
              <div class="chat-message-content">
                ${!isOutgoing && conv.type === 'team' ? `<p class="chat-sender-name">${sender ? Utils.escapeHtml(sender.name) : 'Unknown'}</p>` : ''}
                <div class="chat-bubble">${Utils.escapeHtml(msg.text)}</div>
                <p class="chat-message-time">${Utils.formatTime(msg.time)}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="chat-input-wrapper">
        <input class="chat-input" id="chat-message-input" placeholder="Write a message to ${Utils.escapeHtml(name)}..." onkeydown="if(event.key==='Enter') Chat.sendMessage()">
        <button class="chat-send-btn" onclick="Chat.sendMessage()" title="Send Message">
          ${Icons.send}
        </button>
      </div>
    `;
  },

  openConversation(convId) {
    const conversations = Storage.get('conversations') || [];
    this.activeConversation = conversations.find(c => c.id === convId);
    this.render();

    // Scroll to bottom
    setTimeout(() => {
      const msgContainer = document.getElementById('chat-messages');
      if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
    }, 50);
  },

  sendMessage() {
    const input = document.getElementById('chat-message-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const conversations = Storage.get('conversations') || [];
    const conv = conversations.find(c => c.id === this.activeConversation.id);
    if (!conv) return;

    const newMsg = {
      id: 'msg-' + Utils.generateId(),
      senderId: AppState.getUser().id,
      text,
      time: new Date().toISOString()
    };

    conv.messages.push(newMsg);
    Storage.set('conversations', conversations);
    this.activeConversation = conv;

    // Re-render chat panel only
    const users = Storage.get('users') || [];
    const chatPanel = document.getElementById('chat-panel');
    if (chatPanel) {
      chatPanel.innerHTML = this.renderChatPanel(conv, AppState.getUser(), users);
      setTimeout(() => {
        const msgContainer = document.getElementById('chat-messages');
        if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
      }, 50);
    }

    // Update conversation list
    const listContainer = document.getElementById('conversations-list');
    if (listContainer) {
      listContainer.innerHTML = conversations.map(c => this.renderConversationItem(c, AppState.getUser(), users)).join('');
    }
  },

  filterConversations(query) {
    const q = query.toLowerCase();
    const conversations = Storage.get('conversations') || [];
    const users = Storage.get('users') || [];
    const currentUser = AppState.getUser();

    const filtered = conversations.filter(c => {
      if (c.type === 'team') return c.name.toLowerCase().includes(q);
      const otherId = c.participantIds.find(id => id !== currentUser.id);
      const other = users.find(u => u.id === otherId);
      return other && other.name.toLowerCase().includes(q);
    });

    const listContainer = document.getElementById('conversations-list');
    if (listContainer) {
      listContainer.innerHTML = filtered.map(c => this.renderConversationItem(c, currentUser, users)).join('');
    }
  }
};
