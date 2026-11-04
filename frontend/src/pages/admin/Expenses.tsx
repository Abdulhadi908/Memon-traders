import React, { useState } from 'react';
import { Receipt, Plus, Trash2, Tag, Calendar, DollarSign } from 'lucide-react';
import { useStore, Expense } from '../../store';

export default function AdminExpenses() {
  const { expenses, addExpense, deleteExpense } = useStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Logistics');
  const [amount, setAmount] = useState<number>(500);
  const [note, setNote] = useState('');

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addExpense({
      title,
      category,
      amount: Number(amount),
      date: new Date().toISOString().split('T')[0],
      note,
    });

    setTitle('');
    setAmount(500);
    setNote('');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">Expense Tracking & Operational Costs</h1>
          <p className="text-xs text-stone-500 mt-1">
            Track atelier overhead, fabric logistics, packaging, and marketing spend.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-semibold text-stone-400">Total Recorded</span>
          <p className="text-lg font-serif font-bold text-stone-900">Rs. {totalExpense.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Form */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs h-fit">
          <h2 className="text-base font-serif font-semibold text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-stone-700" />
            <span>Record New Expense</span>
          </h2>

          <form onSubmit={handleAdd} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Expense Description</label>
              <input
                type="text"
                required
                placeholder="e.g. Silk Fabric Customs Duty"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Cost Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 focus:outline-none"
              >
                <option value="Logistics">Logistics & Courier</option>
                <option value="Marketing">Marketing & Influencers</option>
                <option value="Packaging">Packaging & Ribbons</option>
                <option value="Inventory">Raw Fabric & Trims</option>
                <option value="Salaries">Atelier Tailor Salaries</option>
                <option value="Utilities">Showroom Rent & Bills</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Amount (Rs.)</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Note (Optional)</label>
              <input
                type="text"
                placeholder="Vendor or invoice reference"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded text-xs transition"
            >
              Add Expense Entry
            </button>
          </form>
        </div>

        {/* Expense List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200/80">
              <tr>
                <th className="px-5 py-3.5">Expense</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-stone-50/70">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-stone-900">{exp.title}</p>
                    {exp.note && <p className="text-[10px] text-stone-400">{exp.note}</p>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-700">
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-stone-500">{exp.date}</td>
                  <td className="px-5 py-3.5 font-bold text-stone-900">Rs. {exp.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="text-stone-400 hover:text-red-500 p-1"
                      title="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
