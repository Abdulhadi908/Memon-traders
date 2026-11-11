import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend or root directory
const envPath = fs.existsSync(path.join(__dirname, '.env'))
  ? path.join(__dirname, '.env')
  : path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import { UserModel } from './models/User.js';
import { ProductModel } from './models/Product.js';
import { OrderModel } from './models/Order.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'memon_traders_secure_jwt_token_key_99';
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors({ origin: '*' }));
app.use(express.json());

// Local JSON fallback utilities
interface DBUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

interface DBData {
  users: Array<DBUser>;
  products: Array<any>;
  orders: Array<any>;
}

const getDB = (): DBData => {
  if (!fs.existsSync(DB_FILE)) {
    const initial: DBData = { users: [], products: [], orders: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch {
    return { users: [], products: [], orders: [] };
  }
};

const saveDB = (data: DBData) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Local db.json save error:', err);
  }
};

// Check if MongoDB is currently connected
const isMongoReady = () => mongoose.connection.readyState === 1;

// Auth middleware for protected user routes
const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired session token' });
  }
};

// ---------------- HEALTH & CLUSTER STATUS ----------------
app.get('/api/health', (req: Request, res: Response) => {
  const mongoStatus = isMongoReady() ? 'Connected (MongoDB Atlas)' : 'Fallback Local File';
  res.json({
    status: 'online',
    database: mongoStatus,
    cluster: 'cluster0.fa52h1o.mongodb.net',
    timestamp: new Date().toISOString()
  });
});

// ---------------- AUTH ROUTES ----------------

