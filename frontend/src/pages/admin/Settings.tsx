import React, { useState } from 'react';
import { Settings, Percent, Plus, Tag, RefreshCw, Check } from 'lucide-react';
import { useStore } from '../../store';

export default function AdminSettings() {
  const { discounts, addDiscount, toggleDiscount, resetToDemoData } = useStore();

  const [code, setCode] = useState('');
  const [percentage, setPercentage] = useState(15);
  const [minPurchase, setMinPurchase] = useState(250);

  const handleAddDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addDiscount({
      code: code.trim().toUpperCase(),
      percentage: Number(percentage),
      minPurchase: Number(minPurchase),
      isActive: true,
      expiryDate: '2026-12-31',
    });

    setCode('');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <h1 className="text-2xl font-serif font-bold text-stone-900">Boutique Settings & Promotional Codes</h1>
        <p className="text-xs text-stone-500 mt-1">
          Configure discount voucher campaigns, VIP club promotional rates, and demo state controls.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Discount Form */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs h-fit">
          <h2 className="text-base font-serif font-semibold text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
            <Percent className="w-4 h-4 text-stone-700" />
            <span>Create Promo Voucher</span>
          </h2>

          <form onSubmit={handleAddDiscount} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Voucher Code</label>
              <input
                type="text"
                required
                placeholder="e.g. MEMON20"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 uppercase font-mono focus:outline-none focus:border-stone-400"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Discount Rate (%)</label>
              <input
                type="number"
                required
                min={1}
                max={90}
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Minimum Order Amount (Rs.)</label>
              <input
                type="number"
                required
                value={minPurchase}
                onChange={(e) => setMinPurchase(Number(e.target.value))}
                className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 focus:outline-none font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded text-xs transition"
            >
              Issue Promotion Code
            </button>
          </form>
        </div>

        {/* Existing Discounts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-100">
              <h3 className="text-sm font-serif font-bold text-stone-900">Active Campaign Vouchers</h3>
              <p className="text-xs text-stone-500">Customers can enter these promo codes in the Shopping Bag</p>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200/80">
                <tr>
                  <th className="px-5 py-3.5">Promo Code</th>
                  <th className="px-5 py-3.5">Discount</th>
                  <th className="px-5 py-3.5">Min Purchase</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {discounts.map((d) => (
                  <tr key={d.id} className="hover:bg-stone-50/70">
                    <td className="px-5 py-3.5 font-mono font-bold text-stone-900 text-sm">
                      {d.code}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-amber-700">
                      {d.percentage}% OFF
                    </td>
                    <td className="px-5 py-3.5 font-medium">Rs. {d.minPurchase.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                      }`}>
                        {d.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => toggleDiscount(d.id)}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-stone-100 hover:bg-stone-200 text-stone-800"
                      >
                        {d.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reset Demo Data Card */}
          <div className="bg-stone-900 text-stone-200 rounded-2xl p-6 flex items-center justify-between shadow-xs">
            <div>
              <h3 className="font-serif font-bold text-white text-base">Reset Demo Environment</h3>
              <p className="text-xs text-stone-400 mt-1">
                Restores original Memon Traders Pakistani catalog, orders, and customer records.
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('Reset entire Memon Traders demo state?')) {
                  resetToDemoData();
                  alert('Demo database reset successfully.');
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
