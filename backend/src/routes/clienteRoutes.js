// backend/src/routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { protect } = require('../middleware/authMiddleware');

// Rotas para Clientes
router.post('/', protect, clienteController.criarCliente); // <--- Adicione 'protect'
router.get('/', protect, clienteController.getClientes);   // <--- Adicione 'protect'
router.get('/:id', protect, clienteController.getClienteById); // <--- Adicione 'protect'
router.put('/:id', protect, clienteController.atualizarCliente); // <--- Adicione 'protect'
router.delete('/:id', protect, clienteController.deletarCliente); // <--- Adicione 'protect'
router.post('/', clienteController.criarCliente); // Rota para criar um novo cliente
router.get('/', clienteController.getClientes); // Rota para obter todos os clientes
router.get('/:id', clienteController.getClienteById); // Rota para obter um cliente por ID
router.put('/:id', clienteController.atualizarCliente); // Rota para atualizar um cliente por ID
router.delete('/:id', clienteController.deletarCliente); // Rota para deletar um cliente por ID

module.exports = router;