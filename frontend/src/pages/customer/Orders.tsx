import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Clock, CheckCircle2, Search, ArrowRight, ExternalLink, FileText } from 'lucide-react';
import { useStore, Order } from '../../store';
import OrderReceiptModal from '../../components/OrderReceiptModal';

export default function Orders() {
  const { orders } = useStore();
  const [searchTracking, setSearchTracking] = useState('');
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => 
    searchTracking.trim() === '' || 
    o.id.toLowerCase().includes(searchTracking.toLowerCase()) || 
    o.trackingNumber.toLowerCase().includes(searchTracking.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-3xl font-serif font-medium text-stone-900 tracking-tight">
            Order Tracking & History
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time fulfillment and rider delivery tracking for your orders across Karachi.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="mb-6 flex gap-3 max-w-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search by Order # or Tracking Code..."
            value={searchTracking}
            onChange={(e) => setSearchTracking(e.target.value)}
            className="w-full bg-white border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-stone-500 font-mono"
          />
        </div>
        {searchTracking && (
          <button onClick={() => setSearchTracking('')} className="text-xs text-stone-500 hover:text-stone-900 underline">
            Clear
          </button>
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-xl mx-auto">
          <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-serif text-stone-800 font-medium">No orders found</h3>
          <p className="text-xs text-stone-500 mt-1">You haven't placed any demo purchases matching this criteria.</p>
          <Link to="/shop" className="mt-4 inline-block px-4 py-2 bg-stone-900 text-white text-xs font-medium rounded uppercase tracking-wider">
            Shop Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-stone-200/90 shadow-xs overflow-hidden">
              {/* Order Header */}
              <div className="bg-stone-50/80 px-6 py-4 border-b border-stone-200/80 flex flex-wrap justify-between items-center gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-semibold">Order Placed</span>
                    <span className="font-medium text-stone-900">{new Date(order.date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-semibold">Total Amount</span>
                    <span className="font-semibold text-stone-900">Rs. {order.total.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-semibold">Ship To</span>
                    <span className="font-medium text-stone-900">{order.customerName} ({order.city})</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => setReceiptOrder(order)}
                    className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-xs transition"
                    title="Download and print official invoice"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download Receipt</span>
                  </button>
                  <span className="text-[10px] font-mono text-stone-400">ID: #{order.id}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Tracking Progress Bar */}
              <div className="px-6 py-4 bg-stone-50/30 border-b border-stone-100">
                <div className="flex items-center justify-between text-xs text-stone-600 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-stone-700" />
                    <span>Courier Tracking: <strong className="font-mono text-stone-900">{order.trackingNumber}</strong></span>
                  </div>
                  <span className="text-[11px] text-stone-500">Express Delivery within Karachi (TCS / Leopard Courier)</span>
                </div>

                {/* Progress bar state */}
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden flex">
                  <div className={`h-full bg-stone-900 transition-all duration-500 ${
                    order.status === 'Cancelled' ? 'bg-red-500 w-full' :
                    order.status === 'Pending' ? 'w-1/4' :
                    order.status === 'Processing' ? 'w-2/4' :
                    order.status === 'Shipped' ? 'w-3/4' : 'w-full bg-emerald-600'
                  }`} />
                </div>
                <div className="flex justify-between text-[10px] text-stone-400 mt-1.5 font-medium">
                  <span className={order.status !== 'Cancelled' ? 'text-stone-900' : ''}>Order Confirmed</span>
                  <span className={order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? 'text-stone-900' : ''}>Atelier Tailoring</span>
                  <span className={order.status === 'Shipped' || order.status === 'Delivered' ? 'text-stone-900' : ''}>Out with Courier</span>
                  <span className={order.status === 'Delivered' ? 'text-emerald-700 font-bold' : ''}>Delivered</span>
                </div>
              </div>

              {/* Ordered Items */}
              <div className="p-6 divide-y divide-stone-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {item.product?.image ? (
                        <img src={item.product.image} alt={item.product.name} className="w-12 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-16 bg-stone-200 rounded flex items-center justify-center text-xs">MT</div>
                      )}
                      <div>
                        <h4 className="text-sm font-medium text-stone-900">{item.product?.name || 'Item'}</h4>
                        <p className="text-xs text-stone-500">
                          Qty: {item.quantity} • Size: {item.selectedSize || 'Standard'} • Color: {item.selectedColor || 'Default'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-stone-900">
                        Rs. {(((item.product?.price || 0) * item.quantity)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Printable / Downloadable Order Receipt Modal */}
      <OrderReceiptModal
        order={receiptOrder}
        onClose={() => setReceiptOrder(null)}
      />
    </div>
  );
}
