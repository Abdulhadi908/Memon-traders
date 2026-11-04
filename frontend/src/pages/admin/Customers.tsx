import React, { useState } from 'react';
import { Users, Crown, Mail, Phone, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useStore } from '../../store';

export default function AdminCustomers() {
  const { customers, toggleCustomerVip, orders } = useStore();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <h1 className="text-2xl font-serif font-bold text-stone-900">Clientele & Customer Directory</h1>
        <p className="text-xs text-stone-500 mt-1">
          Review customer purchase frequency, lifetime value, and toggle VIP atelier access privileges.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-500 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200/80">
            <tr>
              <th className="px-5 py-3.5">Client Profile</th>
              <th className="px-5 py-3.5">Contact</th>
              <th className="px-5 py-3.5">Lifetime Value</th>
              <th className="px-5 py-3.5">Orders Placed</th>
              <th className="px-5 py-3.5">VIP Privilege Tier</th>
              <th className="px-5 py-3.5 text-right">VIP Toggle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-stone-50/70 transition">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-400 font-serif font-bold text-xs flex items-center justify-center">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">{c.name}</p>
                      <p className="text-[10px] text-stone-400">Joined: {c.joinDate}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-stone-800">{c.email}</p>
                  <p className="text-[10px] text-stone-500 font-mono">{c.phone}</p>
                </td>
                <td className="px-5 py-3.5 font-bold text-stone-900">
                  Rs. {c.totalSpent.toLocaleString()}
                </td>
                <td className="px-5 py-3.5">
                  <span className="font-medium text-stone-900">{c.ordersCount} orders</span>
                </td>
                <td className="px-5 py-3.5">
                  {c.isVip ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                      <Crown className="w-3 h-3 text-amber-600" />
                      {c.vipTier || 'Gold'} Member
                    </span>
                  ) : (
                    <span className="text-stone-400 text-[10px]">Standard Client</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => toggleCustomerVip(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      c.isVip
                        ? 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        : 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold'
                    }`}
                  >
                    {c.isVip ? 'Revoke VIP' : 'Grant VIP'}
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
