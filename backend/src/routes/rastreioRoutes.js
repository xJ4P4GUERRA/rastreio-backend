// backend/src/routes/rastreioRoutes.js
const express = require('express');
const router = express.Router();
const rastreioController = require('../controllers/rastreioController');
const { protect } = require('../middleware/authMiddleware');

// Rotas para Rastreios
router.post('/', protect, rastreioController.criarRastreio); // <--- Adicione 'protect'
router.get('/', protect, rastreioController.getTodosRastreios); // <--- Adicione 'protect'
router.get('/:codigo', rastreioController.getRastreioByCodigo); // Esta rota permanece PÚBLICA
router.put('/:id/status', protect, rastreioController.atualizarStatusRastreio); // <--- Adicione 'protect'
router.delete('/:id', protect, rastreioController.deletarRastreio); // <--- Adicione 'protect'
router.post('/', rastreioController.criarRastreio); // Rota para criar um novo rastreio (admin)
router.get('/', rastreioController.getTodosRastreios); // Rota para obter todos os rastreios (admin)
router.get('/:codigo', rastreioController.getRastreioByCodigo); // Rota pública para buscar um rastreio por código
router.put('/:id/status', rastreioController.atualizarStatusRastreio); // Rota para atualizar status de um rastreio (admin)
router.delete('/:id', rastreioController.deletarRastreio); // Rota para deletar um rastreio (admin)

module.exports = router;