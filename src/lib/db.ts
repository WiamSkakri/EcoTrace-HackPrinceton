import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'transactions.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to transactions database");
  }
});

// Initialize tables
db.run(`CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transactionId TEXT,
  externalId TEXT,
  datetime TEXT,
  url TEXT,
  orderStatus TEXT,
  paymentMethods TEXT,
  price TEXT,
  products TEXT,
  merchantId TEXT,
  merchantName TEXT,
  rawData TEXT
)`, (err) => {
  if (err) console.error("Error creating transactions table:", err.message);
});

export default db;