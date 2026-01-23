export class SessionManager {
  private static instance: SessionManager;
  private sessionTimeout: NodeJS.Timeout | null = null;
  private readonly SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
  private activityListeners: Array<() => void> = [];

  private constructor() {
    this.initSessionTracking();
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private initSessionTracking() {
    // Track user activity
    const events = ['click', 'keypress', 'scroll', 'mousemove', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, () => this.resetSessionTimer());
    });

    // Check session on page load
    window.addEventListener('load', () => this.checkSession());
    
    // Also check when page becomes visible again
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkSession();
      }
    });
  }

  private resetSessionTimer() {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }

    this.sessionTimeout = setTimeout(async () => {
      await this.handleSessionExpired();
    }, this.SESSION_DURATION);

    // Update last activity timestamp
    localStorage.setItem('lastActivity', Date.now().toString());
    
    // Trigger activity listeners
    this.activityListeners.forEach(listener => listener());
  }

  private async checkSession() {
    const lastActivity = localStorage.getItem('lastActivity');
    const token = localStorage.getItem('token');
    const now = Date.now();

    if (!token) {
      // No token, session is invalid
      await this.handleSessionExpired();
      return;
    }

    if (lastActivity && (now - parseInt(lastActivity)) > this.SESSION_DURATION) {
      // Try to refresh token first
      const refreshed = await this.attemptTokenRefresh();
      if (!refreshed) {
        await this.handleSessionExpired();
      } else {
        this.resetSessionTimer();
      }
    } else {
      this.resetSessionTimer();
    }
  }

  private async attemptTokenRefresh(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await fetch('http://localhost:8080/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return false;
  }

  private async handleSessionExpired() {
    // Clear session data
    this.clearSessionStorage();
    
    // Notify any listeners
    this.activityListeners.forEach(listener => listener());
    
    // Redirect to login with session expired message
    if (window.location.pathname !== '/login' && 
        !window.location.pathname.includes('/register') &&
        !window.location.pathname.includes('/forgot-password')) {
      window.location.href = '/login?session=expired';
    }
  }

  // Add activity listener (for components to know when session is about to expire)
  addActivityListener(listener: () => void) {
    this.activityListeners.push(listener);
  }

  // Remove activity listener
  removeActivityListener(listener: () => void) {
    const index = this.activityListeners.indexOf(listener);
    if (index > -1) {
      this.activityListeners.splice(index, 1);
    }
  }

  // Clear session
  clearSessionStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('lastActivity');
    localStorage.removeItem('user');
    
    // Clear session storage
    sessionStorage.clear();
    
    // Clear any cookies
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=');
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
  }

  // Destroy instance and clean up
  destroy() {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }
    // Remove event listeners
    const events = ['click', 'keypress', 'scroll', 'mousemove', 'touchstart'];
    events.forEach(event => {
      document.removeEventListener(event, () => this.resetSessionTimer());
    });
    
    this.activityListeners = [];
  }

  // Static method to clear session
  static clearSession() {
    const instance = SessionManager.getInstance();
    instance.clearSessionStorage();
    instance.destroy();
  }
}

export default SessionManager;