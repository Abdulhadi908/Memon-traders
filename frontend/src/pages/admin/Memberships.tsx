import React from 'react';
import { Crown, Sparkles, Check, Users } from 'lucide-react';
import { useStore } from '../../store';

export default function AdminMemberships() {
  const { customers, toggleCustomerVip } = useStore();
  const vipCustomers = customers.filter(c => c.isVip);

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">VIP Subscription & Salon Management</h1>
          <p className="text-xs text-stone-500 mt-1">
            Exclusive club members receiving complimentary alterations, private showroom previews, and custom discounts.
          </p>
        </div>
        <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5 text-amber-600" /> {vipCustomers.length} Active VIPs
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-500 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200/80">
            <tr>
              <th className="px-5 py-3.5">Client</th>
              <th className="px-5 py-3.5">Tier</th>
              <th className="px-5 py-3.5">Spend Level</th>
              <th className="px-5 py-3.5">Perks Activated</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {vipCustomers.map(c => (
              <tr key={c.id} className="hover:bg-stone-50/70">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-stone-900">{c.name}</p>
                  <p className="text-[10px] text-stone-400">{c.email}</p>
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-bold text-amber-700">{c.vipTier || 'Gold'} Tier</span>
                </td>
                <td className="px-5 py-3.5 font-bold text-stone-900">AED {c.totalSpent.toLocaleString()}</td>
                <td className="px-5 py-3.5 text-[11px] text-stone-500">Free Dubai Delivery, 10% Off Atelier Pieces</td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => toggleCustomerVip(c.id)}
                    className="px-3 py-1 bg-stone-100 text-stone-600 hover:bg-stone-200 rounded text-xs"
                  >
                    Demote
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
