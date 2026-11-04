import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Zap, 
  Star, 
  ShieldCheck, 
  Truck, 
  ChevronRight,
  Flame,
  CheckCircle2,
  Tag,
  RotateCcw
} from 'lucide-react';
import { useStore, Product } from '../../store';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCat = searchParams.get('cat') || 'all';
  const filterType = searchParams.get('filter') || 'all';
  const urlSearch = searchParams.get('search') || '';

  const { products, categories, wishlist, addToCart, toggleWishlist } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Daraz Flash Sale Countdown Timer (Simulated countdown)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        return { hours: Math.max(0, prev.hours - 1), minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products
  const filteredProducts = products.filter(product => {
    if (selectedCat !== 'all' && product.category.toLowerCase() !== selectedCat.toLowerCase()) {
      return false;
    }
    if (filterType === 'flash' && !product.isFlashSale) {
      return false;
    }
    if (filterType === 'mall' && !product.isDarazMall) {
      return false;
    }
    if (filterType === 'new' && !product.isNewArrival) {
      return false;
    }
    if (urlSearch.trim() && !product.name.toLowerCase().includes(urlSearch.toLowerCase()) && !product.description.toLowerCase().includes(urlSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const flashSaleItems = products.filter(p => p.isFlashSale);

  const handleAddToCart = (product: Product) => {
    addToCart(product.id, 1, product.sizes[0] || 'Standard', product.color);
    setAddedToast(`Added "${product.name}" to cart`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-24 space-y-6">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 bg-[#F85606] text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 text-xs font-bold animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{addedToast}</span>
          <Link to="/cart" className="underline bg-white text-[#F85606] px-2 py-0.5 rounded text-[11px] ml-2">
            View Cart
          </Link>
        </div>
      )}

      {/* 1. Daraz Hero Full Banner */}
      <section className="w-full">
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 rounded-lg p-6 sm:p-10 text-white shadow-md relative overflow-hidden flex flex-col justify-between min-h-[180px]">
          <div className="max-w-lg z-10">
            <span className="bg-white/20 backdrop-blur-xs text-white text-[10px] font-black uppercase px-2.5 py-1 rounded tracking-wider">
              MEMON TRADERS • PAKISTAN
            </span>
            <h1 className="text-2xl sm:text-4xl font-black mt-2 tracking-tight drop-shadow-xs">
              Quality Apparel & Accessories
            </h1>
            <p className="text-xs sm:text-sm text-orange-100 mt-2 font-medium">
              Explore authentic Pakistani Lawn, Modest Abayas, Handcrafted Bags & Footwear.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Daraz 4 Quick Value Badges */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-stone-200 shadow-xs text-xs">
        <div className="flex items-center gap-2.5 p-2">
          <ShieldCheck className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-stone-800">100% Authentic</p>
            <p className="text-[10px] text-stone-400">Direct from Memon Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-2">
          <Truck className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-stone-800">Nationwide COD</p>
            <p className="text-[10px] text-stone-400">Cash on Delivery at Doorstep</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-2">
          <RotateCcw className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-stone-800">Easy 14 Days Return</p>
            <p className="text-[10px] text-stone-400">Change of mind allowed</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-2">
          <Zap className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-stone-800">Fast 2-3 Day Delivery</p>
            <p className="text-[10px] text-stone-400">Karachi, Lahore & Islamabad</p>
          </div>
        </div>
      </section>



      {/* 4. Daraz Category Circles Grid */}
      <section className="bg-white rounded-lg p-4 border border-stone-200 shadow-xs">
        <h2 className="font-bold text-sm text-stone-900 mb-3">Categories</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 text-center">
          {categories.map((cat) => {
            const isSelected = selectedCat === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  const p = new URLSearchParams(searchParams);
                  if (isSelected) p.delete('cat');
                  else p.set('cat', cat.slug);
                  setSearchParams(p);
                }}
                className={`flex flex-col items-center group p-1.5 rounded-lg transition ${isSelected ? 'bg-orange-50 ring-2 ring-[#F85606]' : 'hover:bg-stone-50'}`}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-stone-200 mb-1.5 group-hover:scale-105 transition shadow-2xs">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] font-medium text-stone-800 group-hover:text-orange-600 line-clamp-1">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Main Catalog - "Just For You" Section (Daraz Standard) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 border-b border-stone-300 gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-900">Just For You</h2>
            <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
              {sortedProducts.length} items
            </span>
          </div>

          {/* Quick Sort Bar */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-white border border-stone-300 rounded px-2.5 py-1 text-xs text-stone-800 focus:outline-none"
            >
              <option value="featured">Best Match</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            {selectedCat !== 'all' && (
              <button
                onClick={() => {
                  const p = new URLSearchParams(searchParams);
                  p.delete('cat');
                  p.delete('filter');
                  setSearchParams(p);
                }}
                className="text-xs text-orange-600 font-bold underline ml-2"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Product Cards (Daraz Mall, Free Shipping, Rating, Orders count) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {sortedProducts.map((p) => {
            const isWishlisted = wishlist.includes(p.id);

            return (
              <div 
                key={p.id}
                className="bg-white rounded-lg border border-stone-200 hover:border-orange-400 hover:shadow-lg transition-all p-2 flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-square bg-stone-100 rounded-md overflow-hidden relative mb-2">
                    <Link to={`/product/${p.id}`}>
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    </Link>

                    {/* Wishlist Heart */}
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="absolute top-1.5 right-1.5 p-1 bg-white/80 rounded-full text-stone-600 hover:text-red-500 shadow-xs"
                      title="Save to Wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>

                    {/* DarazMall Flag */}
                    {p.isDarazMall && (
                      <span className="absolute top-1.5 left-1.5 bg-[#D0011B] text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                        DarazMall
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <Link to={`/product/${p.id}`}>
                    <h3 className="text-xs text-stone-800 line-clamp-2 leading-tight hover:text-orange-600 transition">
                      {p.name}
                    </h3>
                  </Link>

                  {/* Free Shipping Tag */}
                  {p.freeShipping && (
                    <span className="inline-block mt-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-200">
                      Free Delivery
                    </span>
                  )}
                </div>

                <div className="mt-2.5">
                  {/* Ratings & Sold */}
                  <div className="flex items-center justify-between text-[10px] text-stone-500 mb-2">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="ml-0.5 font-semibold text-stone-700">{p.rating}</span>
                      <span className="text-stone-400">({p.reviewsCount})</span>
                    </div>
                    <span>{p.soldCount || 85} sold</span>
                  </div>

                  {/* View Details Button */}
                  <Link
                    to={`/product/${p.id}`}
                    className="w-full py-1.5 bg-[#F85606] hover:bg-[#e04c00] text-white rounded text-[11px] font-bold transition flex items-center justify-center gap-1 shadow-xs"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Admin Sync Verification Banner */}
      <section className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-lg p-5 text-white flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
            Daraz Marketplace Architecture Live
          </span>
          <h3 className="text-base font-bold mt-0.5">Connected Admin Business Portal</h3>
          <p className="text-xs text-stone-400 mt-1">
            Any product created, price discounted, or order fulfilled in the Admin immediately syncs here via localStorage.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded transition"
          >
            Manage Products in Admin
          </Link>
          <Link
            to="/cart"
            className="px-4 py-2 bg-stone-700 hover:bg-stone-600 text-white font-semibold text-xs rounded transition"
          >
            Go to Cart
          </Link>
        </div>
      </section>
    </div>
  );
}
