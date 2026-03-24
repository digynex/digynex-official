// Mock API Layer for DigyNex Dashboard
// Later replace this with Supabase Client calls `supabase.from('bi_transactions').select('*')`

export const fetchDashboardMetrics = async () => {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve({
              kpis: {
                  revenue: 4.1, // Millions
                  profit: 1.8, // Millions
                  cashFlow: 950, // Thousands
                  expenses: 1.2, // Millions
                  targetProgress: 82 // Percentage
              },
              charts: {
                  actual: [1.2, 2.1, 1.8, 3.2, 2.8, 3.8, 4.1],
                  predicted: [1.0, 1.9, 2.0, 2.8, 3.1, 4.0, 4.8]
              },
              insights: [
                  {
                      id: 1,
                      type: 'surge',
                      title: 'Weekend Surge',
                      desc: 'System noted 24% revenue spike matched with "Advanced Course A" logs.'
                  },
                  {
                      id: 2,
                      type: 'anomaly',
                      title: 'Expense Anomaly',
                      desc: 'Operational burn rate is accelerating. Review SaaS subscriptions.'
                  },
                  {
                      id: 3,
                      type: 'forecast',
                      title: 'Forecast Health',
                      desc: 'Predictive model confirms 94% probability of exceeding pipeline targets.'
                  }
              ]
          })
      }, 700); // Simulated 700ms latency
  });
}
