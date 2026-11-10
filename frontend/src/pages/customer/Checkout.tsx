import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Banknote, Lock } from 'lucide-react';
import { useStore, Product } from '../../store';

export default function Checkout() {
  const { cart, products, placeOrder } = useStore();

  const cartWithProducts = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product: product as Product };
  }).filter(item => item.product !== undefined);

  const subtotal = cartWithProducts.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal >= 3000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + shipping;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Karachi',
    paymentMethod: 'COD' as 'COD'
  });
  

  const [placedOrder, setPlacedOrder] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cartWithProducts.length === 0 && !placedOrder) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <h2 className="text-xl font-bold text-stone-900">Your cart is empty</h2>
        <p className="text-xs text-stone-500 mt-2">Add items to proceed to checkout.</p>
        <Link to="/shop" className="mt-4 inline-block px-5 py-2.5 bg-[#F85606] text-white text-xs font-bold rounded uppercase">
          Go Shopping
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        city: formData.city,
        items: cartWithProducts,
        subtotal,
        discount: 0,
        shipping,
        total,
        paymentMethod: formData.paymentMethod,
      });

      setPlacedOrder(order);
      setIsSubmitting(false);
    }, 600);
  };

  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-stone-900">Order Placed Successfully!</h1>
        <p className="text-xs text-stone-500 mt-2">
          Thank you for shopping with Memon Traders. Your order ID is <strong>#{placedOrder.id}</strong>.
        </p>

        <div className="mt-6 bg-white border border-stone-200 rounded-lg p-5 text-left text-xs space-y-2">
          <p><strong>Tracking Number:</strong> <span className="font-mono text-orange-600 font-bold">{placedOrder.trackingNumber}</span></p>
          <p><strong>Deliver To:</strong> {placedOrder.shippingAddress}, {placedOrder.city}</p>
          <p><strong>Payment Mode:</strong> {placedOrder.paymentMethod}</p>
          <p><strong>Total Amount:</strong> Rs. {placedOrder.total.toLocaleString()}</p>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <Link to="/shop" className="px-5 py-2.5 bg-[#F85606] text-white text-xs font-bold rounded">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Checkout</h1>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
            <h2 className="font-bold text-sm text-stone-900 mb-4 pb-2 border-b border-stone-100">
              Delivery Address (Pakistan)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-stone-200 rounded p-2 text-stone-900 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="03XXXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-stone-200 rounded p-2 text-stone-900 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-stone-600 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-stone-200 rounded p-2 text-stone-900 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-stone-600 font-semibold mb-1">Full Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="House / Flat / Street / Area"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border border-stone-200 rounded p-2 text-stone-900 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Karachi Town / Area</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full border border-stone-200 rounded p-2 text-stone-900 focus:outline-none focus:border-orange-500"
                >
                  <option value="Karachi - Clifton">Karachi - Clifton</option>
                  <option value="Karachi - DHA">Karachi - DHA</option>
                  <option value="Karachi - Gulshan-e-Iqbal">Karachi - Gulshan-e-Iqbal</option>
                  <option value="Karachi - PECHS / Tariq Road">Karachi - PECHS / Tariq Road</option>
                  <option value="Karachi - Bahadurabad">Karachi - Bahadurabad</option>
                  <option value="Karachi - North Nazimabad">Karachi - North Nazimabad</option>
                  <option value="Karachi - Saddar">Karachi - Saddar</option>
                  <option value="Karachi - Gulistan-e-Johar">Karachi - Gulistan-e-Johar</option>
                  <option value="Karachi - Federal B Area">Karachi - Federal B Area</option>
                  <option value="Karachi - Malir / Cantt">Karachi - Malir / Cantt</option>
                  <option value="Karachi - Korangi">Karachi - Korangi</option>
                  <option value="Karachi - Bahria Town">Karachi - Bahria Town</option>
                  <option value="Karachi - Other Town">Karachi - Other Town</option>
                </select>
                <span className="text-[10px] text-emerald-700 font-medium mt-1 block">
                  ✓ Doorstep delivery exclusively within Karachi city.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
            <h2 className="font-bold text-sm text-stone-900 mb-4 pb-2 border-b border-stone-100 flex items-center justify-between">
              <span>Payment Method</span>
              <Lock className="w-4 h-4 text-stone-400" />
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 border border-[#F85606] rounded-lg bg-orange-50/50 cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                    className="accent-orange-600"
                  />
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-stone-800">Cash on Delivery (COD)</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Popular</span>
              </label>
            </div>
          </div>
        </div>
 
        <div className="md:col-span-1">
          <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs sticky top-24">
            <h2 className="font-bold text-sm text-stone-900 pb-3 border-b border-stone-100">
              Order Summary ({cartWithProducts.length} items)
            </h2>

            <div className="py-3 space-y-2 text-xs text-stone-600 border-b border-stone-100">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-stone-900">{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                <span>Total Amount</span>
                <span className="text-[#F85606]">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3 bg-[#F85606] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded shadow transition disabled:opacity-50"
            >
              {isSubmitting ? 'Placing Order...' : 'Confirm Order'}
            </button>
          </div>
        </div>
      </form>
    
    </div>
  );
}
