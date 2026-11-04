import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldAlert, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessKey })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Access Denied');
      }

      // Store authenticated session token
      localStorage.setItem('memon_admin_token', data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Access Denied: Invalid Security Key');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-red-600/20 border border-red-500/40 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            ADMIN SECURITY GATEWAY
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Restricted Business Control • Master Passkey Protected
          </p>
        </div>

        {error && (
          <div className="bg-red-950/60 border border-red-800 text-red-300 text-xs p-3 rounded-lg mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Enter Security Lock Password</span>
            </label>
            <input
              type="password"
              required
              autoFocus
              placeholder="••••••••••••••••"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3.5 py-3 text-stone-100 focus:outline-none focus:border-red-500 font-mono text-sm tracking-widest"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-[#F85606] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Verifying Security Token...' : 'Unlock Admin Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-stone-800 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-stone-400 hover:text-white underline"
          >
            ← Return to Customer Storefront
          </button>
        </div>
      </div>
    </div>
  );
}
