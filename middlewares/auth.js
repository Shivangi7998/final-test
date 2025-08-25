import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

function getToken(req) {
    if (req.cookies?. token) return req.cookies.token;
    const auth =req.headers.authorization || '';
if (auth.startsWith('Bearer ')) return auth.split(' ')[1];
  return null;
}

export default function requireAuth(req, res, next) {
  const token = getToken(req);
  if (!token) return next(new AppError('Unauthorized', 401));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    next(new AppError('Invalid/expired token', 401));
  }
}





