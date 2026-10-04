require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { initializeDatabase } = require('./db/database');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── CORS ─────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
];
app.use(cors({
  origin: (origin, cb) => {
    // allow Vercel preview URLs and no-origin (curl, Render health checks)
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      cb(null, true);
    } else {
      cb(new Error('CORS: ' + origin + ' not allowed'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve product images ──────────────────────────────────
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// ── Health check ──────────────────────────────────────────
app.get('/api/health', (_, res) =>
  res.json({ success: true, message: 'Patisserie Doree API is running! 🥐', ts: new Date() })
);

// ── API Routes ────────────────────────────────────────────
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/events',   require('./routes/events'));

// ── 404 ───────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ success: false, message: `${req.originalUrl} not found` })
);

// ── Error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🥐 Patisserie Doree API → http://localhost:${PORT}`);
      console.log(`   Health : http://localhost:${PORT}/api/health`);
      console.log(`   Products: http://localhost:${PORT}/api/products\n`);
    });
  })
  .catch(err => {
    console.error('Failed to start:', err.message);
    process.exit(1);
  });
