import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = fs.existsSync(path.join(__dirname, '.env'))
  ? path.join(__dirname, '.env')
  : path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

import connectDB from './config/db.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import User from './models/User.js';

const sampleProducts = [
  {
    name: "Luxury Embroidered Lawn 3-Piece Stitched Suit",
    category: "fashion",
    price: 7500,
    originalPrice: 9500,
    discountPercentage: 21,
    rating: 4.9,
    reviewsCount: 38,
    soldCount: 84,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800",
    secondaryImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800",
    color: "Deep Maroon / Gold Zari",
    description: "Premium pure lawn kameez with delicate resham embroidery and tilla border, paired with digitally printed silk dupatta and dyed cambric trousers. Ideal for festive gatherings in Karachi.",
    stock: 24,
    isDarazMall: true,
    freeShipping: true,
    isFlashSale: true,
    isNewArrival: true,
    sizes: ["Small", "Medium", "Large", "Custom Stitched"]
  },
  {
    name: "Royal Dubai Velvet Abaya with Scarf",
    category: "abayas",
    price: 11200,
    originalPrice: 14000,
    discountPercentage: 20,
    rating: 5.0,
    reviewsCount: 52,
    soldCount: 110,
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=800",
    secondaryImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800",
    color: "Jet Black / Crystal Embroidery",
    description: "Tailored from imported Korean Nida velvet with hand-sewn crystal stonework along cuffs and front seam. Includes matching premium georgette shayla.",
    stock: 18,
    isDarazMall: true,
    freeShipping: true,
    isFlashSale: false,
    isNewArrival: true,
    sizes: ["52", "54", "56", "58"]
  },
  {
    name: "Unstitched Heavy Chiffon Festive Collection 3pc",
    category: "unstitched",
    price: 8900,
    originalPrice: 11500,
    discountPercentage: 22,
    rating: 4.8,
    reviewsCount: 29,
    soldCount: 47,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800",
    secondaryImage: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800",
    color: "Emerald Green",
    description: "Intricately embroidered chiffon front, back and sleeves with zari border and organza cutwork patch. Accompanied by embroidered net dupatta and raw silk trousers.",
    stock: 35,
    isDarazMall: true,
    freeShipping: true,
    isFlashSale: false,
    isNewArrival: true,
    sizes: ["Unstitched (3-Piece)"]
  },
  {
    name: "Handcrafted Bridal Zari Clutch & Party Bag",
    category: "bags",
    price: 4500,
    originalPrice: 6000,
    discountPercentage: 25,
    rating: 4.7,
    reviewsCount: 19,
    soldCount: 63,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800",
    secondaryImage: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
    color: "Antique Gold",
    description: "Exquisite hand-worked metallic clasp evening bag featuring dabka, kora and pearl motifs. Includes detachable gold chain shoulder strap.",
    stock: 15,
    isDarazMall: false,
    freeShipping: false,
    isFlashSale: true,
    isNewArrival: false,
    sizes: ["Standard Clutch"]
  },
  {
    name: "Traditional Kundan & Pearl Choker Jewellery Set",
    category: "jewelry",
    price: 5800,
    originalPrice: 7500,
    discountPercentage: 22,
    rating: 4.9,
    reviewsCount: 44,
    soldCount: 92,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    secondaryImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800",
    color: "24K Gold Plated / Ruby Stones",
    description: "Heritage Rajputana kundan choker necklace with matching jhumkas and maang tikka, encrusted with semi-precious ruby stones and hanging pearl drops.",
    stock: 12,
    isDarazMall: true,
    freeShipping: true,
    isFlashSale: false,
    isNewArrival: true,
    sizes: ["Adjustable Dori"]
  },
  {
    name: "Hand-Embroidered Velvet Tilla Khussa Shoes",
    category: "shoes",
    price: 3600,
    originalPrice: 4800,
    discountPercentage: 25,
    rating: 4.8,
    reviewsCount: 31,
    soldCount: 76,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800",
    secondaryImage: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=800",
    color: "Midnight Blue & Silver",
    description: "Authentic double-padded leather sole khussa with plush velvet upper and intricate silver tilla hand embroidery. Comfortable all-day wear.",
    stock: 28,
    isDarazMall: false,
    freeShipping: true,
    isFlashSale: false,
    isNewArrival: true,
    sizes: ["36", "37", "38", "39", "40", "41"]
  }
];

