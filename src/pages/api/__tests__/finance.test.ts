import { createMocks } from 'node-mocks-http';
import handler from '../finance';

jest.mock('@/lib/db', () => ({
  all: jest.fn(),
}));

import db from '@/lib/db';

describe('/api/finance', () => {
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

  it('should calculate finance summary correctly', async () => {
    const mockTransactions = [
      {
        id: 1,
        transactionId: 'txn_1',
        orderStatus: 'COMPLETED',
        price: '{"total": "100.50"}',
      },
      {
        id: 2,
        transactionId: 'txn_2',
        orderStatus: 'COMPLETED',
        price: '{"total": "200.25"}',
      },
      {
        id: 3,
        transactionId: 'txn_3',
        orderStatus: 'PENDING',
        price: '{"total": "50.00"}',
      },
    ];

    (db.all as jest.Mock).mockImplementation((query, params, callback) => {
      callback(null, mockTransactions);
    });

    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.totalTransactions).toBe(3);
    expect(data.totalSpent).toBe(350.75); // 100.50 + 200.25 + 50.00
    expect(data.transactionsByStatus).toEqual({
      COMPLETED: 2,
      PENDING: 1,
    });
  });

  it('should exclude cancelled transactions from total spent', async () => {
    const mockTransactions = [
      {
        id: 1,
        transactionId: 'txn_1',
        orderStatus: 'COMPLETED',
        price: '{"total": "100.00"}',
      },
      {
        id: 2,
        transactionId: 'txn_2',
        orderStatus: 'CANCELLED',
        price: '{"total": "500.00"}',
      },
    ];

    (db.all as jest.Mock).mockImplementation((query, params, callback) => {
      callback(null, mockTransactions);
    });

    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    const data = JSON.parse(res._getData());
    expect(data.totalSpent).toBe(100.00); // Should not include cancelled
    expect(data.transactionsByStatus.CANCELLED).toBe(1);
  });

  it('should handle invalid price JSON gracefully', async () => {
    const mockTransactions = [
      {
        id: 1,
        transactionId: 'txn_1',
        orderStatus: 'COMPLETED',
        price: 'invalid-json',
      },
      {
        id: 2,
        transactionId: 'txn_2',
        orderStatus: 'COMPLETED',
        price: '{"total": "100.00"}',
      },
    ];

    (db.all as jest.Mock).mockImplementation((query, params, callback) => {
      callback(null, mockTransactions);
    });

    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    const data = JSON.parse(res._getData());
    expect(data.totalSpent).toBe(100.00); // Should only count valid transaction
    expect(data.totalTransactions).toBe(2);
  });

  it('should handle missing total in price data', async () => {
    const mockTransactions = [
      {
        id: 1,
        transactionId: 'txn_1',
        orderStatus: 'COMPLETED',
        price: '{"subtotal": "100.00"}', // No total field
      },
    ];

    (db.all as jest.Mock).mockImplementation((query, params, callback) => {
      callback(null, mockTransactions);
    });

    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    const data = JSON.parse(res._getData());
    expect(data.totalSpent).toBe(0); // Should be 0 if no total
  });

  it('should return 500 on database error', async () => {
    (db.all as jest.Mock).mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({ error: 'Database error' });
  });

  it('should handle empty transactions array', async () => {
    (db.all as jest.Mock).mockImplementation((query, params, callback) => {
      callback(null, []);
    });

    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    const data = JSON.parse(res._getData());
    expect(data).toEqual({
      totalTransactions: 0,
      totalSpent: 0,
      transactionsByStatus: {},
    });
  });
});
