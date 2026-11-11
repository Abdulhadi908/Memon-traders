import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';

const router = express.Router();

// GET all orders from MongoDB Atlas
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1, date: -1 }).lean();
    const normalized = orders.map((o) => ({
      ...o,
      id: o.orderId || o._id.toString()
    }));
    res.json({ success: true, count: normalized.length, orders: normalized });
  } catch (error) {
    console.error('Error fetching orders from MongoDB:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create new order in MongoDB Atlas
router.post('/', async (req, res) => {
  try {
    const orderData = req.body;
    const generatedId = orderData.id || `PK-${Math.floor(100000 + Math.random() * 900000)}`;
    const tracking = orderData.trackingNumber || `TCS-${Math.floor(100000 + Math.random() * 900000)}-PK`;

    // Flatten product name, price, image and line total into each item for clear MongoDB visibility
    const enrichedItems = (orderData.items || []).map((item) => ({
      productId: item.productId || '',
      productName: item.product?.name || item.productName || 'Unknown Product',
      productPrice: item.product?.price || item.productPrice || 0,
      productImage: item.product?.image || item.productImage || '',
      quantity: item.quantity || 1,
      lineTotal: (item.product?.price || item.productPrice || 0) * (item.quantity || 1),
      selectedSize: item.selectedSize || 'Standard',
      selectedColor: item.selectedColor || 'Default',
      product: item.product || null
    }));

    const newOrder = await Order.create({
      ...orderData,
      items: enrichedItems,
      orderId: generatedId,
      trackingNumber: tracking,
      date: orderData.date ? new Date(orderData.date) : new Date()
    });

    console.log(`\n🔔 [MONGODB ATLAS] NEW ORDER SAVED:`);
    console.log(`   Order ID: #${generatedId} (Mongo _id: ${newOrder._id})`);
    console.log(`   Customer: ${newOrder.customerName} (${newOrder.city})`);
    console.log(`   Items: ${enrichedItems.map(i => `${i.productName} x${i.quantity}`).join(', ')}`);
    console.log(`   Amount: Rs. ${newOrder.total}`);
    console.log(`   Payment: ${newOrder.paymentMethod}`);
    console.log(`   Courier Tracking: ${tracking}\n`);

    res.status(201).json({
      success: true,
      message: 'Order saved in MongoDB Atlas',
      order: {
        ...newOrder.toObject(),
        id: generatedId
      }
    });
  } catch (error) {
    console.error('Error saving order to MongoDB:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let updated = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean();
    }
    if (!updated) {
      updated = await Order.findOneAndUpdate({ orderId: id }, { status }, { new: true }).lean();
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      message: 'Order status updated in MongoDB',
      order: { ...updated, id: updated.orderId || updated._id.toString() }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE complete / remove order from MongoDB Atlas
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Order.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await Order.findOneAndDelete({ orderId: id });
    }

    console.log(`🗑️ [MONGODB ATLAS] Order completed & deleted: #${id}`);
    res.json({ success: true, message: 'Order completed and permanently removed from MongoDB' });
  } catch (error) {
    console.error('Error deleting order from MongoDB:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST alert notification
router.post('/notify', async (req, res) => {
  try {
    const { order, adminPhone } = req.body;
    console.log(`🔔 [LIVE NOTIFICATION] Order Alert: #${order?.id || order?.orderId} for Rs. ${order?.total}`);
    res.json({ success: true, message: 'Notification dispatched' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
