import type { NextApiRequest, NextApiResponse } from 'next';
import { getBasicAuthHeader, KNOT_API_BASE } from '@/lib/knot';
import db from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { event, merchant, external_user_id } = req.body;
    const merchantAccountId = merchant?.id;

    if (event === "NEW_TRANSACTIONS_AVAILABLE") {
      console.log("Received NEW_TRANSACTIONS_AVAILABLE webhook for merchant:", merchantAccountId);

      let cursor = null;
      let allTransactions: any[] = [];

      do {
        const response = await fetch(`${KNOT_API_BASE}/transactions/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': getBasicAuthHeader()
          },
          body: JSON.stringify({
            external_user_id,
            merchant_id: merchantAccountId,
            cursor
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error from Knot Sync Transactions:", errorData);
          return res.status(response.status).json({ error: errorData });
        }

        const syncData = await response.json();
        const transactions = syncData.transactions || [];
        cursor = syncData.next_cursor || null;
        allTransactions = allTransactions.concat(transactions);
      } while (cursor);

      // Insert each transaction into the database
      for (const txn of allTransactions) {
        db.run(
          `INSERT INTO transactions (
            transactionId, externalId, datetime, url, orderStatus, paymentMethods, price, products, merchantId, merchantName, rawData
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            txn.id,
            txn.external_id || null,
            txn.datetime || null,
            txn.url || null,
            txn.order_status || null,
            JSON.stringify(txn.payment_methods || []),
            JSON.stringify(txn.price || {}),
            JSON.stringify(txn.products || []),
            txn.merchant?.id || null,
            txn.merchant?.name || null,
            JSON.stringify(txn)
          ],
          (err) => {
            if (err) console.error("Error inserting transaction:", err);
          }
        );
      }

      console.log(`Synced ${allTransactions.length} transactions for merchant ${merchantAccountId}`);
      return res.json({ message: "Transactions synced", count: allTransactions.length });
    } else {
      console.log("Received webhook event:", req.body);
      return res.json({ message: "Webhook received" });
    }
  } catch (err) {
    console.error("Error processing webhook:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
}