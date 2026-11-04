import React, { useState } from 'react';
import { ShoppingBag, Truck, Check, Eye, Search, Filter } from 'lucide-react';
import { useStore, Order } from '../../store';

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(search.toLowerCase()) || 
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.trackingNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const statuses: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">Order Management & Fulfillment</h1>
          <p className="text-xs text-stone-500 mt-1">
            Review customer purchases and advance order statuses. Changes are immediately visible in the Customer Order Tracking view.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-stone-200/80">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Client Name, Courier Tracking..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-stone-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
          >
            <option value="all">All Statuses ({orders.length})</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase font-semibold text-[10px] tracking-wider border-b border-stone-200/80">
              <tr>
                <th className="px-5 py-3.5">Order</th>
                <th className="px-5 py-3.5">Customer / City</th>
                <th className="px-5 py-3.5">Items</th>
                <th className="px-5 py-3.5">Total Amount</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5">Order Status</th>
                <th className="px-5 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/70 transition">
                  <td className="px-5 py-3.5">
                    <p className="font-mono font-bold text-stone-900">#{order.id}</p>
                    <p className="text-[10px] text-stone-400">{new Date(order.date).toLocaleDateString()}</p>
                    <p className="text-[9px] font-mono text-stone-400">{order.trackingNumber}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-stone-900">{order.customerName}</p>
                    <p className="text-[11px] text-stone-500">{order.city}</p>
                    <p className="text-[10px] text-stone-400">{order.customerPhone}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-stone-900">{order.items.length} piece(s)</span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-stone-900">
                    Rs. {order.total.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-stone-100 text-stone-700 font-medium">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                      className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border focus:outline-none cursor-pointer ${
                        order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                        order.status === 'Shipped' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                        order.status === 'Processing' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                        order.status === 'Cancelled' ? 'bg-red-50 text-red-800 border-red-300' :
                        'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-xs"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900">
                  Order Details #{selectedOrder.id}
                </h2>
                <p className="text-xs text-stone-500 font-mono">Tracking: {selectedOrder.trackingNumber}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-stone-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200/70 space-y-1">
                <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
                <p><strong>Contact:</strong> {selectedOrder.customerEmail} • {selectedOrder.customerPhone}</p>
                <p><strong>Address:</strong> {selectedOrder.shippingAddress}, {selectedOrder.city}</p>
                <p><strong>Payment Mode:</strong> {selectedOrder.paymentMethod}</p>
              </div>

              <div>
                <h3 className="font-semibold text-stone-900 mb-2">Pieces in Order</h3>
                <div className="divide-y divide-stone-100 border border-stone-100 rounded-lg p-2">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={it.product?.image} alt={it.product?.name} className="w-10 h-12 object-cover rounded" />
                        <div>
                          <p className="font-medium text-stone-900">{it.product?.name}</p>
                          <p className="text-[10px] text-stone-400">Qty: {it.quantity} • Size: {it.selectedSize}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-stone-900">Rs. {(it.product?.price || 0) * it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-stone-100 pt-3 space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>- Rs. {selectedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Rs. {selectedOrder.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 text-sm pt-2 border-t border-stone-200">
                  <span>Total Paid</span>
                  <span>Rs. {selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-stone-900 text-white rounded font-medium text-xs hover:bg-stone-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
