// ==============================================================================
// UNIT TESTS: Currency & Monetary Utilities
// ==============================================================================

import {
  formatPaise,
  rupeesToPaise,
  calculateTaxPaise,
  calculateDiscountPaise,
} from '../utils/currency';

describe('EMBER Monetary Utilities (Paise precision)', () => {
  describe('formatPaise', () => {
    it('formats round INR amounts without decimals', () => {
      expect(formatPaise(29900)).toBe('₹299');
      expect(formatPaise(84900)).toBe('₹849');
      expect(formatPaise(0)).toBe('₹0');
    });

    it('formats amounts with decimals when fractional paise exist', () => {
      expect(formatPaise(29950)).toBe('₹299.50');
      expect(formatPaise(14975)).toBe('₹149.75');
    });

    it('handles negative or invalid values gracefully', () => {
      expect(formatPaise(NaN as any)).toBe('₹0');
      expect(formatPaise(null as any)).toBe('₹0');
    });
  });

  describe('rupeesToPaise', () => {
    it('converts INR rupees to integer paise', () => {
      expect(rupeesToPaise(299)).toBe(29900);
      expect(rupeesToPaise(79.5)).toBe(7950);
      expect(rupeesToPaise(837)).toBe(83700);
    });
  });

  describe('calculateTaxPaise', () => {
    it('calculates 5% GST tax on subtotal accurately', () => {
      // Reference Screen 12: Subtotal ₹797 (79700 paise) -> Tax 5% is ₹39.85 -> rounded to 3985 paise (approx ₹40)
      const tax = calculateTaxPaise(79700, 5.0);
      expect(tax).toBe(3985);
      expect(formatPaise(tax)).toBe('₹39.85');
    });
  });

  describe('calculateDiscountPaise', () => {
    it('calculates percentage coupon with cap', () => {
      // 50% off up to ₹150 (15000 paise)
      const discount = calculateDiscountPaise(50000, 'percentage', 50, 15000);
      expect(discount).toBe(15000); // capped at 15000
    });

    it('calculates flat coupon discount', () => {
      // Flat ₹100 off (10000 paise)
      const discount = calculateDiscountPaise(60000, 'flat', 10000);
      expect(discount).toBe(10000);
    });

    it('does not exceed subtotal', () => {
      const discount = calculateDiscountPaise(5000, 'flat', 10000);
      expect(discount).toBe(5000);
    });

    it('returns 0 discount when subtotal is below minimum order requirement', () => {
      // Subtotal ₹300 (30000 paise), min order ₹500 (50000 paise)
      const discount = calculateDiscountPaise(30000, 'flat', 10000, undefined, 50000);
      expect(discount).toBe(0);
    });
  });
});

