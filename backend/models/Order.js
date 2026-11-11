import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, default: '' },
  productPrice: { type: Number, default: 0 },
  productImage: { type: String, default: '' },
  quantity: { type: Number, required: true, default: 1 },
  lineTotal: { type: Number, default: 0 },
  selectedSize: { type: String, default: 'Standard' },
  selectedColor: { type: String, default: 'Default' },
  product: { type: Object }
});

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    city: { type: String, default: 'Karachi' },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    paymentMethod: { type: String, default: 'COD' },
    trackingNumber: { type: String, required: true },
    date: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
