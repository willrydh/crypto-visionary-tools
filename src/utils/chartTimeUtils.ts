
/**
 * Utility for formatting chart timestamps according to interval.
 */

export function formatChartXAxisTick(timestamp: number, timeframe: string) {
  const date = new Date(timestamp);
  switch (timeframe) {
    case '1d':
      // Visa timmar och minuter för 1 dag (t.ex. 08:00)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    case '7d':
      // Visa dag & månad (t.ex. 19 apr)
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    case '30d':
    case '90d':
      // Visa månad/dag (t.ex. apr 19)
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    default:
      return date.toLocaleString();
  }
}
