import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  role: 'customer' | 'admin';
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: 'Karachi' },
  province: { type: String, default: 'Sindh' },
  postalCode: { type: String, default: '75500' },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
