import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../../store';

export default function Wishlist() {
  const { wishlist, products, toggleWishlist, addToCart } = useStore();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-3xl font-serif font-medium text-stone-900 tracking-tight">
            My Wishlist ({wishlistedProducts.length})
          </h1>
          <p className="text-xs text-stone-500 mt-1">Saved pieces and personal wardrobe selections</p>
        </div>
        <Link to="/shop" className="text-xs font-semibold text-stone-800 hover:text-stone-950 underline uppercase">
          Continue Browsing
        </Link>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="py-24 text-center max-w-sm mx-auto">
          <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h2 className="text-xl font-serif text-stone-800 font-medium">Your Wishlist is Empty</h2>
          <p className="text-xs text-stone-500 mt-1">Click the heart icon on any dress, abaya, or accessory to save it here.</p>
          <Link to="/shop" className="mt-6 inline-block px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded">
            Explore Boutique
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-xs flex flex-col justify-between">
              <div className="relative aspect-[3/4]">
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover object-top hover:scale-105 transition duration-500" />
                </Link>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-red-500 hover:bg-white shadow transition"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4">
                <span className="text-[10px] uppercase font-semibold text-stone-400">{product.category}</span>
                <Link to={`/product/${product.id}`} className="block">
                  <h3 className="text-xs sm:text-sm font-medium text-stone-900 mt-0.5 truncate hover:text-amber-800">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs font-semibold text-stone-900 mt-1">AED {product.price}</p>

                <button
                  onClick={() => addToCart(product.id, 1, product.sizes[0] || 'Standard', product.color)}
                  className="w-full mt-3 py-2 bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
