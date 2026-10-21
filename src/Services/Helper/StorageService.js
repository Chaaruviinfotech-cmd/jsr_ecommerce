/**
 * StorageService - Object-Oriented Safe LocalStorage wrapper
 */
export class StorageService {
  constructor(prefix = 'jsr_') {
    this.prefix = prefix;
  }

  _getKey(key) {
    return `${this.prefix}${key}`;
  }

  set(key, value) {
    if (typeof window === 'undefined') return;
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this._getKey(key), serialized);
    } catch (e) {
      console.warn('StorageService.set error', e);
    }
  }

  get(key, defaultValue = null) {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(this._getKey(key));
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('StorageService.get error', e);
      return defaultValue;
    }
  }

  remove(key) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(this._getKey(key));
    } catch (e) {
      console.warn('StorageService.remove error', e);
    }
  }

  clear() {
    if (typeof window === 'undefined') return;
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(this.prefix))
        .forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('StorageService.clear error', e);
    }
  }
}

const storageService = new StorageService();
export default storageService;
