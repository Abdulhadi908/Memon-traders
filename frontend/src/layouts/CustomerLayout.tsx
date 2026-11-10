import React, { useState, useEffect } from 'react';
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
  LogOut,
  MapPin,
  Sparkles,
  Home
} from 'lucide-react';
import { useStore } from '../store';

export default function CustomerLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { cart, wishlist, searchQuery, setSearchQuery, categories, currentUser, logoutUser } = useStore();
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Show first-time welcome modal if unauthenticated and not dismissed in this session
  useEffect(() => {
    if (!currentUser && !sessionStorage.getItem('memon_welcome_dismissed')) {
      setShowWelcomeModal(true);
    }
  }, [currentUser]);

  const handleDismissWelcome = () => {
    setShowWelcomeModal(false);
    sessionStorage.setItem('memon_welcome_dismissed', 'true');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-stone-800 font-sans text-xs">
      {/* 1. Daraz Top Slim Utility Bar (Karachi Exclusive & User Status) */}
      <div className="bg-[#FAF8F5] border-b border-stone-200 text-stone-600 py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px]">
          <div className="flex items-center gap-6">
            <span className="text-orange-600 font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#F85606]" /> Delivery Available in Karachi Only
            </span>
            <span className="hover:text-orange-600 cursor-pointer">Memon Customer Care</span>
            <Link to="/orders" className="hover:text-orange-600">Track My Order</Link>
          </div>
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-stone-700">
                  Welcome, <strong className="text-stone-900">{currentUser.name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-stone-500 hover:text-red-600 font-semibold flex items-center gap-1 transition"
                  title="Sign Out of Account"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              /* Oval shaped capsule with 1st button Sign Up and 2nd button Login */
              <div className="bg-stone-200/80 p-0.5 rounded-full flex items-center gap-1 border border-stone-300">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-3 py-0.5 rounded-full bg-[#F85606] text-white font-bold text-[10px] hover:bg-orange-600 transition shadow-2xs"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-0.5 rounded-full bg-white text-stone-800 font-bold text-[10px] hover:bg-stone-100 transition shadow-2xs"
                >
                  Login
                </button>
              </div>
            )}

            <div className="flex items-center gap-1 pl-2 border-l border-stone-200">
              <span className="font-bold text-stone-800">KARACHI (PKR)</span>
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
                Karachi Online Store
              </span>
            </div>
          </Link>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl relative hidden sm:flex items-center">
            <input
              type="text"
              placeholder="Search in Memon Traders Karachi (Abayas, Lawn, Khussa, Jewelry, Bags)..."
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

          {/* User Links, Profile & Cart */}
          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/account"
                  className="flex items-center gap-1.5 text-white hover:text-amber-200 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-stone-900 font-bold text-xs flex items-center justify-center shadow-xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden lg:flex flex-col leading-tight">
                    <span className="text-[10px] text-orange-100">Hi, {currentUser.name.split(' ')[0]}</span>
                    <span className="font-bold text-xs">My Account</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-black/20 hover:bg-black/30 rounded-lg text-white text-xs font-semibold transition"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              /* Oval shaped container for unauthenticated users */
              <div className="bg-white/15 p-1 rounded-full flex items-center gap-1.5 border border-white/20">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-3 py-1 rounded-full bg-white text-[#F85606] font-bold text-xs hover:bg-orange-50 transition shadow-xs"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-1 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition shadow-xs"
                >
                  Login
                </button>
              </div>
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
              placeholder="Search Memon Traders Karachi..."
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

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-stone-900/60" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white p-5 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="font-black text-lg text-[#F85606]">Memon Traders</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-stone-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile User Status / Oval buttons */}
              {currentUser ? (
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-200 text-xs">
                  <p className="text-stone-500">Logged in as:</p>
                  <p className="font-bold text-stone-900 text-sm mt-0.5">{currentUser.name}</p>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-orange-200/80">
                    <Link
                      to="/account"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs text-[#F85606] font-bold hover:underline"
                    >
                      My Profile
                    </Link>
                    <span>•</span>
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-center">
                  <p className="text-stone-600 text-xs font-semibold mb-2">Welcome to Memon Traders</p>
                  {/* Oval shaped container */}
                  <div className="bg-white p-1 rounded-full border border-stone-300 shadow-xs flex items-center justify-between gap-1">
                    <button
                      onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}
                      className="flex-1 py-2 rounded-full bg-[#F85606] text-white font-bold text-xs uppercase"
                    >
                      Sign Up
                    </button>
                    <button
                      onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                      className="flex-1 py-2 rounded-full bg-stone-900 text-white font-bold text-xs uppercase"
                    >
                      Login
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-1 text-xs">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-800 font-semibold hover:text-[#F85606]">
                  Storefront Home
                </Link>
                <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-800 font-semibold hover:text-[#F85606]">
                  All Products
                </Link>
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-800 font-semibold hover:text-[#F85606]">
                  Shopping Cart ({totalCartCount})
                </Link>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-800 font-semibold hover:text-[#F85606]">
                  Track My Order
                </Link>
              </div>

              <div className="p-3 bg-stone-100 rounded-xl text-[11px] text-stone-600">
                <p className="font-bold text-stone-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#F85606]" /> Delivery Notice
                </p>
                <p className="mt-1">We exclusively deliver to all residential & commercial areas in Karachi.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 text-[11px] text-stone-400">
              <p>© 2026 Memon Traders • Karachi, Pakistan</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. First-Time Visitor Welcome Modal with Oval-Shaped Buttons */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-md w-full p-6 sm:p-8 text-center relative">
            <button
              onClick={handleDismissWelcome}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 transition"
              title="Close and continue as guest"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F85606] text-white flex items-center justify-center text-2xl font-black shadow-md mb-3">
              MT
            </div>

            <h3 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
              Welcome to Memon Traders
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
              Karachi's authentic eastern & modest boutique. Fast delivery across Karachi with Cash on Delivery.
            </p>

            <div className="my-6">
              <p className="text-xs font-semibold text-stone-700 mb-3">Please sign in or register to get started:</p>
              
              {/* THE REQUESTED OVAL-SHAPED CONTAINER WITH 1ST SIGNUP & 2ND LOGIN BUTTONS */}
              <div className="bg-stone-100 p-2 rounded-[50px] border-2 border-orange-400/80 shadow-md flex items-center justify-between gap-3">
                {/* 1st button: Sign Up */}
                <button
                  onClick={() => {
                    handleDismissWelcome();
                    navigate('/signup');
                  }}
                  className="flex-1 py-3 px-5 rounded-full bg-[#F85606] hover:bg-[#e04c00] text-white font-bold text-xs uppercase tracking-wider shadow transition"
                >
                  Sign Up
                </button>

                {/* 2nd button: Login */}
                <button
                  onClick={() => {
                    handleDismissWelcome();
                    navigate('/login');
                  }}
                  className="flex-1 py-3 px-5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider shadow transition"
                >
                  Login
                </button>
              </div>
            </div>

            <button
              onClick={handleDismissWelcome}
              className="text-xs text-stone-400 hover:text-stone-700 font-medium underline"
            >
              Continue browsing as Guest →
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16 lg:pb-0">
        <Outlet />
      </main>

      {/* Daraz-Style Footer (Completely Clean of Admin links, JazzCash, EasyPaisa) */}
      <footer className="bg-white border-t border-stone-200 text-stone-600 pt-10 pb-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-stone-900 text-xs uppercase mb-3">Customer Care</h4>
            <ul className="space-y-1.5 text-xs text-stone-500">
              <li><Link to="/orders" className="hover:text-orange-600">Help Center & FAQs</Link></li>
              <li><Link to="/cart" className="hover:text-orange-600">How to Buy on Memon Traders</Link></li>
              <li><Link to="/orders" className="hover:text-orange-600">Returns & Refunds Policy</Link></li>
              <li><Link to="/orders" className="hover:text-orange-600">Track Order in Karachi</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 text-xs uppercase mb-3">Memon Traders</h4>
            <ul className="space-y-1.5 text-xs text-stone-500">
              <li><Link to="/shop" className="hover:text-orange-600">About Memon Traders</Link></li>
              <li><Link to="/account" className="hover:text-orange-600">Customer Profile & Settings</Link></li>
              <li><span className="text-stone-400">Head Office: Clifton Block 4, Karachi</span></li>
              <li><span className="text-emerald-700 font-semibold">Serving all Karachi towns</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 text-xs uppercase mb-3">Payment Methods</h4>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 bg-stone-100 rounded border border-stone-200 font-bold text-emerald-700">Cash On Delivery (COD)</span>
              <span className="px-2.5 py-1 bg-stone-100 rounded border border-stone-200 font-bold text-blue-700">Visa / Mastercard</span>
            </div>
            <p className="text-[10px] text-stone-400 mt-2">Pay cash when your parcel arrives at your doorstep.</p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 text-xs uppercase mb-3">Delivery Service</h4>
            <div className="flex flex-wrap gap-2 text-[11px] text-stone-600">
              <span className="px-2 py-1 bg-stone-100 rounded border border-stone-200 font-semibold">TCS Karachi</span>
              <span className="px-2 py-1 bg-stone-100 rounded border border-stone-200 font-semibold">Leopards Express</span>
              <span className="px-2 py-1 bg-stone-100 rounded border border-stone-200 font-semibold">Direct Rider Delivery</span>
            </div>
            <p className="text-[10px] text-stone-400 mt-3">Exclusive fast courier delivery across Karachi only.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-4 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-400 gap-2">
          <p>© 2026 Memon Traders Karachi. All Rights Reserved.</p>
          <p className="text-stone-500 font-medium">Delivering Exclusively within Karachi, Pakistan</p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 px-3 py-1.5 flex justify-around items-center text-stone-600 shadow-lg">
        <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-orange-600 font-bold' : ''}`}>
          <Home className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Home</span>
        </Link>
        <Link to="/shop" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-orange-600 font-bold' : ''}`}>
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Shop</span>
        </Link>
        <Link to="/cart" className={`flex flex-col items-center relative ${location.pathname === '/cart' ? 'text-orange-600 font-bold' : ''}`}>
          <ShoppingBag className="w-5 h-5" />
          {totalCartCount > 0 && (
            <span className="absolute -top-1 right-2 bg-amber-400 text-stone-950 text-[9px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center">
              {totalCartCount}
            </span>
          )}
          <span className="text-[9px] mt-0.5">Cart</span>
        </Link>
        <Link to={currentUser ? '/account' : '/login'} className={`flex flex-col items-center ${location.pathname === '/account' || location.pathname === '/login' ? 'text-orange-600 font-bold' : ''}`}>
          <User className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">{currentUser ? 'Account' : 'Login'}</span>
        </Link>
      </nav>
    </div>
  );
}
