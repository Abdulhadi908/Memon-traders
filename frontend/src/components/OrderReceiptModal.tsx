import React from 'react';
import { 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  Truck, 
  FileText 
} from 'lucide-react';
import { Order } from '../store';

interface OrderReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderReceiptModal({ order, onClose }: OrderReceiptModalProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${order.id.replace(/[^0-9]/g, '') || Date.now().toString().slice(-6)}`;
  const orderDateFormatted = new Date(order.date).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/75 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-2xl w-full my-auto overflow-hidden print:border-none print:shadow-none print:max-w-none print:w-full">
        
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="bg-stone-900 text-white px-5 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Official Order Invoice & Receipt (#{order.id})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#F85606] hover:bg-[#e04c00] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div id="printable-receipt" className="p-6 sm:p-8 text-stone-800 text-xs font-sans">
          
          {/* Header Brand & Invoice Meta */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-stone-800 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-[#F85606] text-white font-black text-xl px-2.5 py-0.5 rounded">
                  MT
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-900">
                  Memon<span className="text-[#F85606]">Traders</span>
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Premier Modest & Eastern Wear • Karachi, Pakistan
              </p>
              <p className="text-[10px] text-stone-400">
                Clifton Block 4, Karachi • UAN: +92 300 2345678 • sales@memontraders.pk
              </p>
            </div>

            <div className="sm:text-right bg-stone-50 p-3 rounded-xl border border-stone-200">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                Official Receipt / Invoice
              </span>
              <p className="font-mono font-bold text-sm text-stone-900 mt-0.5">
                #{invoiceNumber}
              </p>
              <p className="text-[10px] text-stone-500 mt-0.5 flex items-center sm:justify-end gap-1">
                <Calendar className="w-3 h-3 text-stone-400" />
                <span>{orderDateFormatted}</span>
              </p>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-stone-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Delivered To (Customer)
              </span>
              <p className="font-bold text-stone-900 text-sm">{order.customerName}</p>
              <p className="text-stone-600 mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-stone-400" />
                <span>{order.customerPhone || '+92 300 1234567'}</span>
              </p>
              <p className="text-stone-600 mt-0.5 flex items-start gap-1.5">
                <MapPin className="w-3 h-3 text-[#F85606] mt-0.5 flex-shrink-0" />
                <span>{order.shippingAddress}, {order.city}</span>
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Order & Shipping Logistics
              </span>
              <p className="text-stone-700">
                Order ID: <strong className="font-mono text-stone-900">#{order.id}</strong>
              </p>
              <p className="text-stone-700">
                Courier Tracking: <strong className="font-mono text-orange-600">{order.trackingNumber}</strong>
              </p>
              <p className="text-stone-700">
                Delivery Area: <strong className="text-stone-900">{order.city} (Karachi Only)</strong>
              </p>
              <p className="text-stone-700">
                Payment Method: <strong className="text-emerald-700">{order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMethod}</strong>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-300 text-stone-500 uppercase text-[10px] tracking-wider">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">Size / Color</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {order.items.map((item, idx) => {
                  const unitPrice = item.product?.price || 0;
                  const itemTotal = unitPrice * item.quantity;

                  return (
                    <tr key={idx} className="py-2.5">
                      <td className="py-2.5 font-medium text-stone-900 pr-2">
                        {item.product?.name || 'Eastern Apparel'}
                      </td>
                      <td className="py-2.5 text-center text-stone-500">
                        {item.selectedSize || 'Standard'} • {item.selectedColor || 'Default'}
                      </td>
                      <td className="py-2.5 text-center font-bold text-stone-900">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 text-right font-mono">
                        Rs. {unitPrice.toLocaleString()}
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-stone-900">
                        Rs. {itemTotal.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="border-t border-stone-200 pt-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="bg-orange-50/70 p-3 rounded-xl border border-orange-200/60 max-w-xs text-[11px] text-stone-600">
              <p className="font-bold text-stone-900 flex items-center gap-1 mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Verified Authentic Receipt
              </p>
              <p className="text-[10px] text-stone-500 leading-tight">
                This document serves as your official warranty and purchase voucher. Fast 14-day exchange available in Karachi.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-mono">Rs. {order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Voucher Discount:</span>
                  <span className="font-mono">- Rs. {order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Delivery (Karachi):</span>
                <span className="font-mono">{order.shipping === 0 ? 'FREE' : `Rs. ${order.shipping}`}</span>
              </div>
              <div className="flex justify-between text-stone-500 text-[11px]">
                <span>Taxes & Duties:</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t-2 border-stone-800">
                <span>Net Total Due:</span>
                <span className="font-mono text-base text-[#F85606]">
                  Rs. {order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Signature & Stamp */}
          <div className="mt-8 pt-4 border-t border-dashed border-stone-200 flex flex-col sm:flex-row justify-between items-center text-[10px] text-stone-400 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border-2 border-dashed border-orange-400 flex items-center justify-center font-bold text-[9px] text-[#F85606]">
                SEAL
              </div>
              <span>Authorized Signature: <strong>Memon Traders Sales Desk</strong></span>
            </div>
            <p className="font-mono text-[9px]">Computer-generated receipt • No physical signature required</p>
          </div>

        </div>

      </div>
    </div>
  );
}