const sampleOrders = [
  {
    orderId: "PK-819204",
    customerName: "Abdul Hadi",
    customerEmail: "abdulhad.anee0s9@gmail.com",
    customerPhone: "+92 335 1751674",
    shippingAddress: "Maryam Palace 2nd Floor Flat #213, Imtiaz Street, Kharadar",
    city: "Karachi",
    items: [
      {
        productId: "sample-1",
        productName: "Luxury Embroidered Lawn 3-Piece Stitched Suit",
        productPrice: 7500,
        productImage: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=400",
        quantity: 1,
        lineTotal: 7500,
        selectedSize: "Medium",
        selectedColor: "Deep Maroon / Gold Zari",
        product: {
          name: "Luxury Embroidered Lawn 3-Piece Stitched Suit",
          price: 7500,
          image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=400"
        }
      }
    ],
    subtotal: 7500,
    discount: 500,
    shipping: 0,
    total: 7000,
    status: "Processing",
    paymentMethod: "COD",
    trackingNumber: "TCS-930219-PK",
    date: new Date()
  },
  {
    orderId: "PK-640192",
    customerName: "Sana Tariq",
    customerEmail: "sana.tariq@gmail.com",
    customerPhone: "+92 321 8291039",
    shippingAddress: "House 42, 14th Street, Khayaban-e-Seher, DHA Phase 6",
    city: "Karachi",
    items: [
      {
        productId: "sample-2",
        productName: "Royal Dubai Velvet Abaya with Scarf",
        productPrice: 11200,
        productImage: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=400",
        quantity: 1,
        lineTotal: 11200,
        selectedSize: "54",
        selectedColor: "Jet Black",
        product: {
          name: "Royal Dubai Velvet Abaya with Scarf",
          price: 11200,
          image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=400"
        }
      }
    ],
    subtotal: 11200,
    discount: 0,
    shipping: 0,
    total: 11200,
    status: "Shipped",
    paymentMethod: "COD",
    trackingNumber: "TCS-449102-PK",
    date: new Date(Date.now() - 24 * 3600 * 1000)
  }
];

export const seedDatabase = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.log('Skipping seed: MongoDB not connected.');
      return;
    }

    const productCount = await Product.countDocuments();
    console.log(`Current products in MongoDB: ${productCount}`);
    if (productCount === 0) {
      console.log('🌱 Seeding initial products into MongoDB Atlas...');
      await Product.insertMany(sampleProducts);
      console.log(`✅ Successfully seeded ${sampleProducts.length} products into MongoDB!`);
    }

    const orderCount = await Order.countDocuments();
    console.log(`Current orders in MongoDB: ${orderCount}`);
    if (orderCount === 0) {
      console.log('🌱 Seeding initial orders into MongoDB Atlas...');
      await Order.insertMany(sampleOrders);
      console.log(`✅ Successfully seeded ${sampleOrders.length} orders into MongoDB!`);
    }

    // Check user
    const userCount = await User.countDocuments();
    console.log(`Current users in MongoDB: ${userCount}`);
    if (userCount === 0) {
      console.log('🌱 Seeding initial user into MongoDB Atlas...');
      await User.create({
        name: "Abdul Hadi",
        email: "abdulhad.anee0s9@gmail.com",
        passwordHash: "$2b$10$ubpcabRTMpHXvjUjSZlNJOYBK3YQKmsbzt9xAE6w6mamjwH6wVx2q",
        phone: "+92 335 1751674",
        address: "Maryam palace 2nd flat # 213 imtiaz street kharadar karachi",
        city: "Karachi",
        province: "Sindh",
        postalCode: "75500",
        role: "customer"
      });
      console.log('✅ Successfully seeded user into MongoDB!');
    }
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
};

// If run directly from CLI
if (process.argv[1] && process.argv[1].endsWith('seeder.js')) {
  seedDatabase().then(() => {
    console.log('Database seeding process complete.');
    process.exit(0);
  });
}
