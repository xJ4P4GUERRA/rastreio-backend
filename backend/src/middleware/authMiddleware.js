// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded.user; // Anexa o payload (id e role) ao request
      next();
    } catch (error) {
      return res.status(401).json({ msg: 'Não autorizado, token inválido.' });
    }
  }
  if (!token) {
    return res.status(401).json({ msg: 'Não autorizado, nenhum token fornecido.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ msg: `Acesso negado. Requer o cargo de: ${roles.join(' ou ')}` });
    }
    next();
  };
};

module.exports = { protect, authorize };