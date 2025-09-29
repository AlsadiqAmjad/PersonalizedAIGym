const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateTokens = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'gym-ai-api',
    audience: 'gym-ai-client'
  });

  const refreshToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d',
    issuer: 'gym-ai-api',
    audience: 'gym-ai-client'
  });

  return {
    accessToken,
    refreshToken
  };
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'gym-ai-api',
      audience: 'gym-ai-client'
    });
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  generateTokens,
  verifyToken
};
