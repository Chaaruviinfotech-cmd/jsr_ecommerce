/**
 * ValidationService - Object-Oriented Form & Input Validator
 */
export class ValidationService {
  /**
   * Validate standard 10-digit Indian mobile number
   */
  isValidIndianMobile(mobile) {
    if (!mobile) return false;
    const clean = String(mobile).replace(/\D/g, '');
    // Support optional leading 91 or 0
    if (clean.length === 10) return /^[6-9]\d{9}$/.test(clean);
    if (clean.length === 12 && clean.startsWith('91')) return /^[6-9]\d{9}$/.test(clean.slice(2));
    return false;
  }

  /**
   * Validate standard email format
   */
  isValidEmail(email) {
    if (!email) return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(String(email).trim());
  }

  /**
   * Validate standard 6-digit Indian Postal Code
   */
  isValidPincode(pincode) {
    if (!pincode) return false;
    return /^\d{6}$/.test(String(pincode).trim());
  }

  /**
   * Validate customer checkout form
   */
  validateCheckout(form) {
    const errors = {};

    if (!form.customer_name || form.customer_name.trim().length < 2) {
      errors.customer_name = 'Please enter your full name (at least 2 characters).';
    }

    if (!this.isValidIndianMobile(form.customer_mobile)) {
      errors.customer_mobile = 'Please enter a valid 10-digit mobile number.';
    }

    if (form.customer_email && !this.isValidEmail(form.customer_email)) {
      errors.customer_email = 'Please enter a valid email address.';
    }

    if (!form.delivery_address || form.delivery_address.trim().length < 5) {
      errors.delivery_address = 'Please enter your delivery street address.';
    }

    if (!this.isValidPincode(form.pincode)) {
      errors.pincode = 'Please enter a valid 6-digit delivery pincode.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

const validationService = new ValidationService();
export default validationService;
