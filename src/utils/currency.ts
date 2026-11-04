// ==============================================================================
// EMBER MONETARY UTILITIES — INTEGER PAISE CALCULATIONS
// All internal transactions are stored in paise (1 INR = 100 paise)
// ==============================================================================

/**
 * Converts integer paise to formatted INR string.
 * Example: 29900 -> "₹299", 29950 -> "₹299.50"
 */
export function formatPaise(paise: number, showDecimalsIfZero = false): string {
  if (isNaN(paise) || paise === null || paise === undefined) {
    return '₹0';
  }
  
  const rupees = paise / 100;
  
  if (!showDecimalsIfZero && rupees % 1 === 0) {
    return `₹${Math.round(rupees).toLocaleString('en-IN')}`;
  }
  
  return `₹${rupees.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Converts rupees float to integer paise.
 * Example: 299 -> 29900
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Calculates percentage-based tax on subtotal (or discounted subtotal).
 * Example: subtotal 79700 (₹797), taxRate 5% -> 3985 paise
 */
export function calculateTaxPaise(subtotalPaise: number, taxRatePercent: number): number {
  if (subtotalPaise <= 0 || taxRatePercent <= 0) return 0;
  return Math.round((subtotalPaise * taxRatePercent) / 100);
}

/**
 * Calculates discount based on coupon rules with strict min spend check and cap.
 */
export function calculateDiscountPaise(
  subtotalPaise: number,
  discountType: 'percentage' | 'flat',
  discountValue: number,
  maxDiscountPaise?: number,
  minOrderAmountPaise?: number
): number {
  if (subtotalPaise <= 0) return 0;
  if (minOrderAmountPaise && subtotalPaise < minOrderAmountPaise) {
    return 0;
  }

  let discountPaise = 0;
  
  if (discountType === 'flat') {
    discountPaise = discountValue;
  } else if (discountType === 'percentage') {
    discountPaise = Math.round((subtotalPaise * discountValue) / 100);
  }
  
  if (maxDiscountPaise && discountPaise > maxDiscountPaise) {
    discountPaise = maxDiscountPaise;
  }
  
  return Math.min(discountPaise, subtotalPaise);
}
