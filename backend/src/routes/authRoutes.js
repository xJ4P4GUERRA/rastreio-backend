// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Rota de Login (Pública)
router.post('/login', loginUser);

// Rota de Registro (Protegida - Apenas para Super Admins)
router.post('/register', registerUser); // Rota pública, sem proteção

module.exports = router;