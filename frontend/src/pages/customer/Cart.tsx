import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useStore } from '../../store';

export default function Cart() {
  const { cart, products, updateCartQuantity, removeFromCart, discounts } = useStore();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Map cart items with their full product details
  const cartWithProducts = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product !== undefined);

  const subtotal = cartWithProducts.reduce((sum, item) => sum + (item.product!.price * item.quantity), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = subtotal >= 200 || subtotal === 0 ? 0 : 25;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();

    const found = discounts.find(d => d.code === code && d.isActive);
    if (!found) {
      setPromoError('Invalid or expired promotional code.');
      setDiscountPercent(0);
      return;
    }

    if (subtotal < found.minPurchase) {
      setPromoError(`Code requires minimum order of AED ${found.minPurchase}`);
      return;
    }

    setDiscountPercent(found.percentage);
    setPromoSuccess(`Discount applied: ${found.percentage}% off!`);
  };

  if (cartWithProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif text-stone-900 font-medium">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-stone-500 mt-2 max-w-sm mx-auto">
          Explore our signature embroidered abayas, evening gowns, and artisanal accessories.
        </p>
        <Link 
          to="/shop" 
          className="inline-block mt-6 px-8 py-3 bg-stone-900 text-white text-xs font-semibold tracking-widest uppercase rounded shadow hover:bg-stone-800 transition"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <h1 className="text-3xl font-serif font-medium text-stone-900 tracking-tight mb-8">
        Shopping Bag ({cartWithProducts.reduce((a, b) => a + b.quantity, 0)})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200/80 p-6 divide-y divide-stone-100 shadow-xs">
            {cartWithProducts.map(({ productId, quantity, selectedSize, selectedColor, product }) => (
              <div key={`${productId}-${selectedSize}`} className="py-6 first:pt-0 last:pb-0 flex gap-4 sm:gap-6">
                <Link to={`/product/${product!.id}`} className="w-24 h-32 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
                  <img src={product!.image} alt={product!.name} className="w-full h-full object-cover object-top" />
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link to={`/product/${product!.id}`}>
                        <h3 className="text-sm font-medium text-stone-900 hover:text-amber-800 transition">
                          {product!.name}
                        </h3>
                      </Link>
                      <button 
                        onClick={() => removeFromCart(productId)}
                        className="text-stone-400 hover:text-red-500 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-1 flex gap-3 text-xs text-stone-500">
                      <span>Size: <strong className="text-stone-800">{selectedSize}</strong></span>
                      <span>Color: <strong className="text-stone-800">{selectedColor || product!.color}</strong></span>
                    </div>

                    <p className="mt-1 text-xs text-stone-400">
                      Stock remaining: {product!.stock}
                    </p>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center border border-stone-200 rounded">
                      <button 
                        onClick={() => updateCartQuantity(productId, quantity - 1)}
                        className="px-2.5 py-1 text-stone-600 hover:text-stone-900 text-xs"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-semibold text-stone-900">{quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(productId, quantity + 1)}
                        disabled={quantity >= product!.stock}
                        className="px-2.5 py-1 text-stone-600 hover:text-stone-900 text-xs disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-semibold text-stone-900">
                        AED {product!.price * quantity}
                      </span>
                      {quantity > 1 && (
                        <p className="text-[10px] text-stone-400">AED {product!.price} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs text-stone-500">
            <Link to="/shop" className="underline hover:text-stone-900">
              ← Continue Shopping
            </Link>
            <span>Orders above AED 200 qualify for complimentary delivery</span>
          </div>
        </div>

        {/* Order Summary & Voucher */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-stone-200/80 p-6 shadow-xs sticky top-28">
            <h2 className="text-base font-serif font-medium text-stone-900 pb-4 border-b border-stone-100">
              Order Summary
            </h2>

            {/* Promo Code Form */}
            <form onSubmit={applyPromo} className="mt-5">
              <label className="text-xs font-medium text-stone-700 block mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-stone-500" />
                Promo Code (Demo: <code>WELCOME10</code> or <code>VIPMEMON</code>)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-stone-50 border border-stone-200 text-xs px-3 py-2 rounded focus:outline-none focus:border-stone-400 uppercase font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-stone-800 text-white text-xs font-medium rounded hover:bg-stone-700"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-[11px] text-red-500 mt-1">{promoError}</p>}
              {promoSuccess && <p className="text-[11px] text-emerald-600 mt-1 font-medium">{promoSuccess}</p>}
            </form>

            {/* Price Calculations */}
            <div className="mt-6 space-y-3 text-xs text-stone-600 border-t border-stone-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900">AED {subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount ({discountPercent}%)</span>
                  <span>- AED {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-medium text-stone-900">
                  {shippingFee === 0 ? <strong className="text-emerald-700 font-medium">FREE</strong> : `AED ${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (5% VAT)</span>
                <span className="text-stone-500">Included</span>
              </div>
              <div className="flex justify-between text-base font-serif font-semibold text-stone-900 pt-3 border-t border-stone-200">
                <span>Total Due</span>
                <span>AED {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout', { state: { discountAmount, discountPercent, promoCode } })}
              className="mt-6 w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold tracking-widest uppercase rounded shadow transition flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
              <span>Simulated encrypted checkout demo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
