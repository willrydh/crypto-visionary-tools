
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

/**
 * Format chart timestamps for display
 * @param timestamp Unix timestamp in milliseconds
 * @param timeframe Current chart timeframe
 * @returns Formatted time string
 */
export const formatChartTime = (timestamp: number, timeframe: string): string => {
  const date = new Date(timestamp);
  if (timeframe === '1d') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (timeframe === '7d') {
    return `${date.toLocaleDateString([], { weekday: 'short' })} ${date.toLocaleTimeString([], { hour: '2-digit' })}`;
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

/**
 * Generate evenly spaced timestamps for chart data
 * @param startTime Starting timestamp in milliseconds
 * @param endTime Ending timestamp in milliseconds
 * @param count Number of points to generate
 * @returns Array of evenly spaced timestamps
 */
export const generateTimeIntervals = (startTime: number, endTime: number, count: number): number[] => {
  const result: number[] = [];
  const step = (endTime - startTime) / (count - 1);
  
  for (let i = 0; i < count; i++) {
    result.push(startTime + (step * i));
  }
  
  return result;
};

/**
 * Ensure timestamps are evenly spaced in chart data
 * @param data Chart data with timestamps
 * @param count Desired number of points
 * @returns Data with evenly spaced timestamps
 */
export const normalizeTimeIntervals = (data: any[], count: number = 0): any[] => {
  if (!data || data.length === 0) return data;
  if (count === 0) count = data.length;
  
  // Sort by timestamp
  const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
  
  // Get first and last timestamp
  const startTime = sortedData[0].timestamp;
  const endTime = sortedData[sortedData.length - 1].timestamp;
  
  // Generate evenly spaced timestamps
  const timestamps = generateTimeIntervals(startTime, endTime, count);
  
  // Find closest data points for each timestamp
  return timestamps.map(timestamp => {
    // Find closest data point
    let closestIndex = 0;
    let closestDiff = Math.abs(sortedData[0].timestamp - timestamp);
    
    for (let i = 1; i < sortedData.length; i++) {
      const diff = Math.abs(sortedData[i].timestamp - timestamp);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestIndex = i;
      }
    }
    
    return {
      ...sortedData[closestIndex],
      timestamp: timestamp,
    };
  });
};
