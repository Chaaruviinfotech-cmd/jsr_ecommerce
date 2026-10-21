/**
 * ThemeService - Object-Oriented Theme Manager
 * Allows setting themes from Admin Settings, localStorage persistence, and dynamic CSS injection
 */
export class ThemeService {
  constructor() {
    this.storageKey = 'jsr_custom_theme';
    this.defaultTheme = {
      name: 'Default Farm Green',
      primary: '#15803d',           // Main farm green (buttons, badges, active tabs)
      primaryHover: '#166534',      // Deep forest green
      primaryLight: '#dcfce7',      // Soft mint pill background
      primaryUltraLight: '#f0fdf4', // Soft mint section background
      accentOrange: '#ea580c',      // Discount tag color
      accentDark: '#0f291e',        // Dark green admin sidebar & footer
      accentDarkHover: '#174733',   // Admin active menu hover
      whatsapp: '#25D366',          // WhatsApp brand green
      textPrimary: '#111827',       // Dark typography
      textSecondary: '#4b5563',     // Subheadings / body
      textMuted: '#9ca3af',         // Borders & placeholders
      bgLight: '#fdfcf7',           // Clean warm page background
      borderLight: '#e5e7eb',       // Card border
      cardBg: '#ffffff',            // White card background
      radius: '12px'                // Border radius
    };

    this.presets = {
      default: {
        name: 'Farm Green (Default)',
        primary: '#15803d',
        primaryHover: '#166534',
        primaryLight: '#dcfce7',
        primaryUltraLight: '#f0fdf4',
        accentDark: '#0f291e'
      },
      emerald: {
        name: 'Emerald Fresh',
        primary: '#059669',
        primaryHover: '#047857',
        primaryLight: '#d1fae5',
        primaryUltraLight: '#ecfdf5',
        accentDark: '#064e3b'
      },
      deepForest: {
        name: 'Deep Forest Green',
        primary: '#166534',
        primaryHover: '#14532d',
        primaryLight: '#dcfce7',
        primaryUltraLight: '#f0fdf4',
        accentDark: '#052e16'
      },
      freshTeal: {
        name: 'Fresh Teal',
        primary: '#0d9488',
        primaryHover: '#0f766e',
        primaryLight: '#ccfbf1',
        primaryUltraLight: '#f0fdfa',
        accentDark: '#134e4a'
      },
      harvestOrange: {
        name: 'Harvest Organic Amber',
        primary: '#d97706',
        primaryHover: '#b45309',
        primaryLight: '#fef3c7',
        primaryUltraLight: '#fffbeb',
        accentDark: '#451a03'
      }
    };

    this.theme = this.loadTheme();
  }

  loadTheme() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
          return { ...this.defaultTheme, ...JSON.parse(saved) };
        }
      } catch (e) {
        console.warn('ThemeService.loadTheme error:', e);
      }
    }
    return { ...this.defaultTheme };
  }

  saveTheme(themeObj) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(themeObj));
      } catch (e) {
        console.warn('ThemeService.saveTheme error:', e);
      }
    }
  }

  getTheme() {
    return { ...this.theme };
  }

  getPresets() {
    return this.presets;
  }

  applyPreset(presetKey) {
    const preset = this.presets[presetKey];
    if (preset) {
      this.theme = { ...this.theme, ...preset };
      this.saveTheme(this.theme);
      this.injectCssVariables();
      return this.theme;
    }
    return null;
  }

  updateColors(newColors) {
    this.theme = { ...this.theme, ...newColors };
    this.saveTheme(this.theme);
    this.injectCssVariables();
    return this.theme;
  }

  resetDefault() {
    this.theme = { ...this.defaultTheme };
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
    this.injectCssVariables();
    return this.theme;
  }

  injectCssVariables() {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    Object.entries(this.theme).forEach(([key, value]) => {
      if (key !== 'name') {
        const cssVar = '--jsr-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
        root.style.setProperty(cssVar, value);
      }
    });
  }
}

const themeService = new ThemeService();
export default themeService;
