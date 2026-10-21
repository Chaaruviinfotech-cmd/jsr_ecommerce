/**
 * CalculationService - Object-Oriented Service for all e-commerce financial & math calculations
 */
export class CalculationService {
  constructor(freeDeliveryThreshold = 499, standardDeliveryFee = 0) {
    this.freeDeliveryThreshold = freeDeliveryThreshold;
    this.standardDeliveryFee = standardDeliveryFee;
  }

  /**
   * Calculate line total for a single product item
   */
  calculateItemTotal(price, quantity) {
    const numPrice = Number(price) || 0;
    const numQty = Number(quantity) || 0;
    return Math.max(0, numPrice * numQty);
  }

  /**
   * Calculate subtotal for an array of cart items
   */
  calculateSubtotal(items = []) {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + (price * qty);
    }, 0);
  }

  /**
   * Calculate delivery charges based on subtotal
   */
  calculateDeliveryFee(subtotal) {
    const amount = Number(subtotal) || 0;
    if (amount <= 0) return 0;
    return amount >= this.freeDeliveryThreshold ? 0 : this.standardDeliveryFee;
  }

  /**
   * Calculate discount from a coupon or discount object
   */
  calculateDiscount(subtotal, coupon = null) {
    const amount = Number(subtotal) || 0;
    if (!coupon || amount <= 0) return 0;

    if (coupon.type === 'percentage') {
      const percent = Number(coupon.value) || 0;
      return (amount * percent) / 100;
    }

    return Number(coupon.discount || coupon.value || 0);
  }

  /**
   * Calculate final grand total
   */
  calculateGrandTotal(subtotal, discount = 0, deliveryFee = 0) {
    const sub = Number(subtotal) || 0;
    const disc = Number(discount) || 0;
    const fee = Number(deliveryFee) || 0;
    return Math.max(0, sub - disc + fee);
  }

  /**
   * Calculate price discount percentage (e.g., ₹60 vs ₹67 => 10% off)
   */
  calculateDiscountPercentage(currentPrice, originalPrice) {
    const current = Number(currentPrice) || 0;
    const original = Number(originalPrice) || 0;
    if (original <= 0 || current >= original) return 0;
    return Math.round(((original - current) / original) * 100);
  }

  /**
   * Calculate absolute savings amount
   */
  calculateSavings(currentPrice, originalPrice, quantity = 1) {
    const current = Number(currentPrice) || 0;
    const original = Number(originalPrice) || 0;
    const qty = Number(quantity) || 1;
    if (original <= current) return 0;
    return (original - current) * qty;
  }

  /**
   * Calculate percentage growth between two numbers (for Admin dashboard stats)
   */
  calculateGrowthPercentage(current, previous) {
    const curr = Number(current) || 0;
    const prev = Number(previous) || 0;
    if (prev <= 0) return curr > 0 ? '+100%' : '0%';
    const diff = ((curr - prev) / prev) * 100;
    const sign = diff >= 0 ? '+' : '';
    return `${sign}${diff.toFixed(1)}%`;
  }
}

// Export singleton instance
const calculationService = new CalculationService();
export default calculationService;
