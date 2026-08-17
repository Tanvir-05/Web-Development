/* ========================================
   Authentication — CampusNova
   Login & Registration pages
   ======================================== */

const Auth = {
  renderLogin() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="auth-layout">
        <div class="auth-container">
          <div class="auth-card">
            <div class="auth-logo">
              <div class="auth-logo-icon">CN</div>
              <div class="auth-logo-text">
                <span class="auth-logo-name">CampusNova</span>
                <span class="auth-logo-tagline">Student Collaboration Hub</span>
              </div>
            </div>

            <h2 class="auth-title">Welcome Back</h2>
            <p class="auth-subtitle">Sign in to continue to your workspace</p>

            <form class="auth-form" id="login-form">
              <div class="form-group">
                <label class="form-label" for="login-email">University Email</label>
                <input class="form-input" type="email" id="login-email" placeholder="you@diu.edu.bd" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="login-password">Password</label>
                <input class="form-input" type="password" id="login-password" placeholder="Enter your password" required>
              </div>

              <div class="auth-options">
                <label class="form-checkbox">
                  <input type="checkbox" id="remember-me"> Remember me
                </label>
                <a href="#" class="btn-link" onclick="event.preventDefault(); Toast.info('Password reset is not available in this prototype.')">Forgot password?</a>
              </div>

              <button type="submit" class="btn btn-primary">Sign In</button>
            </form>

            <div class="auth-divider">or continue with demo</div>

            <div class="auth-demo-buttons">
              <button class="btn btn-secondary" onclick="Auth.demoLogin('student')">
                ${Icons.user} Continue as Demo Student
              </button>
              <button class="btn btn-secondary" onclick="Auth.demoLogin('admin')">
                ${Icons.shield} Continue as Admin
              </button>
            </div>

            <p class="auth-footer">
              Don't have an account? <a href="#/register">Register here</a>
            </p>
          </div>
        </div>
      </div>
    `;

    document.getElementById('login-form').addEventListener('submit', (e) => {
      e.preventDefault();
      Auth.handleLogin();
    });
  },

  renderRegister() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="auth-layout">
        <div class="auth-container">
          <div class="auth-card">
            <div class="auth-logo">
              <div class="auth-logo-icon">CN</div>
              <div class="auth-logo-text">
                <span class="auth-logo-name">CampusNova</span>
                <span class="auth-logo-tagline">Student Collaboration Hub</span>
              </div>
            </div>

            <h2 class="auth-title">Create Account</h2>
            <p class="auth-subtitle">Join your university's collaboration platform</p>

            <form class="auth-form" id="register-form">
              <div class="auth-register-form">
                <div class="form-group">
                  <label class="form-label" for="reg-name">Full Name</label>
                  <input class="form-input" type="text" id="reg-name" placeholder="Enter your full name" required>
                </div>

                <div class="form-group" style="margin-top:var(--space-4)">
                  <label class="form-label" for="reg-email">University Email</label>
                  <input class="form-input" type="email" id="reg-email" placeholder="you@diu.edu.bd" required>
                </div>

                <div class="form-row" style="margin-top:var(--space-4)">
                  <div class="form-group">
                    <label class="form-label" for="reg-password">Password</label>
                    <input class="form-input" type="password" id="reg-password" placeholder="Min. 6 characters" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="reg-confirm">Confirm Password</label>
                    <input class="form-input" type="password" id="reg-confirm" placeholder="Re-enter password" required>
                  </div>
                </div>

                <div class="form-row" style="margin-top:var(--space-4)">
                  <div class="form-group">
                    <label class="form-label" for="reg-department">Department</label>
                    <select class="form-select" id="reg-department" required>
                      <option value="">Select Department</option>
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Business Administration">Business Administration</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="reg-batch">Batch</label>
                    <select class="form-select" id="reg-batch" required>
                      <option value="">Select Batch</option>
                      <option value="Batch 40">Batch 40</option>
                      <option value="Batch 41">Batch 41</option>
                      <option value="Batch 42">Batch 42</option>
                      <option value="Batch 43">Batch 43</option>
                      <option value="Batch 44">Batch 44</option>
                    </select>
                  </div>
                </div>

                <div class="form-group" style="margin-top:var(--space-4)">
                  <label class="form-label" for="reg-interests">Academic Interests</label>
                  <input class="form-input" type="text" id="reg-interests" placeholder="e.g., Web Development, AI, Cloud">
                  <span class="form-hint">Separate with commas</span>
                </div>

                <div class="form-group" style="margin-top:var(--space-4)">
                  <label class="form-label" for="reg-skills">Skills</label>
                  <input class="form-input" type="text" id="reg-skills" placeholder="e.g., JavaScript, Python, React">
                  <span class="form-hint">Separate with commas</span>
                </div>
              </div>

              <button type="submit" class="btn btn-primary" style="margin-top:var(--space-4)">Create Account</button>
            </form>

            <p class="auth-footer">
              Already have an account? <a href="#/login">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    `;

    document.getElementById('register-form').addEventListener('submit', (e) => {
      e.preventDefault();
      Auth.handleRegister();
    });
  },

  handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
      Toast.error('Please enter your email and password.');
      return;
    }

    if (!Utils.isValidEmail(email)) {
      Toast.error('Please enter a valid email address.');
      return;
    }

    const users = Storage.get('users') || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      AppState.setUser(user);
      Toast.success(`Welcome back, ${user.name}!`);
      Router.navigate('/dashboard');
    } else {
      Toast.error('Invalid email or password.');
    }
  },

  handleRegister() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    const department = document.getElementById('reg-department').value;
    const batch = document.getElementById('reg-batch').value;
    const interests = document.getElementById('reg-interests').value.split(',').map(s => s.trim()).filter(Boolean);
    const skills = document.getElementById('reg-skills').value.split(',').map(s => s.trim()).filter(Boolean);

    // Validation
    if (!name || !email || !password || !department || !batch) {
      Toast.error('Please fill in all required fields.');
      return;
    }

    if (!Utils.isValidEmail(email)) {
      Toast.error('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      Toast.error('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirm) {
      Toast.error('Passwords do not match.');
      return;
    }

    const users = Storage.get('users') || [];
    if (users.find(u => u.email === email)) {
      Toast.error('An account with this email already exists.');
      return;
    }

    const newUser = {
      id: 'user-' + Utils.generateId(),
      name,
      email,
      password,
      role: 'student',
      department,
      batch,
      university: 'Daffodil International University',
      avatar: null,
      skills,
      interests,
      courses: [],
      about: '',
      availability: 'available',
      status: 'active',
      privacy: {
        profileVisible: true,
        showEmail: true,
        showSkills: true,
        showAvailability: true
      },
      joinDate: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    Storage.set('users', users);

    Toast.success('Account created successfully! Please sign in.');
    Router.navigate('/login');
  },

  demoLogin(type) {
    const users = Storage.get('users') || [];
    let user;

    if (type === 'admin') {
      user = users.find(u => u.role === 'admin');
    } else {
      user = users.find(u => u.email === 'kaida@diu.edu.bd' || u.id === 'user-1');
    }

    if (user) {
      AppState.setUser(user);
      Toast.success(`Welcome, ${user.name}!`);
      Router.navigate('/dashboard');
    } else {
      Toast.error('Demo account not found. Try resetting demo data.');
    }
  },

  logout() {
    AppState.logout();
    Toast.info('You have been logged out.');
    Router.navigate('/login');
  }
};
