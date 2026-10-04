const express = require('express');
const router  = express.Router();
const { pool } = require('../db/database');

const genOrderNum = () =>
  `PD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*9000+1000)}`;

// POST — create order
router.post('/', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { customer_name, customer_email, customer_phone, delivery_address, items, notes } = req.body;

    if (!customer_name || !customer_email || !delivery_address || !items?.length)
      return res.status(400).json({ success: false, message: 'Missing required fields' });

    let subtotal = 0;
    const orderItems = items.map(i => {
      const unit = parseFloat(i.unit_price || 0);
      const qty  = parseInt(i.quantity) || 1;
      subtotal  += unit * qty;
      return { ...i, unit_price: unit, total_price: unit * qty, quantity: qty };
    });

    const delivery_fee = 50;
    const total        = subtotal + delivery_fee;
    const order_number = genOrderNum();

    await conn.query(
      `INSERT INTO orders (order_number,customer_name,customer_email,customer_phone,delivery_address,subtotal,delivery_fee,total,notes)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [order_number, customer_name, customer_email, customer_phone||null, delivery_address, subtotal, delivery_fee, total, notes||null]
    );

    const [idRow] = await conn.query('SELECT last_insert_rowid() as id');
    const orderId = idRow[0].id;

    for (const item of orderItems) {
      await conn.query(
        `INSERT INTO order_items (order_id,product_id,product_name,product_category,quantity,unit_price,total_price)
         VALUES (?,?,?,?,?,?,?)`,
        [orderId, item.product_id||null, item.product_name||item.name, item.product_category||item.category||null, item.quantity, item.unit_price, item.total_price]
      );
    }

    await conn.query(
      'INSERT INTO order_tracking (order_id,status,message) VALUES (?,?,?)',
      [orderId, 'pending', 'Order placed successfully! Awaiting confirmation.']
    );

    await conn.commit();
    res.status(201).json({ success: true, data: { order_id: orderId, order_number, total, subtotal, delivery_fee } });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

// GET — track by order number
router.get('/track/:order_number', async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE order_number=?', [req.params.order_number]);
    if (!orders.length) return res.status(404).json({ success: false, message: 'Order not found' });
    const order = orders[0];

    const [items]    = await pool.query('SELECT * FROM order_items WHERE order_id=?', [order.id]);
    const [tracking] = await pool.query('SELECT * FROM order_tracking WHERE order_id=? ORDER BY created_at ASC', [order.id]);
    const [payments] = await pool.query('SELECT * FROM payments WHERE order_id=? LIMIT 1', [order.id]);

    res.json({ success: true, data: { ...order, items, tracking, payment: payments[0]||null } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET — all orders
router.get('/', async (_, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH — update status
router.patch('/:id/status', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { status, message } = req.body;
    const valid = ['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'];
    if (!valid.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });

    await conn.query('UPDATE orders SET status=? WHERE id=?', [status, req.params.id]);

    const msgs = {
      confirmed: 'Order confirmed! Our bakers are getting started 🥐',
      preparing: 'Your pastries are being lovingly crafted! 🍰',
      out_for_delivery: 'On the way! Our delivery partner is heading to you 🚚',
      delivered: 'Delivered! Enjoy your Patisserie Doree treats 🎉',
      cancelled: 'Order has been cancelled.',
    };
    await conn.query(
      'INSERT INTO order_tracking (order_id,status,message) VALUES (?,?,?)',
      [req.params.id, status, message || msgs[status] || `Status: ${status}`]
    );

    await conn.commit();
    res.json({ success: true, message: 'Order updated' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
