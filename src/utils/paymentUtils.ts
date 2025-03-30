
// Format currency with currency symbol
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Calculate savings amount between monthly and yearly plans
export const calculateYearlySavings = (monthlyPrice: number, yearlyPrice: number): number => {
  return (monthlyPrice * 12) - yearlyPrice;
};

// Format savings as percentage
export const calculateSavingsPercentage = (monthlyPrice: number, yearlyPrice: number): number => {
  const monthlyCostPerYear = monthlyPrice * 12;
  return Math.round(((monthlyCostPerYear - yearlyPrice) / monthlyCostPerYear) * 100);
};

// Validate credit card number (basic Luhn algorithm check)
export const isValidCreditCard = (cardNumber: string): boolean => {
  // Remove spaces and dashes
  const value = cardNumber.replace(/\s+|-/g, '');
  
  // Accept only digits
  if (/[^0-9]/.test(value)) return false;
  
  // Luhn algorithm validation
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = value.length - 1; i >= 0; i--) {
    let digit = parseInt(value.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return (sum % 10) === 0;
};

// Generate masked card number for display
export const maskCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s+|-/g, '');
  return cleaned.length > 4 
    ? `•••• •••• •••• ${cleaned.slice(-4)}`
    : cleaned;
};

// Format expiry date as MM/YY
export const formatExpiryDate = (input: string): string => {
  const cleaned = input.replace(/\D/g, '');
  
  if (cleaned.length <= 2) {
    return cleaned;
  } else {
    return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
  }
};
