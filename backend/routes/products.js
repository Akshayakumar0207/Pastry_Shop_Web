const express = require('express');
const router  = express.Router();
const { pool } = require('../db/database');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let sql    = 'SELECT * FROM products WHERE is_available=1';
    const args = [];
    if (category) { sql += ' AND category=?'; args.push(category); }
    sql += ' ORDER BY category, name';
    const [rows] = await pool.query(sql, args);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/meta/categories', async (_, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT category, COUNT(*) as count, MIN(price) as min_price, MAX(price) as max_price
       FROM products WHERE is_available=1 GROUP BY category`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
