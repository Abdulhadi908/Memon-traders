import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  images?: string[];
  stock: number;
  featured?: boolean;
  rating?: number;
  reviewsCount?: number;
  tags?: string[];
  sizes?: string[];
  colors?: string[];
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  description: { type: String, default: '' },
  category: { type: String, required: true },
  image: { type: String, required: true },
  images: [{ type: String }],
  stock: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 5 },
  reviewsCount: { type: Number, default: 0 },
  tags: [{ type: String }],
  sizes: [{ type: String }],
  colors: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
