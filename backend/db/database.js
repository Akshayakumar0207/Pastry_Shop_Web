const { createClient } = require('@libsql/client');
require('dotenv').config();

const db = createClient({
  url:       process.env.TURSO_URL,
  authToken: process.env.TURSO_TOKEN,
});

// mysql2-compatible pool shim — all routes work with ZERO changes
const pool = {
  query: async (sql, params = []) => {
    const result = await db.execute({ sql, args: params ?? [] });
    const rows = result.rows.map(r => ({ ...r }));
    return [rows];
  },
  getConnection: async () => ({
    query:            async (sql, params = []) => pool.query(sql, params),
    beginTransaction: async () => db.execute('BEGIN'),
    commit:           async () => db.execute('COMMIT'),
    rollback:         async () => db.execute('ROLLBACK'),
    release:          () => {},
  }),
};

const initializeDatabase = async () => {
  try {
    await db.executeMultiple(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        weight TEXT DEFAULT '1kg',
        image_url TEXT,
        description TEXT,
        is_available INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT NOT NULL UNIQUE,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT,
        delivery_address TEXT NOT NULL,
        subtotal REAL NOT NULL,
        delivery_fee REAL DEFAULT 50.0,
        total REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        payment_status TEXT DEFAULT 'pending',
        payment_method TEXT DEFAULT 'mock_payment',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER,
        product_name TEXT NOT NULL,
        product_category TEXT,
        quantity INTEGER DEFAULT 1,
        unit_price REAL NOT NULL,
        total_price REAL NOT NULL
      );
      CREATE TABLE IF NOT EXISTS order_tracking (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        status TEXT NOT NULL,
        message TEXT,
        updated_by TEXT DEFAULT 'system',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        transaction_id TEXT NOT NULL UNIQUE,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'INR',
        status TEXT DEFAULT 'pending',
        payment_method TEXT,
        payment_gateway TEXT DEFAULT 'mock',
        gateway_response TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS event_bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_number TEXT NOT NULL UNIQUE,
        customer_name TEXT NOT NULL,
        customer_email TEXT,
        customer_phone TEXT NOT NULL,
        event_date TEXT,
        event_description TEXT,
        delivery_address TEXT NOT NULL,
        selected_items TEXT,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        message TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const check = await db.execute('SELECT COUNT(*) as count FROM products');
    if (Number(check.rows[0].count) === 0) await seedProducts();

    console.log('✅ Turso DB ready — all 8 tables created');
  } catch (err) {
    console.error('❌ Turso DB error:', err.message);
    if (!process.env.TURSO_URL || process.env.TURSO_URL.includes('your-db')) {
      console.error('👉 Edit .env — set TURSO_URL and TURSO_TOKEN from your Turso dashboard');
    }
    throw err;
  }
};

const seedProducts = async () => {
  const rows = [
    ['Vanilla Cake','cakes',850,'1kg','vanila.jpg','Classic creamy vanilla with soft sponge layers'],
    ['Chocolate Cake','cakes',950,'1kg','chocolate.jpg','Rich dark chocolate with velvety ganache frosting'],
    ['Strawberry Cake','cakes',900,'1kg','strawberry.jpg','Fresh strawberry cream with light vanilla sponge'],
    ['Rainbow Cake','cakes',1100,'1kg','rainbow.jpg','Seven vibrant colorful layers of pure joy'],
    ['Red Velvet Cake','cakes',1050,'1kg','redvelvet.jpg','Iconic red velvet with cream cheese frosting'],
    ['Black Forest Cake','cakes',1000,'1kg','blackforest.jpg','Dark chocolate with kirsch cherries and cream'],
    ['White Forest Cake','cakes',1000,'1kg','whiteforest.jpg','White chocolate sponge with cherry cream'],
    ['Oreo Cake','cakes',1050,'1kg','oreo.jpg','Crushed Oreo cookies in every creamy layer'],
    ['Butterscotch Cake','cakes',850,'1kg','butterscoth.jpg','Golden butterscotch drizzle with caramel praline'],
    ['Black Currant Cake','cakes',950,'1kg','blackcurrent.jpg','Tangy black currant with whipped cream'],
    ['Pista Chew Cake','cakes',1050,'1kg','pista chew.jpg','Pistachio with crunchy chew topping'],
    ['Bubblegum Cupcake','cupcakes',120,'1pc','bubblegum.jpeg','Fun bubblegum with pink swirled frosting'],
    ['Orange Creamsicle Cupcake','cupcakes',120,'1pc','orangecreamsicle.jpeg','Zesty orange with vanilla cream swirl'],
    ['Raspberry Swirl Cupcake','cupcakes',130,'1pc','raspberry swirl.jpg','Fresh raspberry swirled into buttercream'],
    ['Cotton Candy Cupcake','cupcakes',120,'1pc','cottoncandy.jpeg','Carnival cotton candy frosting'],
    ['Sprinkle Rainbow Cupcake','cupcakes',110,'1pc','sprinklerainbow.jpeg','Rainbow sprinkles on vanilla buttercream'],
    ['Cinnamon Sugar Cupcake','cupcakes',110,'1pc','cinnamonsugar.jpeg','Warm cinnamon with sugar-dusted top'],
    ['Choco Chip Cookie Dough','cupcakes',140,'1pc','chocolate chip cookie dough.jpeg','Cookie dough stuffed chocolate chip cupcake'],
    ['Lemon Blueberry Cupcake','cupcakes',130,'1pc','lemon blueberry.jpeg','Bright lemon with blueberry compote'],
    ['Customized Cupcakes','cupcakes',180,'1pc','customizied cupcakes.jpeg','Personalized for any occasion'],
    ["S'Mores Galore",'icecream',180,'1 scoop',"s'mores galore.jpeg",'Graham cracker, chocolate, marshmallow'],
    ['Hazelnut Gelato','icecream',200,'1 scoop','hazelnut gelato.jpeg','Authentic Italian hazelnut gelato'],
    ['Rocky Road','icecream',180,'1 scoop','rocky road.jpeg','Chocolate with marshmallow and almonds'],
    ['Cookies and Cream','icecream',170,'1 scoop','cookie and cream.jpeg','Oreo chunks in vanilla cream base'],
    ['Blueberry Cobbler','icecream',190,'1 scoop','blueberry cobbler.jpeg','Blueberry cobbler in frozen form'],
    ['Coconut Lime','icecream',175,'1 scoop','coconut lime.jpeg','Tropical coconut with zesty lime'],
    ['Lemon Lavender','icecream',195,'1 scoop','lemon lavender.jpeg','Floral lavender with bright lemon'],
    ['Mango Sorbet','icecream',160,'1 scoop','mango sorbet.jpeg','Pure Alphonso mango sorbet'],
    ['Fudgy Brownies','desserts',120,'2pcs','brownies.jpeg','Dense fudgy dark chocolate brownies'],
    ['New York Cheesecake','desserts',350,'1 slice','cheesecake.jpeg','Creamy cheesecake on graham cracker base'],
    ['Fruit Pie','desserts',280,'1 slice','pie.jpeg','Flaky crust with seasonal fruit compote'],
    ['Butter Tarts','desserts',150,'1pc','tarts.jpeg','Crispy pastry with silky custard'],
    ['Tiramisu','desserts',320,'1 slice','tiramisu.jpg','Espresso-soaked ladyfingers with mascarpone'],
    ['Chocolate Mousse','desserts',250,'1 cup','mouse.jpg','Light airy dark chocolate mousse'],
    ['Mochi','desserts',80,'1pc','mochi.jpeg','Soft Japanese rice cake with sweet filling'],
    ['Baklava','desserts',180,'2pcs','baklava.jpeg','Honey-soaked phyllo with pistachios'],
    ['Cinnamon Rolls','desserts',140,'1pc','cinnamonrolls.jpeg','Warm pillowy rolls with cream cheese glaze'],
    ['Caramel Pudding','desserts',160,'1 cup','pudding.png','Silky caramel custard with toffee sauce'],
    ['Lemon Bars','desserts',130,'2pcs','lemonbar.jpeg','Tangy lemon curd on shortbread base'],
    ['Tres Leches','desserts',300,'1 slice','tresleches.jpeg','Three-milk soaked sponge cake'],
    ['Creme Brulee','desserts',280,'1 cup','creme brulee.jpeg','French custard with torched caramel crust'],
    ['Chocolate Lava Cake','desserts',220,'1pc','chocolatelava cake.jpeg','Warm cake with molten chocolate center'],
    ['Choco Mint Dessert','desserts',200,'1 slice','choco mint.jpeg','Peppermint with dark chocolate ganache'],
    ['Assorted Sweets Box','sweets',450,'500g','sweets.jpg','Handpicked traditional Indian confections'],
  ];
  for (const [name,category,price,weight,image_url,description] of rows) {
    await db.execute({
      sql: 'INSERT INTO products (name,category,price,weight,image_url,description) VALUES (?,?,?,?,?,?)',
      args: [name,category,price,weight,image_url,description],
    });
  }
  console.log(`✅ Seeded ${rows.length} products`);
};

module.exports = { pool, initializeDatabase };
