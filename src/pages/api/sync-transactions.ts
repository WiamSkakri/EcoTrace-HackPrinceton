import type { NextApiRequest, NextApiResponse } from 'next';
import { getBasicAuthHeader, KNOT_API_BASE } from '@/lib/knot';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { merchantAccountId, cursor } = req.body;

    const response = await fetch(`${KNOT_API_BASE}/transactions/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getBasicAuthHeader()
      },
      body: JSON.stringify({
        merchantAccountId,
        cursor
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from Knot Sync Transactions:", errorData);
      return res.status(response.status).json({ error: errorData });
    }

    const syncData = await response.json();
    res.json(syncData);
  } catch (err) {
    console.error("Error syncing transactions:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
}