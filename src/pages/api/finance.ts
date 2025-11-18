import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

interface Transaction {
  id: number;
  transactionId: string;
  orderStatus: string;
  price: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  db.all(`SELECT * FROM transactions`, [], (err, rows: Transaction[]) => {
    if (err) {
      console.error("Error retrieving transactions:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    let totalSpent = 0;
    let totalTransactions = rows.length;
    let transactionsByStatus: Record<string, number> = {};

    rows.forEach(row => {
      transactionsByStatus[row.orderStatus] = (transactionsByStatus[row.orderStatus] || 0) + 1;

      let priceData;
      try {
        priceData = JSON.parse(row.price);
      } catch (e) {
        console.error("Error parsing price data for transaction:", row.transactionId, e);
        priceData = null;
      }

      if (priceData && priceData.total && row.orderStatus !== 'CANCELLED') {
        const amount = parseFloat(priceData.total);
        if (!isNaN(amount)) {
          totalSpent += amount;
        }
      }
    });

    const summary = {
      totalTransactions,
      totalSpent,
      transactionsByStatus,
    };

    res.json(summary);
  });
}