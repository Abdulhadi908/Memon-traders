import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  product?: any;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface IOrder extends Document {
  id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber: string;
  date: Date;
}

const OrderSchema: Schema = new Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  city: { type: String, default: 'Karachi' },
  items: [
    {
      productId: { type: String },
      product: { type: Schema.Types.Mixed },
      quantity: { type: Number, default: 1 },
      selectedSize: { type: String },
      selectedColor: { type: String }
    }
  ],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: 'COD' },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  trackingNumber: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
