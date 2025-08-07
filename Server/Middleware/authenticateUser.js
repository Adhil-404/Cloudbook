const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  console.log('Auth headers:', req.headers.authorization);
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('No valid auth header found');
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  console.log('Extracted token:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log('Decoded token:', decoded);
    req.user = decoded; 
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = authenticateUser;