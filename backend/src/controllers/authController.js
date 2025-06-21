// backend/src/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Função de gerar token agora inclui o ROLE
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Lógica de Registro
exports.registerUser = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: 'Username já existe.' });

    user = new User({ username, password, role: role || 'admin' });
    await user.save();

    res.status(201).json({
      msg: 'Administrador registrado com sucesso!',
      user: { id: user._id, username: user.username, role: user.role },
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).send('Erro no servidor.');
  }
};

// Lógica de Login
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Credenciais inválidas.' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Credenciais inválidas.' });

    res.json({
      msg: 'Login realizado com sucesso!',
      user: { id: user._id, username: user.username, role: user.role },
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).send('Erro no servidor.');
  }
};