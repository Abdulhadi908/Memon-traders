import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Lock, 
  LogOut, 
  Package, 
  Heart, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ExternalLink,
  Save,
  KeyRound,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../store';

const KARACHI_AREAS = [
  'Clifton',
  'DHA (Defence Housing Authority)',
  'Gulshan-e-Iqbal',
  'PECHS / Tariq Road',
  'Bahadurabad',
  'North Nazimabad',
  'Nazimabad',
  'Saddar / Civil Lines',
  'Gulistan-e-Johar',
  'Federal B Area',
  'Malir / Malir Cantt',
  'Korangi',
  'Bahria Town Karachi',
  'North Karachi',
  'Garden / Soldier Bazaar',
  'Other Karachi Town'
];

const PROVINCES = [
  'Sindh',
  'Punjab',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory'
];

export default function Account() {
  const navigate = useNavigate();
  const { currentUser, updateProfile, logoutUser, orders, wishlist } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'address' | 'security' | 'orders'>('profile');

  // Profile fields state
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  
  // Address fields state
  const [address, setAddress] = useState(currentUser?.address || 'House #42, Street 10, DHA Phase 5');
  const [city, setCity] = useState(currentUser?.city || 'Karachi');
  const [province, setProvince] = useState(currentUser?.province || 'Sindh');
  const [postalCode, setPostalCode] = useState(currentUser?.postalCode || '75500');

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status banners
  const [saveLoading, setSaveLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // If user is logged out, show invitation to login/register
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-orange-100 text-[#F85606] flex items-center justify-center mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Sign in to your Account</h2>
        <p className="text-xs text-stone-500 mb-6">
          Access your personalized profile, order history, tracking updates, and saved shipping addresses.
        </p>
        {/* The requested oval-shaped container with 1st Sign Up and 2nd Login */}
        <div className="bg-stone-100 p-2 rounded-[50px] border-2 border-orange-400 shadow-md flex items-center justify-between gap-3 max-w-xs mx-auto">
          <Link
            to="/signup"
            className="flex-1 py-3 px-5 rounded-full bg-[#F85606] hover:bg-[#e04c00] text-white font-bold text-xs uppercase tracking-wider shadow text-center transition"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="flex-1 py-3 px-5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider shadow text-center transition"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  // Handle saving personal details or address
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setStatusMessage(null);

    const updatedData = {
      name,
      phone,
      address,
      city,
      province,
      postalCode
    };

    try {
      const token = localStorage.getItem('memon_user_token');
      if (token) {
        await fetch(`${import.meta.env.VITE_API_URL || ''}/api/user/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedData)
        }).catch(() => {
          // Fallback if offline
        });
      }

      updateProfile(updatedData);
      setStatusMessage({ type: 'success', text: 'Profile details saved successfully!' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch {
      updateProfile(updatedData);
      setStatusMessage({ type: 'success', text: 'Profile details updated locally.' });
      setTimeout(() => setStatusMessage(null), 4000);
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle updating password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    setSaveLoading(true);
    setStatusMessage(null);

    try {
      const token = localStorage.getItem('memon_user_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/user/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password update failed.');
      }

      setStatusMessage({ type: 'success', text: 'Security password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Unable to update password.' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Top Profile Summary Header */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F85606] text-white font-bold text-2xl flex items-center justify-center shadow-sm">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'M'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900">{currentUser.name}</h1>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                <Sparkles className="w-3 h-3 text-amber-600" /> Verified Customer
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">{currentUser.email}</p>
            <p className="text-[11px] text-stone-400 font-mono mt-0.5">
              {currentUser.phone || '+92 300 1234567'} • {city}, Pakistan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            className="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#F85606]" />
            <span>Continue Shopping</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition border border-stone-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Navigation Tabs on Left, Active Manager on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition text-left ${
              activeTab === 'profile'
                ? 'bg-[#F85606] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/80'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Personal Details</span>
          </button>

          <button
            onClick={() => setActiveTab('address')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition text-left ${
              activeTab === 'address'
                ? 'bg-[#F85606] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/80'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Delivery & Address Book</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition text-left ${
              activeTab === 'security'
                ? 'bg-[#F85606] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/80'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Password & Security</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition text-left ${
              activeTab === 'orders'
                ? 'bg-[#F85606] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/80'
            }`}
          >
            <Package className="w-4 h-4" />
            <div className="flex-1 flex justify-between items-center">
              <span>My Orders</span>
              <span className="bg-stone-100 text-stone-800 text-[10px] px-2 py-0.5 rounded-full font-mono">
                {orders.length}
              </span>
            </div>
          </button>

          <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-200/60 text-xs text-orange-950 mt-4">
            <p className="font-bold flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-[#F85606]" /> Memon Buyer Protection
            </p>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Your profile data is protected under 256-bit SSL encryption. All courier shipments across Pakistan are insured with real-time tracking.
            </p>
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="lg:col-span-3">
          {statusMessage && (
            <div
              className={`p-4 rounded-xl text-xs mb-6 flex items-center gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <span className="font-semibold">{statusMessage.text}</span>
            </div>
          )}

          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-stone-900 mb-1">Personal Profile Details</h2>
              <p className="text-xs text-stone-500 mb-6">
                Update your contact details and display name across Memon Traders.
              </p>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2.5 text-stone-800 focus:outline-none focus:border-[#F85606]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Mobile / WhatsApp Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0300 1234567"
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2.5 text-stone-800 focus:outline-none focus:border-[#F85606] font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Email Address (Registered Account)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full bg-stone-100 border border-stone-200 rounded-lg pl-9 pr-3 py-2.5 text-stone-500 cursor-not-allowed"
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Account email is verified and uniquely tied to your order history.
                  </span>
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="px-6 py-2.5 bg-[#F85606] hover:bg-[#e04c00] text-white font-bold rounded-xl transition shadow flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saveLoading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: ADDRESS BOOK */}
          {activeTab === 'address' && (
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-stone-900 mb-1">Default Shipping & Delivery Address</h2>
              <p className="text-xs text-stone-500 mb-6">
                Addresses are automatically used at checkout for TCS and Leopard courier shipments.
              </p>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Street Address / House No.</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. House #42, Street 10, Block B"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2.5 text-stone-800 focus:outline-none focus:border-[#F85606]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Karachi Area</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-stone-800 focus:outline-none focus:border-[#F85606]"
                    >
                      {KARACHI_AREAS.map((c) => (
                        <option key={c} value={`Karachi - ${c}`}>Karachi - {c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Province</label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-stone-800 focus:outline-none focus:border-[#F85606]"
                    >
                      {PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Postal Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 75500"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-stone-800 focus:outline-none focus:border-[#F85606] font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="px-6 py-2.5 bg-[#F85606] hover:bg-[#e04c00] text-white font-bold rounded-xl transition shadow flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saveLoading ? 'Updating Address...' : 'Save Default Address'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: PASSWORD & SECURITY */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-stone-900 mb-1">Change Account Password</h2>
              <p className="text-xs text-stone-500 mb-6">
                Ensure your account is protected with a secure password of at least 6 characters.
              </p>

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-md">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Current Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="password"
                      required
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2.5 text-stone-800 focus:outline-none focus:border-[#F85606]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">New Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2.5 text-stone-800 focus:outline-none focus:border-[#F85606]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Confirm New Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="Re-type new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2.5 text-stone-800 focus:outline-none focus:border-[#F85606]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl transition shadow flex items-center gap-2"
                  >
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>{saveLoading ? 'Updating Password...' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: MY ORDERS & RECENT PURCHASES */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-stone-100">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">Order History & Parcels</h2>
                  <p className="text-xs text-stone-500">Live parcel tracking and delivery status</p>
                </div>
                <Link
                  to="/orders"
                  className="text-xs text-[#F85606] font-bold hover:underline"
                >
                  Full Tracking Page →
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-stone-700">No Orders Placed Yet</p>
                  <p className="text-xs text-stone-400 mt-1">Explore our products and place your first order!</p>
                  <Link
                    to="/shop"
                    className="mt-4 inline-block px-5 py-2 bg-[#F85606] text-white font-bold rounded-xl text-xs hover:bg-[#e04c00] transition"
                  >
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="p-4 rounded-xl border border-stone-200 hover:border-orange-300 transition bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900">#{o.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.status === 'Delivered' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : o.status === 'Processing' 
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {o.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1">
                          Tracking: <span className="font-mono font-semibold text-stone-800">{o.trackingNumber}</span> • {new Date(o.date).toLocaleDateString()}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          {o.items.length} item(s) • Payment via {o.paymentMethod}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <span className="font-mono font-bold text-base text-stone-900">
                          Rs. {o.total.toLocaleString()}
                        </span>
                        <Link
                          to="/orders"
                          className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-50 rounded-lg text-stone-800 font-semibold transition"
                        >
                          Track
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
