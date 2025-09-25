const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  console.log('=== Admin Auth Middleware ===');
  console.log('Request URL:', req.originalUrl);
  console.log('Request Method:', req.method);
  console.log('Authorization header:', req.headers.authorization);
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('❌ No valid admin auth header found');
    return res.status(401).json({ 
      message: "Access denied. No admin token provided.",
      required: "Bearer <token>"
    });
  }

  const token = authHeader.split(" ")[1];
  console.log('🔑 Extracted admin token:', token.substring(0, 20) + '...');

  try {
    // Use JWT_KEY (same as regular users) - this should match what you use in your login
    const jwtKey = process.env.JWT_KEY || 'your-secret-key';
    console.log('🔐 Using JWT key for verification');
    
    const decoded = jwt.verify(token, jwtKey);
    console.log('✅ Decoded admin token:', decoded);
    
    // Check if user has admin role
    if (decoded.role !== 'admin' && !decoded.isAdmin) {
      console.log('❌ User does not have admin privileges:', {
        role: decoded.role,
        isAdmin: decoded.isAdmin
      });
      return res.status(403).json({ 
        message: "Access denied. Admin privileges required."
      });
    }
    
    req.admin = decoded; 
    console.log('✅ Admin authentication successful for:', decoded.email);
    next();
  } catch (err) {
    console.log('❌ Admin token verification failed:', err.message);
    console.log('Error type:', err.name);
    
    let message = "Invalid admin token.";
    if (err.name === 'TokenExpiredError') {
      message = "Admin token has expired. Please login again.";
    } else if (err.name === 'JsonWebTokenError') {
      message = "Invalid admin token format.";
    } else if (err.name === 'NotBeforeError') {
      message = "Admin token not active yet.";
    }
    
    return res.status(401).json({ 
      message,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = adminAuth;