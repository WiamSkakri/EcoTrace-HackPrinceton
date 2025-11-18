export const KNOT_CLIENT_ID = process.env.KNOT_CLIENT_ID || '';
export const KNOT_CLIENT_SECRET = process.env.KNOT_CLIENT_SECRET || '';

export const getBasicAuthHeader = () => {
  return 'Basic ' + Buffer.from(`${KNOT_CLIENT_ID}:${KNOT_CLIENT_SECRET}`).toString('base64');
};

export const KNOT_API_BASE = 'https://development.knotapi.com';