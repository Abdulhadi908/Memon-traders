import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Share2 
} from 'lucide-react';
import { useStore } from '../../store';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist } = useStore();

  const product = products.find(p => p.id === id);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImg, setActiveImg] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);

  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || 'Standard');
      setActiveImg(product.image);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <h2 className="text-2xl font-serif text-stone-800">Product Not Found</h2>
        <p className="text-xs text-stone-500 mt-2">The requested boutique item is no longer available.</p>
        <Link to="/shop" className="inline-block mt-6 px-6 py-2.5 bg-stone-900 text-white text-xs uppercase tracking-wider font-semibold rounded">
          Return to Boutique
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const inStock = product.stock > 0;

  const handleAdd = () => {
    addToCart(product.id, quantity, selectedSize, product.color);
    setToast(`Added ${quantity} × ${product.name} (${selectedSize}) to bag`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 text-xs tracking-wide">
          <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-stone-900 font-bold">✓</div>
          <span>{toast}</span>
          <Link to="/cart" className="underline font-bold text-amber-300 ml-2">Checkout</Link>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
        <Link to="/shop" className="hover:text-stone-900 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Collection
        </Link>
        <span>/</span>
        <span className="capitalize">{product.category}</span>
        <span>/</span>
        <span className="text-stone-900 font-medium truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Gallery */}
        <div className="flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3">
            <button 
              onClick={() => setActiveImg(product.image)}
              className={`w-16 h-20 rounded-md overflow-hidden border-2 transition ${activeImg === product.image ? 'border-stone-900' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </button>
            {product.secondaryImage && (
              <button 
                onClick={() => setActiveImg(product.secondaryImage!)}
                className={`w-16 h-20 rounded-md overflow-hidden border-2 transition ${activeImg === product.secondaryImage ? 'border-stone-900' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={product.secondaryImage} alt={product.name} className="w-full h-full object-cover" />
              </button>
            )}
          </div>

          {/* Main Photo */}
          <div className="flex-1 aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden shadow-xs relative">
            <img 
              src={activeImg || product.image} 
              alt={product.name} 
              className="w-full h-full object-cover object-top"
            />
            {product.isNewArrival && (
              <span className="absolute top-4 left-4 bg-stone-900 text-white text-[10px] font-bold tracking-widest px-2.5 py-1 uppercase rounded">
                NEW ATELIER PIECE
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Details & Controls */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-stone-500">
                {product.category} • {product.color}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 font-medium mt-1">
                {product.name}
              </h1>
            </div>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-2.5 rounded-full border border-stone-200 text-stone-700 hover:text-red-500 hover:border-red-200 transition"
              title="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>

          {/* Price & Rating */}
          <div className="mt-4 flex items-center justify-between pb-6 border-b border-stone-200">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-serif font-semibold text-stone-900">
                AED {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-stone-400 line-through">
                  AED {product.originalPrice}
                </span>
              )}
              <span className="text-[11px] text-stone-500">Inclusive of VAT</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-stone-800">{product.rating}</span>
              <span className="text-stone-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Description */}
          <p className="mt-5 text-xs sm:text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {/* Size Selector */}
          <div className="mt-6">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold tracking-wider text-stone-900 uppercase">Select Size</span>
              <span className="text-stone-500 underline cursor-pointer">Size Guide (UAE Standard)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-12 py-2 px-3 text-xs font-semibold rounded border transition ${
                    selectedSize === size
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-200 text-stone-800 hover:border-stone-400 bg-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Stock Check */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-stone-300 rounded bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-stone-600 hover:text-stone-900 text-sm font-bold"
              >
                -
              </button>
              <span className="px-3 py-2 text-xs font-semibold text-stone-900">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-2 text-stone-600 hover:text-stone-900 text-sm font-bold"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>

            <div className="text-xs">
              {inStock ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units available)
                </span>
              ) : (
                <span className="text-red-600 font-medium">Currently Sold Out</span>
              )}
            </div>
          </div>

          {/* Add to Bag Button */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={handleAdd}
              disabled={!inStock}
              className="flex-1 py-4 bg-stone-900 hover:bg-stone-800 text-[#FAF8F5] text-xs font-semibold tracking-widest uppercase rounded shadow transition flex items-center justify-center gap-2 disabled:bg-stone-300"
            >
              <ShoppingBag className="w-4 h-4" />
              {inStock ? 'Add to Shopping Bag' : 'Sold Out'}
            </button>
            <button
              onClick={() => {
                handleAdd();
                navigate('/checkout');
              }}
              disabled={!inStock}
              className="px-6 py-4 border border-stone-900 hover:bg-stone-900 hover:text-white text-stone-900 text-xs font-semibold tracking-widest uppercase rounded transition disabled:opacity-40"
            >
              Buy Now
            </button>
          </div>

          {/* Assurance Perks */}
          <div className="mt-8 pt-6 border-t border-stone-200 grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center">
              <Truck className="w-4 h-4 text-stone-700 mb-1" />
              <span className="text-[11px] font-semibold text-stone-800">Same-Day UAE</span>
              <span className="text-[10px] text-stone-500">Dubai & Abu Dhabi</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-stone-700 mb-1" />
              <span className="text-[11px] font-semibold text-stone-800">Authentic Luxury</span>
              <span className="text-[10px] text-stone-500">Premium Fabrics</span>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="w-4 h-4 text-stone-700 mb-1" />
              <span className="text-[11px] font-semibold text-stone-800">Complimentary Returns</span>
              <span className="text-[10px] text-stone-500">Within 14 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
