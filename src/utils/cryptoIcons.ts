
// Map of cryptocurrency symbols to their icon URLs
// Source: https://github.com/ErikThiart/cryptocurrency-icons

const baseUrl = "https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/icons/";

export const getCryptoIconUrl = (symbol: string): string => {
  // Normalize the symbol (lowercase)
  const normalizedSymbol = symbol.toLowerCase();
  
  return `${baseUrl}${normalizedSymbol}.svg`;
};

// Fallback function in case the icon doesn't load
export const getFallbackIconUrl = (symbol: string): string => {
  // Return a colored circle with the first letter as fallback
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23627EEA'/%3E%3Ctext x='16' y='20' font-size='14' text-anchor='middle' fill='white' font-family='Arial, sans-serif'%3E${symbol.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;
};
