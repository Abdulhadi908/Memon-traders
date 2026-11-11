import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: 'Karachi' },
    province: { type: String, default: 'Sindh' },
    postalCode: { type: String, default: '75500' },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    isVip: { type: Boolean, default: false },
    vipTier: { type: String, default: '' }
  },
  {
    timestamps: true
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
