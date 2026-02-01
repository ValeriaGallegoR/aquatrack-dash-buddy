// Mock water usage data generator

export interface DailyUsage {
  date: string;
  liters: number;
}

export interface WaterStats {
  totalLast30Days: number;
  dailyAverage: number;
  weeklyTotal: number;
  monthlyTotal: number;
  dailyData: DailyUsage[];
}

// Generate realistic water usage data
// Average household uses 300-400 liters per day
function generateDailyUsage(daysBack: number): DailyUsage[] {
  const data: DailyUsage[] = [];
  const baseUsage = 280;
  const variation = 120;

  for (let i = daysBack - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some weekly patterns (higher on weekends)
    const dayOfWeek = date.getDay();
    const weekendBonus = (dayOfWeek === 0 || dayOfWeek === 6) ? 50 : 0;
    
    // Random variation
    const randomVariation = Math.floor(Math.random() * variation) - (variation / 2);
    
    const liters = Math.max(150, baseUsage + weekendBonus + randomVariation);
    
    data.push({
      date: date.toISOString().split('T')[0],
      liters: Math.round(liters),
    });
  }

  return data;
}

export function getWaterStats(): WaterStats {
  const dailyData = generateDailyUsage(30);
  
  const totalLast30Days = dailyData.reduce((sum, day) => sum + day.liters, 0);
  const dailyAverage = Math.round(totalLast30Days / 30);
  
  // Last 7 days
  const weeklyTotal = dailyData.slice(-7).reduce((sum, day) => sum + day.liters, 0);
  
  // This month (approximation using last 30 days)
  const monthlyTotal = totalLast30Days;

  return {
    totalLast30Days,
    dailyAverage,
    weeklyTotal,
    monthlyTotal,
    dailyData,
  };
}

// Format liters for display
export function formatLiters(liters: number): string {
  if (liters >= 1000) {
    return `${(liters / 1000).toFixed(1)}k L`;
  }
  return `${liters} L`;
}
