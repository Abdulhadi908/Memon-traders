import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Smartphone,
  ChevronDown,
  LayoutDashboard,
  Coins
} from 'lucide-react';
import { useStore } from '../store';

export default function CustomerLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { cart, wishlist, searchQuery, setSearchQuery, categories, currentUser } = useStore();
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-stone-800 font-sans text-xs">
      {/* 1. Daraz Top Slim Utility Bar */}
      <div className="bg-[#FAF8F5] border-b border-stone-200 text-stone-600 py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px]">
          <div className="flex items-center gap-6">
            <span className="text-orange-600 font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-orange-500" /> Save More on Memon App
            </span>
            <span className="hover:text-orange-600 cursor-pointer">Sell on Memon Traders</span>
            <span className="hover:text-orange-600 cursor-pointer">Customer Care</span>
            <Link to="/orders" className="hover:text-orange-600">Track My Order</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/admin/dashboard" 
              className="text-stone-900 bg-amber-400 hover:bg-amber-500 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1 shadow-xs"
            >
              <LayoutDashboard className="w-3 h-3" />
              <span>Admin Business Dashboard</span>
            </Link>
            <div className="flex items-center gap-1">
              <span className="font-bold text-stone-800">PAKISTAN (PKR)</span>
              <span>|</span>
              <span className="cursor-pointer hover:text-orange-600 font-medium">اردو</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Daraz Orange Header */}
      <header className="sticky top-0 z-40 bg-[#F85606] shadow-md text-white transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-white lg:hidden"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Daraz-Style Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="bg-white text-[#F85606] font-black text-xl px-2 py-0.5 rounded shadow-xs tracking-tighter">
              MT
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
                Memon<span className="text-amber-300">Traders</span>
              </span>
              <span className="text-[9px] tracking-widest text-orange-100 uppercase font-semibold">
                Online Shopping Store
              </span>
            </div>
          </Link>

          {/* Big Daraz-style Search Box with Icon */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl relative hidden sm:flex items-center">
            <input
              type="text"
              placeholder="Search in Memon Traders (e.g. Abayas, Lawn, Khussa, Jewelry, Bags)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-stone-900 rounded-lg pl-4 pr-14 py-2.5 text-xs focus:outline-none placeholder:text-stone-400 shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-4 bg-[#F85606] hover:bg-[#e04c00] text-white rounded-md flex items-center justify-center transition"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* User Links & Cart Bag */}
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            {currentUser ? (
              <Link
                to="/account"
                className="flex items-center gap-1.5 text-white hover:text-amber-200 transition"
              >
                <div className="w-6 h-6 rounded-full bg-amber-400 text-stone-900 font-bold text-xs flex items-center justify-center">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:flex flex-col leading-tight">
                  <span className="text-[10px] text-orange-100">Hi, {currentUser.name.split(' ')[0]}</span>
                  <span className="font-bold text-xs">My Profile</span>
                </div>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-white hover:text-amber-200 transition"
              >
                <User className="w-5 h-5" />
                <div className="hidden lg:flex flex-col leading-tight">
                  <span className="text-[10px] text-orange-100">Welcome</span>
                  <span className="font-bold text-xs">Login / Sign Up</span>
                </div>
              </Link>
            )}

            <Link
              to="/wishlist"
              className="relative flex items-center gap-1 text-white hover:text-amber-200 transition hidden sm:flex"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-amber-400 text-stone-950 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white transition"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-950 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="font-bold text-xs hidden sm:inline">Cart</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="px-4 pb-3 sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search in Memon Traders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-stone-900 rounded-lg pl-3 pr-10 py-2 text-xs focus:outline-none placeholder:text-stone-400"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-[#F85606] text-white rounded-md flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </header>



      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-10 overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-stone-200">
                <span className="font-bold text-lg text-[#F85606]">MEMON TRADERS</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-stone-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 flex flex-col space-y-3 text-xs">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="font-bold text-stone-900 py-1">
                  Home
                </Link>
                <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="font-bold text-orange-600 py-1">
                  Flash Sale & All Products
                </Link>
                <div className="border-t border-stone-100 pt-3 space-y-2">
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="text-stone-700 block">
                    Track Orders (TCS / Leopards)
                  </Link>
                  <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-stone-900 font-bold bg-amber-300 p-2 rounded block">
                    Switch to Admin Portal
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 text-[11px] text-stone-400">
              <p>Memon Traders • Pakistan E-Commerce</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16 lg:pb-0">
        <Outlet />
      </main>

      {/* Daraz-Style Footer */}
      <footer className="bg-white border-t border-stone-200 text-stone-600 pt-10 pb-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-stone-900 text-xs uppercase mb-3">Customer Care</h4>
            <ul className="space-y-1.5 text-xs text-stone-500">
              <li><Link to="/orders" className="hover:text-orange-600">Help Center & FAQs</Link></li>
              <li><Link to="/cart" className="hover:text-orange-600">How to Buy on Memon Traders</Link></li>
              <li><Link to="/orders" className="hover:text-orange-600">Returns & Refunds Policy</Link></li>
              <li><Link to="/orders" className="hover:text-orange-600">Track Order (TCS / Trax)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 text-xs uppercase mb-3">Memon Traders</h4>
            <ul className="space-y-1.5 text-xs text-stone-500">
              <li><Link to="/shop" className="hover:text-orange-600">About Memon Traders Pakistan</Link></li>
              <li><Link to="/account" className="hover:text-orange-600">Customer Profile & Settings</Link></li>
              <li><Link to="/admin/dashboard" className="text-orange-600 font-semibold">Admin Business Dashboard</Link></li>
              <li><span className="text-stone-400">Karachi Head Office: Clifton Block 4</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 text-xs uppercase mb-3">Payment Methods</h4>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 bg-stone-100 rounded border border-stone-200 font-bold text-emerald-700">Cash On Delivery</span>
              <span className="px-2.5 py-1 bg-stone-100 rounded border border-stone-200 font-bold text-red-700">JazzCash</span>
              <span className="px-2.5 py-1 bg-stone-100 rounded border border-stone-200 font-bold text-emerald-600">EasyPaisa</span>
              <span className="px-2.5 py-1 bg-stone-100 rounded border border-stone-200 font-bold text-blue-700">Visa / Mastercard</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 text-xs uppercase mb-3">Delivery Partners</h4>
            <div className="flex flex-wrap gap-2 text-[11px] text-stone-600">
              <span className="px-2 py-1 bg-stone-100 rounded border border-stone-200 font-semibold">TCS Express</span>
              <span className="px-2 py-1 bg-stone-100 rounded border border-stone-200 font-semibold">Leopards Courier</span>
              <span className="px-2 py-1 bg-stone-100 rounded border border-stone-200 font-semibold">Trax Logistics</span>
            </div>
            <p className="text-[10px] text-stone-400 mt-3">Free shipping on DarazMall verified items across Pakistan.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-4 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-400 gap-2">
          <p>© 2026 Memon Traders (Daraz Style Marketplace). All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Centralized Zustand Local Store</span>
            <Link to="/admin/dashboard" className="text-stone-600 hover:text-orange-600 underline">Admin Login</Link>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation (Daraz Style) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 px-3 py-1.5 flex justify-around items-center text-stone-600 shadow-lg">
        <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-orange-600 font-bold' : ''}`}>
          <Home className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Home</span>
        </Link>
        <Link to="/shop" className={`flex flex-col items-center ${location.pathname.startsWith('/shop') ? 'text-orange-600 font-bold' : ''}`}>
          <Zap className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Flash Sale</span>
        </Link>
        <Link to="/cart" className={`relative flex flex-col items-center ${location.pathname === '/cart' ? 'text-orange-600 font-bold' : ''}`}>
          <ShoppingBag className="w-5 h-5" />
          {totalCartCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
              {totalCartCount}
            </span>
          )}
          <span className="text-[9px] mt-0.5">Cart</span>
        </Link>
        <Link to="/account" className={`flex flex-col items-center ${location.pathname === '/account' ? 'text-orange-600 font-bold' : ''}`}>
          <User className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Account</span>
        </Link>
      </nav>
    </div>
  );
}

function Home(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
