import jwt from 'jsonwebtoken';

const extractToken = (authHeader = '') => {
  if (!authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7).trim();
};

export const requireAuth = (req, res, next) => {
  const token = extractToken(req.headers.authorization || '');
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: admin access required' });
  }
  return next();
};
