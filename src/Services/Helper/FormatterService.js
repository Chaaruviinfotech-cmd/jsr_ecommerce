/**
 * FormatterService - Object-Oriented Value & String Formatter
 */
export class FormatterService {
  /**
   * Format Indian Rupee currency (e.g. ₹54,320)
   */
  formatCurrency(value) {
    const num = Number(value) || 0;
    return '₹' + num.toLocaleString('en-IN');
  }

  /**
   * Format date into readable string e.g. "06 Jun 2024, 10:30 AM"
   */
  formatDate(dateInput) {
    if (!dateInput) return 'Today';
    try {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return String(dateInput);

      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return String(dateInput);
    }
  }

  /**
   * Format weight string with unit (e.g., 200 gm, 1 kg)
   */
  formatWeight(weight, defaultUnit = '1 kg') {
    if (!weight) return defaultUnit;
    return String(weight);
  }

  /**
   * Return color badge class/styles for order statuses
   */
  getOrderStatusBadge(status) {
    const s = String(status || '').toLowerCase();
    if (s.includes('deliver')) {
      return {
        bg: '#dcfce7',
        text: '#15803d',
        border: '#86efac',
        label: 'Delivered'
      };
    }
    if (s.includes('process') || s.includes('confirm') || s.includes('pack')) {
      return {
        bg: '#fef3c7',
        text: '#b45309',
        border: '#fde68a',
        label: 'Processing'
      };
    }
    if (s.includes('out')) {
      return {
        bg: '#e0f2fe',
        text: '#0369a1',
        border: '#bae6fd',
        label: 'Out for Delivery'
      };
    }
    if (s.includes('cancel')) {
      return {
        bg: '#fee2e2',
        text: '#b91c1c',
        border: '#fca5a5',
        label: 'Cancelled'
      };
    }
    return {
      bg: '#ffedd5',
      text: '#c2410c',
      border: '#fed7aa',
      label: 'Pending'
    };
  }
}

const formatterService = new FormatterService();
export default formatterService;
