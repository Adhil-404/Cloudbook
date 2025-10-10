const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  console.log('=== User Auth Middleware ===');
  console.log('Request URL:', req.originalUrl);
  console.log('Authorization header:', req.headers.authorization);
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('❌ No valid auth header found');
    return res.status(401).json({ 
      message: "Access denied. No token provided."
    });
  }

  const token = authHeader.split(" ")[1];
  console.log('🔑 Extracted token:', token.substring(0, 20) + '...');

  try {
    // Use JWT_KEY or JWT_SECRET (same as login)
    const jwtKey = process.env.JWT_KEY || process.env.JWT_SECRET || 'your-secret-key';
    
    const decoded = jwt.verify(token, jwtKey);
    console.log('✅ Decoded token:', decoded);
    
    // Attach user info to request
    req.user = {
      _id: decoded._id || decoded.userId || decoded.id,
      email: decoded.userEmail || decoded.email,
      userEmail: decoded.userEmail || decoded.email,
      name: decoded.userName || decoded.name,
      userName: decoded.userName || decoded.name,
      role: decoded.role || 'user'
    };
    
    console.log('✅ User authenticated:', {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name
    });
    
    next();
  } catch (err) {
    console.log('❌ Token verification failed:', err.message);
    
    let message = "Invalid token.";
    if (err.name === 'TokenExpiredError') {
      message = "Token has expired. Please login again.";
    } else if (err.name === 'JsonWebTokenError') {
      message = "Invalid token format.";
    }
    
    return res.status(401).json({ message });
  }
};

module.exports = authenticateUser;