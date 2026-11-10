import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Crown, 
  AlertTriangle,
  Receipt,
  ExternalLink,
  Plus,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../../store';

export default function Dashboard() {
  const { products, orders, customers, expenses, completeAndRemoveOrder } = useStore();

  const totalRevenue = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing');
  const lowStockProducts = products.filter(p => p.stock <= 5);

  const stats = [
    {
      title: 'Total Revenue',
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      change: orders.length > 0 ? `${orders.length} real order(s)` : 'No orders yet',
      isPositive: orders.length > 0,
      subtext: 'Calculated from actual purchases'
    },
    {
      title: 'Gross Expenses',
      value: `Rs. ${totalExpenses.toLocaleString()}`,
      change: `${expenses.length} recorded`,
      isPositive: false,
      subtext: 'Actual operating costs'
    },
    {
      title: 'Total Active Orders',
      value: orders.length.toString(),
      change: `${pendingOrders.length} pending fulfillment`,
      isPositive: true,
      subtext: 'Real-time order sync'
    },
    {
      title: 'Registered Clients',
      value: customers.length.toString(),
      change: `${customers.length} total users`,
      isPositive: true,
      subtext: 'Verified customer accounts'
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">Executive Dashboard</h1>
          <p className="text-xs text-stone-500 mt-1">
            Memon Traders Flagship Atelier • Live synchronization with Customer Storefront
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            target="_blank"
            className="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Shop View</span>
          </Link>
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
            <span className="text-xs font-medium text-stone-500 block mb-1">{stat.title}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-serif font-bold text-stone-900">{stat.value}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] pt-3 border-t border-stone-100">
              <span className={`font-semibold flex items-center ${stat.isPositive ? 'text-emerald-700' : 'text-stone-600'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-3.5 h-3.5 inline mr-0.5" /> : null}
                {stat.change}
              </span>
              <span className="text-stone-400">{stat.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex justify-between items-center">
            <div>
              <h2 className="text-base font-serif font-semibold text-stone-900">Recent Customer Orders</h2>
              <p className="text-xs text-stone-500">Live feed of orders placed on customer storefront</p>
            </div>
            <Link to="/admin/orders" className="text-xs font-semibold text-amber-700 hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-100">
                <tr>
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/80 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-stone-900">#{order.id}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-stone-900">{order.customerName}</p>
                      <p className="text-[10px] text-stone-400">{order.city}</p>
                    </td>
                    <td className="px-5 py-3.5">{order.items.length} piece(s)</td>
                    <td className="px-5 py-3.5 font-semibold text-stone-900">Rs. {order.total.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            if (confirm(`Complete order #${order.id} and remove from admin and user?`)) {
                              completeAndRemoveOrder(order.id);
                            }
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] flex items-center gap-1 transition shadow-xs"
                          title="Complete and delete order"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Complete</span>
                        </button>
                        <Link to="/admin/orders" className="text-stone-700 hover:text-amber-700 font-semibold underline text-xs">
                          Manage
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts & Fast Action */}
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-serif font-semibold text-stone-900">Inventory Alerts</h3>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                {lowStockProducts.length} Needs Restock
              </span>
            </div>

            <div className="divide-y divide-stone-100 mt-3">
              {lowStockProducts.length === 0 ? (
                <p className="text-xs text-stone-400 py-6 text-center">All products are healthy in inventory.</p>
              ) : (
                lowStockProducts.map((p) => (
                  <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img src={p.image} alt={p.name} className="w-8 h-10 object-cover rounded" />
                      <div>
                        <p className="font-medium text-stone-900 truncate max-w-[130px]">{p.name}</p>
                        <p className="text-[10px] text-red-600 font-bold">Only {p.stock} left in stock</p>
                      </div>
                    </div>
                    <Link
                      to="/admin/inventory"
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[10px] font-semibold rounded"
                    >
                      Restock
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100">
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-[11px] text-stone-600">
              <span className="font-bold text-stone-900 block mb-0.5">Dual App Verification</span>
              Updating stock or adding a product here directly alters the customer shop catalog.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
