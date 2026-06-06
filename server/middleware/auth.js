import { OAuth2Client } from 'google-auth-library';
import 'dotenv/config';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '822496388971-5qb0hau7l7dldibdb5ghtaj5k4hu64j6.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    req.user = { userId: payload.sub, email: payload.email, name: payload.name };
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
}
