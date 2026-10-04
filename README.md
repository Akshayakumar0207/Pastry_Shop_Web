# 🍰 Flaky Fantasies — Full-Stack Pastry Shop

A complete end-to-end React + Node.js + MySQL web application for a pastry shop with cart, mock payment, and real-time order tracking.

---

## 📁 Project Structure

```
flaky-fantasies/
├── backend/
│   ├── db/
│   │   └── database.js        ← MySQL connection + auto schema + seed
│   ├── routes/
│   │   ├── products.js        ← GET /api/products
│   │   ├── orders.js          ← POST/GET /api/orders
│   │   ├── payments.js        ← POST /api/payments
│   │   └── events.js          ← POST /api/events/book, /contact
│   ├── public/
│   │   └── images/            ← ⚠ COPY YOUR IMAGES HERE
│   ├── server.js              ← Express entry point
│   ├── package.json
│   └── .env                   ← DB credentials (edit this!)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   ├── CartContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── hooks/
│   │   │   └── useApi.js      ← All API calls
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── Cart.jsx       ← Checkout + mock payment
│   │   │   ├── TrackOrder.jsx ← Polling-based tracking
│   │   │   ├── Events.jsx
│   │   │   └── Contact.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── setup.sh                   ← One-shot installer
└── README.md
```

---

## ⚡ Quick Start

### Step 1 — Copy Images

After downloading/cloning this project, copy all your pastry images into:
```
backend/public/images/
```
(The zip contained ~50 images — copy them all there.)

### Step 2 — Configure Database

Edit `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=flaky_fantasies
```

Make sure MySQL Server is running on your machine.

### Step 3 — Install & Run

**Option A — Automated (Mac/Linux):**
```bash
bash setup.sh
```

**Option B — Manual:**
```bash
# Backend
cd backend
npm install
npm run dev   # starts on http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
npm run dev   # starts on http://localhost:5173
```

### Step 4 — Open Browser
Visit: **http://localhost:5173**

---

## 🗄️ MySQL Tables (Auto-Created)

The backend creates these tables automatically on first run:

| Table | Description |
|---|---|
| `products` | All pastry products with price, image, category |
| `orders` | Customer orders with status |
| `order_items` | Line items per order |
| `order_tracking` | Timeline of status updates |
| `payments` | Payment records (mock) |
| `event_bookings` | Event catering requests |
| `contact_messages` | Contact form submissions |

---

## 🔌 API Endpoints

### Products
```
GET  /api/products              ← all products (optional ?category=cakes)
GET  /api/products/:id          ← single product
GET  /api/products/meta/categories
```

### Orders
```
POST   /api/orders              ← place order
GET    /api/orders/track/:num   ← track by order number (polling)
PATCH  /api/orders/:id/status   ← update status (admin)
```

### Payments (Mock)
```
POST /api/payments/initiate     ← create payment record
POST /api/payments/confirm      ← simulate payment success/fail
GET  /api/payments/:txn_id      ← check payment status
```

### Events & Contact
```
POST /api/events/book           ← book event catering
POST /api/events/contact        ← send contact message
```

---

## 🔄 Order Tracking (Polling)

The Track Order page polls `/api/orders/track/:order_number` every **8 seconds** automatically. It stops polling when the order reaches `delivered` or `cancelled` status.

To simulate order progress (run in terminal or MySQL Workbench):
```sql
-- Confirm order (replace 1 with actual order id)
UPDATE orders SET status = 'confirmed' WHERE id = 1;
INSERT INTO order_tracking (order_id, status, message) VALUES (1, 'confirmed', 'Order confirmed!');

UPDATE orders SET status = 'preparing' WHERE id = 1;
INSERT INTO order_tracking (order_id, status, message) VALUES (1, 'preparing', 'Your pastries are being baked!');

UPDATE orders SET status = 'out_for_delivery' WHERE id = 1;
INSERT INTO order_tracking (order_id, status, message) VALUES (1, 'out_for_delivery', 'Out for delivery!');

UPDATE orders SET status = 'delivered' WHERE id = 1;
INSERT INTO order_tracking (order_id, status, message) VALUES (1, 'delivered', 'Delivered! Enjoy!');
```

Or use the API:
```bash
curl -X PATCH http://localhost:5000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "preparing"}'
```

---

## 💳 Upgrading to Real Razorpay

When ready to use real payments:

1. Sign up at [razorpay.com](https://razorpay.com)
2. Get your `Key ID` and `Key Secret` from the dashboard
3. Add to `backend/.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxx
   RAZORPAY_KEY_SECRET=xxxx
   ```
4. Install: `cd backend && npm install razorpay`
5. Replace the mock logic in `backend/routes/payments.js` with the Razorpay SDK

---

## 🎨 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + React Router v6 |
| Styling | Pure CSS with design tokens (no Tailwind) |
| Backend | Node.js + Express 4 |
| Database | MySQL 8 via mysql2 |
| State | React Context (cart + toasts) |
| Fonts | Playfair Display + DM Sans |

---

## 📞 Support

**Flaky Fantasies**  
📍 57 Raja Street, Salem, India 636010  
📞 +91 8870160044  
📧 flakyfantasies@gmail.com  
🕐 Mon–Sun: 10 AM – 10 PM