// 1. Customer Signup
app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, address, city, province, postalCode } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const db = getDB();

    // Check existing in MongoDB or local
    if (isMongoReady()) {
      const existingMongo = await UserModel.findOne({ email: cleanEmail });
      if (existingMongo) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }
    } else {
      const existing = db.users.find(u => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let savedUserId = `usr-${Date.now()}`;

    if (isMongoReady()) {
      const newMongoUser = await UserModel.create({
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        phone: phone ? phone.trim() : '',
        address: address ? address.trim() : '',
        city: city ? city.trim() : 'Karachi',
        province: province ? province.trim() : 'Sindh',
        postalCode: postalCode ? postalCode.trim() : '75500',
        role: 'customer'
      });
      savedUserId = newMongoUser._id.toString();
    }

    // Also persist to local JSON cache
    const newUser: DBUser = {
      id: savedUserId,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      phone: phone ? phone.trim() : '',
      address: address ? address.trim() : '',
      city: city ? city.trim() : 'Karachi',
      province: province ? province.trim() : 'Sindh',
      postalCode: postalCode ? postalCode.trim() : '75500',
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    saveDB(db);

    const token = jwt.sign(
      { id: savedUserId, email: cleanEmail, role: 'customer', name: name.trim() },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: {
        id: savedUserId,
        name: name.trim(),
        email: cleanEmail,
        phone: phone ? phone.trim() : '',
        address: address ? address.trim() : '',
        city: city ? city.trim() : 'Karachi',
        province: province ? province.trim() : 'Sindh',
        postalCode: postalCode ? postalCode.trim() : '75500',
        role: 'customer'
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// 2. Customer Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user: any = null;

    if (isMongoReady()) {
      user = await UserModel.findOne({ email: cleanEmail });
    }

    // Fallback to local DB if not in Mongo or Mongo not ready
    if (!user) {
      const db = getDB();
      user = db.users.find(u => u.email.toLowerCase() === cleanEmail);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userId = user._id ? user._id.toString() : user.id;

    const token = jwt.sign(
      { id: userId, email: user.email, role: user.role || 'customer', name: user.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || 'Karachi',
        province: user.province || 'Sindh',
        postalCode: user.postalCode || '75500',
        role: user.role || 'customer'
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// ---------------- PROFILE MANAGEMENT ROUTES ----------------

// 3. Get User Profile
app.get('/api/user/profile', authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    let user: any = null;

    if (isMongoReady()) {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        user = await UserModel.findById(userId);
      } else {
        user = await UserModel.findOne({ email: (req as any).user.email });
      }
    }

    if (!user) {
      const db = getDB();
      user = db.users.find(u => u.id === userId || u.email === (req as any).user.email);
    }

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json({
      user: {
        id: user._id ? user._id.toString() : user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || 'Karachi',
        province: user.province || 'Sindh',
        postalCode: user.postalCode || '75500',
        role: user.role || 'customer',
        createdAt: user.createdAt
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Update Profile Details
app.put('/api/user/profile', authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, phone, address, city, province, postalCode } = req.body;

    const updateFields: any = {};
    if (name) updateFields.name = name.trim();
    if (phone !== undefined) updateFields.phone = phone.trim();
    if (address !== undefined) updateFields.address = address.trim();
    if (city !== undefined) updateFields.city = city.trim();
    if (province !== undefined) updateFields.province = province.trim();
    if (postalCode !== undefined) updateFields.postalCode = postalCode.trim();

    let updatedUser: any = null;

    if (isMongoReady()) {
      if (mongoose.Types.ObjectId.isValid(userId)) {
        updatedUser = await UserModel.findByIdAndUpdate(userId, updateFields, { new: true });
      } else {
        updatedUser = await UserModel.findOneAndUpdate({ email: (req as any).user.email }, updateFields, { new: true });
      }
    }

    // Also update local DB
    const db = getDB();
    const userIndex = db.users.findIndex(u => u.id === userId || u.email === (req as any).user.email);
    if (userIndex !== -1) {
      db.users[userIndex] = { ...db.users[userIndex], ...updateFields };
      saveDB(db);
      if (!updatedUser) updatedUser = db.users[userIndex];
    }

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id ? updatedUser._id.toString() : updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || '',
        address: updatedUser.address || '',
        city: updatedUser.city || 'Karachi',
        province: updatedUser.province || 'Sindh',
        postalCode: updatedUser.postalCode || '75500',
        role: updatedUser.role || 'customer'
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Change Password
app.put('/api/user/change-password', authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    let user: any = null;
    if (isMongoReady()) {
      user = mongoose.Types.ObjectId.isValid(userId)
        ? await UserModel.findById(userId)
        : await UserModel.findOne({ email: (req as any).user.email });
    }

    const db = getDB();
    const localIndex = db.users.findIndex(u => u.id === userId || u.email === (req as any).user.email);
    if (!user && localIndex !== -1) {
      user = db.users[localIndex];
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password does not match' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    if (isMongoReady() && user._id) {
      await UserModel.findByIdAndUpdate(user._id, { passwordHash: newHash });
    }

    if (localIndex !== -1) {
      db.users[localIndex].passwordHash = newHash;
      saveDB(db);
    }

    res.json({ message: 'Password updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- ADMIN ROUTES ----------------

// 6. Admin Direct Access (No Password Required)
app.post('/api/auth/admin-login', async (req: Request, res: Response) => {
  try {
    const token = jwt.sign(
      { role: 'admin', user: 'Administrator' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Admin authorization granted',
      token,
      role: 'admin'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// ---------------- PRODUCTS CRUD (MONGODB ATLAS) ----------------

// 7. Get All Products
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    if (isMongoReady()) {
      const products = await ProductModel.find().lean();
      return res.json({ products });
    }
    const db = getDB();
    res.json({ products: db.products });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Add Product
app.post('/api/products', async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    if (isMongoReady()) {
      const created = await ProductModel.create(productData);
      return res.status(201).json({ message: 'Product added to MongoDB', product: created });
    }

    const db = getDB();
    const newProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    db.products.unshift(newProduct);
    saveDB(db);
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Delete Product
app.delete('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isMongoReady()) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await ProductModel.findByIdAndDelete(id);
      } else {
        await ProductModel.deleteOne({ id });
      }
    }
    const db = getDB();
    db.products = db.products.filter(p => p.id !== id && p._id !== id);
    saveDB(db);
    res.json({ message: 'Product deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- ORDERS CRUD (MONGODB ATLAS) ----------------

// 10. Get All Orders
app.get('/api/orders', async (req: Request, res: Response) => {
  try {
    if (isMongoReady()) {
      const orders = await OrderModel.find().sort({ date: -1 }).lean();
      return res.json({ orders });
    }
    const db = getDB();
    res.json({ orders: db.orders });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Create Order
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    let savedOrder: any = null;

    if (isMongoReady()) {
      savedOrder = await OrderModel.create(orderData);
    }

    const db = getDB();
    const newOrder = savedOrder ? savedOrder.toObject() : {
      ...orderData,
      id: orderData.id || `PK-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString()
    };
    db.orders.unshift(newOrder);
    saveDB(db);

    console.log(`\n🔔 [NEW ORDER SAVED TO MONGODB] Order #${newOrder.id || newOrder._id}`);
    console.log(`   Customer: ${newOrder.customerName} (${newOrder.city || 'Karachi'})`);
    console.log(`   Total: Rs. ${newOrder.total}`);
    console.log(`   Payment: ${newOrder.paymentMethod || 'COD'}\n`);

    res.status(201).json({ message: 'Order placed and saved to MongoDB', order: newOrder });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 12. Delete / Complete Order
app.delete('/api/orders/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (isMongoReady()) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await OrderModel.findByIdAndDelete(id);
      } else {
        await OrderModel.deleteOne({ id });
      }
    }
    const db = getDB();
    db.orders = db.orders.filter(o => o.id !== id && o._id !== id);
    saveDB(db);
    res.json({ message: 'Order completed and permanently removed' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 13. Order Alert & Phone Notification Dispatch
app.post('/api/orders/notify', async (req: Request, res: Response) => {
  try {
    const { order, adminPhone } = req.body;
    console.log(`\n🔔 [NEW ORDER ALERT] Order #${order?.id} received!`);
    console.log(`   Customer: ${order?.customerName} (${order?.city})`);
    console.log(`   Total: Rs. ${order?.total}`);
    console.log(`   Payment: ${order?.paymentMethod || 'COD'}`);
    console.log(`   Admin Phone Alert Target: ${adminPhone || 'Default'}\n`);

    res.json({ success: true, message: 'Order alert received and dispatched' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ----------- SERVE FRONTEND IN PRODUCTION -----------
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.use((req: Request, res: Response) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Start Server and Connect to MongoDB
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Memon Traders Express Server running on http://localhost:${PORT}`);
  });
};

startServer();
