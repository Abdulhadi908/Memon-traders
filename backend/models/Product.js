import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discountPercentage: { type: Number, default: 0 },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 24 },
    soldCount: { type: Number, default: 12 },
    image: { type: String, required: true },
    secondaryImage: { type: String },
    color: { type: String, default: 'Black' },
    description: { type: String, default: '' },
    stock: { type: Number, default: 25 },
    isDarazMall: { type: Boolean, default: true },
    freeShipping: { type: Boolean, default: true },
    isFlashSale: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: true },
    sizes: { type: [String], default: ['Small', 'Medium', 'Large', 'Custom Stitch'] }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
