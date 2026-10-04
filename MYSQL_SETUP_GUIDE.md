# 🗄️ MySQL Workbench Setup Guide — Pâtisserie Dorée

## The Error You Got
```
Access denied for user 'root'@'localhost' (using password: YES)
```
This means the password in your `.env` file doesn't match your MySQL root password.

---

## Step 1 — Find Your MySQL Password

### Option A: If you remember setting a password during MySQL installation
That IS your password. Skip to Step 2.

### Option B: If you set NO password during MySQL installation
Edit `backend/.env` and set:
```
DB_PASSWORD=
```
(leave it completely blank after the = sign)

### Option C: If you forgot your MySQL password
1. Open MySQL Workbench
2. Click your connection (usually "Local instance MySQL80")
3. Click the **wrench icon** (Edit Connection)
4. Go to the **"SSL"** tab → the password field shows what was saved
5. Or reset it: open Command Prompt as Administrator and run:
   ```
   net stop MySQL80
   mysqld --skip-grant-tables --skip-networking
   ```
   Then in a new terminal:
   ```
   mysql -u root
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
   FLUSH PRIVILEGES;
   ```

---

## Step 2 — Edit Your .env File

Open `backend/.env` in any text editor (Notepad is fine):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_ACTUAL_PASSWORD_HERE   ← change this line
DB_NAME=flaky_fantasies
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Examples:**
- If your password is `root123`: `DB_PASSWORD=root123`
- If no password: `DB_PASSWORD=`
- If your password is `mysql@2024`: `DB_PASSWORD=mysql@2024`

---

## Step 3 — Verify MySQL is Running

1. Press **Win + R** → type `services.msc` → press Enter
2. Find **MySQL80** in the list
3. Make sure Status is **"Running"**
4. If not, right-click → **Start**

---

## Step 4 — Run the Backend Again

```powershell
cd backend
npm run dev
```

You should now see:
```
✅ Database "flaky_fantasies" ready — all tables created
✅ Seeded 44 products
🍰 Pâtisserie Dorée Backend running on http://localhost:5000
```

---

## Step 5 — View Tables in MySQL Workbench

After the backend runs successfully:
1. Open **MySQL Workbench**
2. Click your connection
3. In the left panel, expand **Schemas**
4. You'll see **`flaky_fantasies`** database
5. Expand it → **Tables** → you'll see all 8 tables:
   - `contact_messages`
   - `event_bookings`
   - `order_items`
   - `order_tracking`
   - `orders`
   - `payments`
   - `products` (44 rows pre-seeded!)
   - `users`

6. Right-click any table → **"Select Rows – Limit 1000"** to view data

---

## Useful MySQL Workbench Queries

Run these in Workbench (File → New Query Tab):

```sql
-- See all products
USE flaky_fantasies;
SELECT * FROM products;

-- See all orders
SELECT * FROM orders ORDER BY created_at DESC;

-- See order tracking timeline
SELECT o.order_number, ot.status, ot.message, ot.created_at
FROM orders o JOIN order_tracking ot ON o.id = ot.order_id
ORDER BY ot.created_at DESC;

-- Manually advance an order status (replace 1 with actual order id)
UPDATE orders SET status = 'confirmed' WHERE id = 1;
INSERT INTO order_tracking (order_id, status, message)
VALUES (1, 'confirmed', 'Order confirmed by team!');
```
