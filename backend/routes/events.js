const express = require('express');
const router  = express.Router();
const { pool } = require('../db/database');

router.post('/book', async (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, event_date, event_description,
            delivery_address, selected_items, total_amount } = req.body;
    if (!customer_name || !customer_phone || !delivery_address)
      return res.status(400).json({ success: false, message: 'Missing required fields' });

    const booking_number = `EVT-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*9000+1000)}`;
    await pool.query(
      `INSERT INTO event_bookings
       (booking_number,customer_name,customer_email,customer_phone,event_date,event_description,delivery_address,selected_items,total_amount)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [booking_number, customer_name, customer_email||null, customer_phone,
       event_date||null, event_description||null, delivery_address,
       JSON.stringify(selected_items||[]), total_amount||0]
    );
    res.status(201).json({ success: true, data: { booking_number, message: 'Event booking submitted!' } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', async (_, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM event_bookings ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: 'name, email and message required' });
    await pool.query(
      'INSERT INTO contact_messages (name,email,phone,message) VALUES (?,?,?,?)',
      [name, email, phone||null, message]
    );
    res.status(201).json({ success: true, message: 'Message sent! We will reply soon.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
