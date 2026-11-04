import React from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, ArrowUpRight, PackageCheck, Layers } from 'lucide-react';
import { useStore } from '../../store';

export default function AdminAnalytics() {
  const { orders, expenses } = useStore();

  const validOrders = orders.filter(o => o.status !== 'Cancelled');
  const totalSales = validOrders.reduce((sum, o) => sum + o.total, 0);
  const totalCost = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalSales - totalCost;
  const avgOrderValue = validOrders.length > 0 ? (totalSales / validOrders.length) : 0;

  // Real Weekly Sales Volume calculation from actual customer orders
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const daySalesMap: { [day: string]: { total: number; count: number } } = {
    Mon: { total: 0, count: 0 },
    Tue: { total: 0, count: 0 },
    Wed: { total: 0, count: 0 },
    Thu: { total: 0, count: 0 },
    Fri: { total: 0, count: 0 },
    Sat: { total: 0, count: 0 },
    Sun: { total: 0, count: 0 }
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  validOrders.forEach(order => {
    try {
      const orderDate = new Date(order.date);
      const dayIndex = orderDate.getDay();
      const dayName = dayNames[dayIndex];
      if (dayName && daySalesMap[dayName]) {
        daySalesMap[dayName].total += (order.total || 0);
        daySalesMap[dayName].count += 1;
      }
    } catch {
      // Fallback
    }
  });

  const maxVal = Math.max(...Object.values(daySalesMap).map(d => d.total));
  const totalWeeklySales = Object.values(daySalesMap).reduce((sum, d) => sum + d.total, 0);
  const totalWeeklyOrders = Object.values(daySalesMap).reduce((sum, d) => sum + d.count, 0);

  const weeklySalesData = daysOfWeek.map(day => {
    const data = daySalesMap[day];
    const percentage = maxVal > 0 ? Math.max(12, Math.round((data.total / maxVal) * 100)) : 6;
    return {
      day,
      val: data.total,
      count: data.count,
      height: `${percentage}%`
    };
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">Real Sales & Business Analytics</h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time financial performance, actual order revenue, and weekly volume computed from live customer transactions.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-semibold self-start sm:self-center border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Order Synchronization Active
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Real Gross Sales</span>
          <p className="text-xl font-serif font-bold text-stone-900 mt-1">Rs. {totalSales.toLocaleString()}</p>
          <span className="text-[11px] text-stone-500 mt-2 block">
            {validOrders.length} Actual Placed Order{validOrders.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Operating Expenses</span>
          <p className="text-xl font-serif font-bold text-stone-900 mt-1">Rs. {totalCost.toLocaleString()}</p>
          <span className="text-[11px] text-stone-500 mt-2 block">{expenses.length} Logged Expense Record{expenses.length === 1 ? '' : 's'}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Net Profit</span>
          <p className={`text-xl font-serif font-bold mt-1 ${netProfit >= 0 ? 'text-stone-900' : 'text-rose-600'}`}>
            Rs. {netProfit.toLocaleString()}
          </p>
          <span className="text-[11px] text-stone-500 mt-2 block">Gross Sales minus Expenses</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Average Order Value</span>
          <p className="text-xl font-serif font-bold text-stone-900 mt-1">Rs. {Math.round(avgOrderValue).toLocaleString()}</p>
          <span className="text-[11px] text-stone-500 mt-2 block">Per confirmed customer cart</span>
        </div>
      </div>

      {/* Real Weekly Sales Volume Chart */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
          <div>
            <h3 className="text-base font-serif font-semibold text-stone-900">Weekly Sales Volume (Rs.)</h3>
            <p className="text-xs text-stone-500">Calculated strictly from real customer orders placed each day</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-stone-500">
              Total Volume: <strong className="text-stone-900 font-mono font-bold">Rs. {totalWeeklySales.toLocaleString()}</strong>
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-500">
              Orders: <strong className="text-stone-900 font-mono font-bold">{totalWeeklyOrders}</strong>
            </span>
          </div>
        </div>

        {totalWeeklySales === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
              <BarChart3 className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-stone-800">No Orders Placed Yet This Week</p>
            <p className="text-xs text-stone-400 max-w-md mx-auto mt-1">
              The weekly sales volume currently reflects real <strong>Rs. 0</strong>. As soon as customers checkout on the storefront, daily sales bars will automatically calculate and display the exact rupee revenue.
            </p>
          </div>
        ) : (
          <div className="h-56 flex items-end gap-3 sm:gap-6 pt-8 pb-2">
            {weeklySalesData.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div 
                  style={{ height: bar.height }} 
                  className={`w-full max-w-[48px] rounded-t transition-all cursor-pointer relative group ${
                    bar.val > 0 ? 'bg-amber-600 hover:bg-amber-700' : 'bg-stone-200 hover:bg-stone-300'
                  }`}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 pointer-events-none">
                    <p className="font-bold">Rs. {bar.val.toLocaleString()}</p>
                    <p className="text-[9px] text-stone-400">{bar.count} order{bar.count === 1 ? '' : 's'}</p>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-[11px] font-semibold text-stone-700 uppercase block">{bar.day}</span>
                  <span className="text-[9px] font-mono text-stone-400 block">Rs. {bar.val}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
