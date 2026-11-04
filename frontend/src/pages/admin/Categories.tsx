import React, { useState } from 'react';
import { Plus, Edit2, Trash2, FolderPlus, Layers } from 'lucide-react';
import { useStore } from '../../store';

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useStore();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const finalSlug = slug.trim().toLowerCase() || name.trim().toLowerCase().replace(/\s+/g, '-');
    addCategory({
      name: name.toUpperCase(),
      slug: finalSlug,
      image: image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400',
      itemCount: 0,
    });
    setName('');
    setSlug('');
    setImage('');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <h1 className="text-2xl font-serif font-bold text-stone-900">Category Management</h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage the 6 signature boutique categories shown on the customer storefront.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form: Add New Category */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs h-fit">
          <h2 className="text-base font-serif font-semibold text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-stone-700" />
            <span>Create New Category</span>
          </h2>

          <form onSubmit={handleAdd} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Category Title</label>
              <input
                type="text"
                required
                placeholder="e.g. EVENING SILKS"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-400"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Slug Identifier</label>
              <input
                type="text"
                placeholder="e.g. evening-silks"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Thumbnail Photo URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 focus:outline-none font-mono text-[11px]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded text-xs transition"
            >
              Add Category to Store
            </button>
          </form>
        </div>

        {/* Existing Categories Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const count = products.filter(p => p.category.toLowerCase() === cat.slug.toLowerCase()).length;

            return (
              <div key={cat.id} className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-stone-200 flex-shrink-0">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-serif font-bold text-stone-900">{cat.name}</h3>
                    <p className="text-[11px] text-stone-500 font-mono">slug: {cat.slug}</p>
                    <span className="inline-block mt-1 text-[10px] bg-stone-100 text-stone-700 font-semibold px-2 py-0.5 rounded">
                      {count} items active
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Delete category "${cat.name}"?`)) {
                      deleteCategory(cat.id);
                    }
                  }}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Delete category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
