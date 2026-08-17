/* ========================================
   Storage Utility — CampusNova
   Wrapper around localStorage
   ======================================== */

const Storage = {
  PREFIX: 'campusnova_',

  get(key) {
    try {
      const data = localStorage.getItem(this.PREFIX + key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn(`Storage.get error for key "${key}":`, e);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Storage.set error for key "${key}":`, e);
    }
  },

  remove(key) {
    localStorage.removeItem(this.PREFIX + key);
  },

  clear() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(this.PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  },

  has(key) {
    return localStorage.getItem(this.PREFIX + key) !== null;
  }
};
