import React, { useState } from 'react';
import { Layers, Plus, Minus, Search, AlertCircle, Check } from 'lucide-react';
import { useStore } from '../../store';

export default function AdminInventory() {
  const { products, updateStock } = useStore();
  const [search, setSearch] = useState('');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleStockAdjust = (id: string, currentStock: number, delta: number, name: string) => {
    const updated = Math.max(0, currentStock + delta);
    updateStock(id, updated);
    setSaveToast(`Updated "${name}" stock to ${updated} units.`);
    setTimeout(() => setSaveToast(null), 2500);
  };

  return (
    <div className="space-y-6 pb-20">
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">Inventory & Stock Control</h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time warehouse adjustment. Changes immediately reflect in Customer Shop availability and purchase restrictions.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-stone-200/80">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search warehouse items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 text-stone-500 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200/80">
            <tr>
              <th className="px-5 py-3.5">Piece</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Unit Price</th>
              <th className="px-5 py-3.5">Available Units</th>
              <th className="px-5 py-3.5">Availability Status</th>
              <th className="px-5 py-3.5 text-right">Quick Stock Modifier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-stone-50/70">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-9 h-12 object-cover rounded shadow-xs" />
                    <div>
                      <p className="font-semibold text-stone-900">{p.name}</p>
                      <p className="text-[10px] text-stone-400">Color: {p.color}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 capitalize">{p.category}</td>
                <td className="px-5 py-3.5 font-semibold text-stone-900">Rs. {p.price}</td>
                <td className="px-5 py-3.5">
                  <span className="text-sm font-bold text-stone-900">{p.stock}</span>
                </td>
                <td className="px-5 py-3.5">
                  {p.stock === 0 ? (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                      Out of Stock
                    </span>
                  ) : p.stock <= 5 ? (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      Low Stock Warning
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Optimal Inventory
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="inline-flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white shadow-xs">
                    <button
                      onClick={() => handleStockAdjust(p.id, p.stock, -5, p.name)}
                      className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                      title="Deduct 5"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => handleStockAdjust(p.id, p.stock, -1, p.name)}
                      className="px-2 py-1 text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                      title="Deduct 1"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-1 font-bold text-stone-900 bg-stone-50 text-xs">
                      {p.stock}
                    </span>
                    <button
                      onClick={() => handleStockAdjust(p.id, p.stock, 1, p.name)}
                      className="px-2 py-1 text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                      title="Add 1"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleStockAdjust(p.id, p.stock, 10, p.name)}
                      className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                      title="Add 10"
                    >
                      +10
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
