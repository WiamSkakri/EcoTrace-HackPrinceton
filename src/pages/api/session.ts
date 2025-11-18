import type { NextApiRequest, NextApiResponse } from 'next';
import { getBasicAuthHeader, KNOT_API_BASE } from '@/lib/knot';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(`${KNOT_API_BASE}/session/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getBasicAuthHeader()
      },
      body: JSON.stringify({
        external_user_id: "test",
        type: 'transaction_link'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from Knot Create Session:", errorData);
      return res.status(response.status).json({ error: errorData });
    }

    const sessionData = await response.json();
    res.json(sessionData);
  } catch (err) {
    console.error("Error creating session:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
}