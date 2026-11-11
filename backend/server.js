import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
const envPath = fs.existsSync(path.join(__dirname, '.env'))
  ? path.join(__dirname, '.env')
  : path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

import connectDB from './config/db.js';
import { seedDatabase } from './seeder.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    stack: 'MERN (MongoDB, Express, React, Node.js)',
    database: 'MongoDB Atlas Connected',
    cluster: 'cluster0.fa52h1o.mongodb.net',
    timestamp: new Date().toISOString()
  });
});

// Serve Frontend in Production
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.use((req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Start Server & Connect MongoDB
const start = async () => {
  try {
    await connectDB();
    // Seed initial products and orders so they are immediately visible in MongoDB Atlas
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 [MERN] Express Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error.message);
  }
};

start();
