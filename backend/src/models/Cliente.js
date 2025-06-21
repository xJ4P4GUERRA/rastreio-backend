// backend/src/models/Cliente.js
const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  cpf: {
    type: String,
    required: true,
    unique: true, // Garante que não haverá CPFs duplicados
    trim: true,
    match: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/ // Formato esperado: 123.456.789-00
  },
  nomeCompleto: {
    type: String,
    required: true,
    trim: true
  },
  telefone: {
    type: String,
    required: true,
    trim: true,
    match: /^\(\d{2}\)\s\d{4,5}-\d{4}$/ // Ex: (61) 98765-4321 ou (61) 8765-4321
  },
  dataCadastro: {
    type: Date,
    default: Date.now // Define a data atual automaticamente
  }
}, { timestamps: true }); // Adiciona createdAt e updatedAt automaticamente

module.exports = mongoose.model('Cliente', ClienteSchema);