const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  console.log('=== Admin Auth Middleware ===');
  console.log('Request headers:', req.headers);
  console.log('Authorization header:', req.headers.authorization);
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('❌ No valid admin auth header found');
    console.log('Expected format: Bearer <token>');
    return res.status(401).json({ 
      message: "Access denied. No admin token provided.",
      debug: {
        authHeader: authHeader,
        expected: "Bearer <token>"
      }
    });
  }

  const token = authHeader.split(" ")[1];
  console.log('🔑 Extracted admin token:', token.substring(0, 20) + '...');

  try {
   
    const jwtKey = process.env.JWT_KEY || 'your-secret-key';
    console.log('🔐 Using JWT key:', jwtKey ? 'Key available' : 'No key found');
    
    const decoded = jwt.verify(token, jwtKey);
    console.log('✅ Decoded admin token:', decoded);
    
  
    if (decoded.role !== 'admin') {
      console.log('❌ User does not have admin role:', decoded.role);
      return res.status(403).json({ 
        message: "Access denied. Admin privileges required.",
        debug: {
          userRole: decoded.role,
          required: "admin"
        }
      });
    }
    
    req.admin = decoded; 
    console.log('✅ Admin authentication successful');
    next();
  } catch (err) {
    console.log('❌ Admin token verification failed:', err.message);
    console.log('Error details:', err);
    
    let message = "Invalid admin token.";
    if (err.name === 'TokenExpiredError') {
      message = "Admin token has expired. Please login again.";
    } else if (err.name === 'JsonWebTokenError') {
      message = "Invalid admin token format.";
    }
    
    return res.status(401).json({ 
      message,
      debug: {
        error: err.message,
        errorType: err.name
      }
    });
  }
};

module.exports = adminAuth;