import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  db.all(`SELECT * FROM transactions ORDER BY id DESC`, [], (err, rows) => {
    if (err) {
      console.error("Error retrieving transactions:", err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
}