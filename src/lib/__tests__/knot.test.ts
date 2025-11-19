import { getBasicAuthHeader, KNOT_API_BASE, KNOT_CLIENT_ID, KNOT_CLIENT_SECRET } from '../knot';

describe('Knot API Utilities', () => {
  describe('getBasicAuthHeader', () => {
    it('should generate correct Basic Auth header', () => {
      const expectedAuth = 'Basic ' + Buffer.from(`${KNOT_CLIENT_ID}:${KNOT_CLIENT_SECRET}`).toString('base64');
      expect(getBasicAuthHeader()).toBe(expectedAuth);
    });

    it('should generate valid base64 encoded credentials', () => {
      const header = getBasicAuthHeader();
      expect(header).toMatch(/^Basic [A-Za-z0-9+/=]+$/);
    });

    it('should use environment variables for credentials', () => {
      // Credentials are set in jest.setup.js
      expect(KNOT_CLIENT_ID).toBe('test-client-id');
      expect(KNOT_CLIENT_SECRET).toBe('test-client-secret');
    });
  });

  describe('KNOT_API_BASE', () => {
    it('should have correct API base URL', () => {
      expect(KNOT_API_BASE).toBe('https://development.knotapi.com');
    });
  });
});
