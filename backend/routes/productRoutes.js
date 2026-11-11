import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const router = express.Router();

// GET all products from MongoDB
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    // Normalize _id to id for frontend compatibility
    const normalized = products.map((p) => ({
      ...p,
      id: p._id.toString()
    }));
    res.json({ success: true, count: normalized.length, products: normalized });
  } catch (error) {
    console.error('Error fetching products from MongoDB:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).lean();
    }
    if (!product) {
      product = await Product.findOne({ id }).lean();
    }
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product: { ...product, id: product._id.toString() } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create product in MongoDB
router.post('/', async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await Product.create(productData);
    console.log(`📦 [MONGODB] Added Product: "${newProduct.name}" (ID: ${newProduct._id})`);
    res.status(201).json({
      success: true,
      message: 'Product added successfully to MongoDB',
      product: { ...newProduct.toObject(), id: newProduct._id.toString() }
    });
  } catch (error) {
    console.error('Error creating product in MongoDB:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update product in MongoDB
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let updated = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Product.findByIdAndUpdate(id, req.body, { new: true }).lean();
    } else {
      updated = await Product.findOneAndUpdate({ id }, req.body, { new: true }).lean();
    }
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({
      success: true,
      message: 'Product updated in MongoDB',
      product: { ...updated, id: updated._id.toString() }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE remove product from MongoDB
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Product.findByIdAndDelete(id);
    } else {
      await Product.deleteOne({ id });
    }
    console.log(`🗑️ [MONGODB] Deleted Product: ${id}`);
    res.json({ success: true, message: 'Product deleted from MongoDB' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
