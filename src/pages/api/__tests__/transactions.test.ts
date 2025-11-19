import { createMocks } from 'node-mocks-http';
import handler from '../transactions';

// Mock the database module
jest.mock('@/lib/db', () => ({
  all: jest.fn(),
}));

import db from '@/lib/db';

describe('/api/transactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 405 for non-GET requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Method not allowed' });
  });

  it('should return all transactions on successful GET request', async () => {
    const mockTransactions = [
      { id: 1, transactionId: 'txn_1', orderStatus: 'COMPLETED', price: '100' },
      { id: 2, transactionId: 'txn_2', orderStatus: 'PENDING', price: '200' },
    ];

    (db.all as jest.Mock).mockImplementation((query, params, callback) => {
      callback(null, mockTransactions);
    });

    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(mockTransactions);
  });

  it('should return 500 on database error', async () => {
    (db.all as jest.Mock).mockImplementation((query, params, callback) => {
      callback(new Error('Database connection failed'), null);
    });

    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Database error' });
  });

  it('should return empty array when no transactions exist', async () => {
    (db.all as jest.Mock).mockImplementation((query, params, callback) => {
      callback(null, []);
    });

    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual([]);
  });
});
