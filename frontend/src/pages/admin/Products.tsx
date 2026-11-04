import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Check, X, Sparkles, AlertCircle } from 'lucide-react';
import { useStore, Product } from '../../store';

export default function AdminProducts() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'abayas',
    price: 299,
    originalPrice: 0,
    stock: 20,
    color: 'Beige',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    description: 'Bespoke tailoring in premium breathable fabric.',
    sizes: '52, 54, 56, 58',
    isNewArrival: true,
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.color.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || p.category.toLowerCase() === selectedCat.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'abayas',
      price: 299,
      originalPrice: 0,
      stock: 20,
      color: 'Beige',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
      description: 'Bespoke tailoring in premium breathable fabric.',
      sizes: '52, 54, 56, 58',
      isNewArrival: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || 0,
      stock: p.stock,
      color: p.color,
      image: p.image,
      description: p.description,
      sizes: p.sizes.join(', '),
      isNewArrival: !!p.isNewArrival,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(Boolean);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stock: Number(formData.stock),
        color: formData.color,
        image: formData.image,
        description: formData.description,
        sizes: sizesArray,
        isNewArrival: formData.isNewArrival,
      });
    } else {
      addProduct({
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stock: Number(formData.stock),
        color: formData.color,
        image: formData.image,
        description: formData.description,
        sizes: sizesArray,
        isNewArrival: formData.isNewArrival,
        rating: 5.0,
        reviewsCount: 1,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">Product Management</h1>
          <p className="text-xs text-stone-500 mt-1">
            Create, edit, and control inventory. Instantly reflected in customer shopping catalog.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-stone-200/80">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search products by title, color, cut..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">Category:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="text-xs border border-stone-200 rounded-lg px-3 py-2 bg-white focus:outline-none capitalize"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200/80">
              <tr>
                <th className="px-5 py-3.5">Product</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Stock</th>
                <th className="px-5 py-3.5">Sizes</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/70 transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-14 object-cover rounded shadow-xs" />
                      <div>
                        <p className="font-semibold text-stone-900">{p.name}</p>
                        <p className="text-[10px] text-stone-400">{p.color}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 capitalize font-medium">{p.category}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-stone-900">Rs. {p.price}</span>
                    {p.originalPrice && (
                      <span className="text-[10px] text-stone-400 line-through ml-1">Rs. {p.originalPrice}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.stock === 0 ? 'bg-red-100 text-red-800' :
                      p.stock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[11px] text-stone-500">{p.sizes.join(', ')}</td>
                  <td className="px-5 py-3.5">
                    {p.isNewArrival && (
                      <span className="bg-stone-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">NEW</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${p.name}"? This removes it from the customer store instantly.`)) {
                            deleteProduct(p.id);
                          }
                        }}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-stone-100">
              <h2 className="text-lg font-serif font-bold text-stone-900">
                {editingProduct ? 'Edit Boutique Piece' : 'Add New Boutique Piece'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-400"
                  placeholder="e.g. Silk Velvet Evening Abaya"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Color Shade</label>
                  <input
                    type="text"
                    required
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 focus:outline-none"
                    placeholder="e.g. Champagne / Midnight"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 focus:outline-none font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Original Price (Rs.)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 focus:outline-none"
                    placeholder="Optional for sale"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Inventory Stock</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Available Sizes (comma separated)</label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 focus:outline-none"
                  placeholder="52, 54, 56, 58 or S, M, L"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-stone-200 rounded px-3 py-2 text-stone-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isNew"
                  checked={formData.isNewArrival}
                  onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                  className="accent-stone-900"
                />
                <label htmlFor="isNew" className="text-stone-700 font-medium">Flag as New Arrival badge</label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-white rounded font-medium hover:bg-stone-800"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
