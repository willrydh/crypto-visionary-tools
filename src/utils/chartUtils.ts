
/**
 * Apply Simple Moving Average (SMA) to data
 * @param data Array of data points with a price property
 * @param period Period for the SMA calculation
 * @returns Data array with SMA values added
 */
export const applySMA = (data: any[], period: number) => {
  if (!data || data.length === 0 || !period || period <= 0) {
    return data;
  }

  // Ensure data is sorted by timestamp in ascending order
  const sortedData = [...data].sort((a, b) => {
    if (a.timestamp && b.timestamp) {
      return a.timestamp - b.timestamp;
    }
    return 0;
  });

  // Calculate SMA for each point
  return sortedData.map((point, index) => {
    // We don't have enough prior data points before index < period
    if (index < period - 1) {
      return { ...point, sma: null };
    }

    // Calculate sum of prices for the period
    let sum = 0;
    for (let i = 0; i < period; i++) {
      const pricePoint = sortedData[index - i];
      sum += pricePoint.price;
    }

    // Calculate average and add to point
    const sma = sum / period;
    return { ...point, sma };
  });
};
