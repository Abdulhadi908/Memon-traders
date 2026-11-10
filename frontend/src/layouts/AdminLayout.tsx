import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Layers, 
  ShoppingBag, 
  Users, 
  Crown, 
  BarChart3, 
  Receipt, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Menu, 
  X, 
  ExternalLink,
  RefreshCw,
  TrendingUp,
  Percent
} from 'lucide-react';
import { useStore } from '../store';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, products, resetToDemoData } = useStore();
  const pendingOrders = orders.filter((o: any) => o.status === 'Pending' || o.status === 'Processing').length;
  const lowStockCount = products.filter((p: any) => p.stock < 10).length;

  const handleAdminLogout = () => {
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package, badge: products.length },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Inventory & Stock', path: '/admin/inventory', icon: Layers, badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined, badgeColor: 'bg-amber-100 text-amber-800' },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag, badge: pendingOrders > 0 ? `${pendingOrders} new` : undefined, badgeColor: 'bg-emerald-100 text-emerald-800' },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'VIP Memberships', path: '/admin/memberships', icon: Crown },
    { name: 'Sales Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Expense Tracking', path: '/admin/expenses', icon: Receipt },
    { name: 'Discounts & Promos', path: '/admin/settings', icon: Percent },
  ];

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex font-sans">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/50 z-40 lg:hidden backdrop-blur-xs" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar Navigation */}
      <aside className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-stone-900 text-stone-300 flex flex-col justify-between transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div>
          {/* Logo & Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-stone-800">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-amber-500 text-stone-950 flex items-center justify-center font-serif font-black text-sm">
                MT
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-widest text-sm text-white font-bold leading-tight">MEMON TRADERS</span>
                <span className="text-[10px] tracking-widest text-amber-400 font-mono uppercase">BUSINESS CONTROL</span>
              </div>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick link to switch to Customer View */}
          <div className="px-4 py-3">
            <Link 
              to="/" 
              className="flex items-center justify-between px-3 py-2 text-xs rounded bg-stone-800 hover:bg-stone-700/80 text-amber-300 font-medium transition"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                Live Customer Store
              </span>
              <span className="text-[10px] bg-amber-400/20 px-1.5 py-0.5 rounded text-amber-300">View Shop</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                    isActive 
                      ? 'bg-amber-600/90 text-white shadow-sm' 
                      : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.badgeColor || 'bg-stone-800 text-stone-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & User Profile */}
        <div className="p-4 border-t border-stone-800 space-y-3">
          <button 
            onClick={() => {
              if (confirm('Reset demo data store to fresh high-fashion catalog and demo orders?')) {
                resetToDemoData();
              }
            }}
            className="w-full flex items-center justify-center gap-2 text-xs py-2 px-3 rounded bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Store</span>
          </button>

          <div className="flex items-center justify-between pt-2 text-xs text-stone-400">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-stone-700 flex items-center justify-center text-white font-bold text-xs">
                A
              </div>
              <div>
                <p className="font-semibold text-stone-200 leading-tight">Admin Demo</p>
                <p className="text-[10px] text-stone-500">Super Admin Access</p>
              </div>
            </div>
            <button onClick={handleAdminLogout} title="Lock and exit admin portal" className="text-stone-400 hover:text-red-400 p-1">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-stone-500">
              <span>Memon Traders</span>
              <span>/</span>
              <span className="text-stone-900 capitalize">
                {location.pathname.split('/')[2] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Shared Store Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Shared Store Live: {products.length} Products, {orders.length} Orders</span>
            </div>

            <Link
              to="/shop"
              className="text-xs bg-stone-900 text-white px-3 py-1.5 rounded font-medium hover:bg-stone-800 transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Customer Shop</span>
            </Link>
          </div>
        </header>

        {/* Sub-view Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F6F5F2]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
