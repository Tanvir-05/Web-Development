/* ========================================
   Router — CampusNova
   Hash-based SPA router
   ======================================== */

const Router = {
  routes: {},
  currentRoute: null,

  // Register a route
  on(path, handler) {
    this.routes[path] = handler;
  },

  // Navigate to a route
  navigate(path) {
    window.location.hash = path;
  },

  // Get current hash path
  getPath() {
    return window.location.hash.slice(1) || '/login';
  },

  // Parse route and extract params
  matchRoute(path) {
    // Direct match
    if (this.routes[path]) {
      return { handler: this.routes[path], params: {} };
    }

    // Parameterized match (e.g., /teams/:id)
    for (const routePath in this.routes) {
      const routeParts = routePath.split('/');
      const pathParts = path.split('/');

      if (routeParts.length !== pathParts.length) continue;

      const params = {};
      let match = true;

      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
          params[routeParts[i].slice(1)] = pathParts[i];
        } else if (routeParts[i] !== pathParts[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        return { handler: this.routes[routePath], params };
      }
    }

    return null;
  },

  // Handle route change
  handleRoute() {
    const path = this.getPath();

    // Auth guard
    const publicRoutes = ['/login', '/register'];
    if (!publicRoutes.includes(path) && !AppState.isLoggedIn()) {
      this.navigate('/login');
      return;
    }

    // If logged in and trying to access login/register, redirect to dashboard
    if (publicRoutes.includes(path) && AppState.isLoggedIn()) {
      this.navigate('/dashboard');
      return;
    }

    const match = this.matchRoute(path);
    if (match) {
      this.currentRoute = path;
      match.handler(match.params);
      this.updateActiveNav(path);
    } else {
      // 404 — redirect to dashboard
      this.navigate('/dashboard');
    }
  },

  // Update active sidebar nav item
  updateActiveNav(path) {
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      item.classList.remove('active');
      const itemPath = item.getAttribute('data-route');
      if (itemPath && path.startsWith(itemPath)) {
        item.classList.add('active');
      }
    });
  },

  // Initialize router
  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }
};
