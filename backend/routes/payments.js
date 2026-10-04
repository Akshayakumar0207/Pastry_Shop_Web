const express = require('express');
const router  = express.Router();
const { pool } = require('../db/database');
const { v4: uuidv4 } = require('uuid');

router.post('/initiate', async (req, res) => {
  try {
    const { order_id, amount } = req.body;
    if (!order_id || !amount)
      return res.status(400).json({ success: false, message: 'order_id and amount required' });

    const [orders] = await pool.query('SELECT * FROM orders WHERE id=?', [order_id]);
    if (!orders.length) return res.status(404).json({ success: false, message: 'Order not found' });

    const transaction_id = `TXN_${uuidv4().replace(/-/g,'').substring(0,16).toUpperCase()}`;
    await pool.query(
      `INSERT INTO payments (order_id,transaction_id,amount,status,payment_method,payment_gateway)
       VALUES (?,?,?,'pending','mock_card','mock')`,
      [order_id, transaction_id, amount]
    );

    res.json({ success: true, data: { transaction_id, order_id, amount, currency: 'INR' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/confirm', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { transaction_id, payment_method } = req.body;
    if (!transaction_id)
      return res.status(400).json({ success: false, message: 'transaction_id required' });

    const [payments] = await conn.query('SELECT * FROM payments WHERE transaction_id=?', [transaction_id]);
    if (!payments.length) return res.status(404).json({ success: false, message: 'Transaction not found' });

    const payment   = payments[0];
    const isSuccess = Math.random() > 0.05;
    const newStatus = isSuccess ? 'success' : 'failed';

    await conn.query(
      `UPDATE payments SET status=?,payment_method=?,gateway_response=? WHERE transaction_id=?`,
      [newStatus, payment_method||'mock_card',
       JSON.stringify({ mock: true, result: newStatus, ts: new Date().toISOString() }),
       transaction_id]
    );

    if (isSuccess) {
      await conn.query(`UPDATE orders SET payment_status='paid',status='confirmed' WHERE id=?`, [payment.order_id]);
      await conn.query(
        'INSERT INTO order_tracking (order_id,status,message) VALUES (?,?,?)',
        [payment.order_id, 'confirmed', 'Payment received! Order confirmed. Bakers are starting soon 🥐']
      );
    }

    await conn.commit();
    res.json({ success: true, data: { transaction_id, status: newStatus, order_id: payment.order_id,
      message: isSuccess ? 'Payment successful!' : 'Payment failed. Please try again.' } });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

router.get('/:transaction_id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM payments WHERE transaction_id=?', [req.params.transaction_id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
