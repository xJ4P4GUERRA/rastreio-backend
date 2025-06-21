// backend/src/models/Rastreio.js
const mongoose = require('mongoose');

const HistoricoItemSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: [ // Os status que definimos antes
      "Pedido Recebido/Confirmado",
      "Pedido Separado",
      "Pedido Coletado",
      "Em Rota de Transferência",
      "Chegou ao Centro de Distribuição",
      "Saiu para Entrega",
      "Pedido Entregue",
      "Entrega Não Realizada",
      "Pedido Retido",
      "Aguardando Retirada",
      "Devolvido ao Remetente"
    ]
  },
  dataHora: {
    type: Date,
    default: Date.now
  },
  local: {
    type: String,
    trim: true
  },
  descricao: {
    type: String,
    trim: true
  }
});

const RastreioSchema = new mongoose.Schema({
  codigoRastreio: {
    type: String,
    required: true,
    unique: true, // O código de rastreamento deve ser único
    trim: true
  },
  cliente: { // Referência ao cliente que este rastreio pertence
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente', // Nome do modelo referenciado
    required: true
  },
  statusAtual: {
    type: String,
    required: true,
    default: "Pedido Recebido/Confirmado" // Status inicial
  },
  historico: [HistoricoItemSchema], // Array de itens do histórico de rastreamento
  previsaoEntrega: {
    type: Date,
    required: false // Pode ser opcional no início
  }
}, { timestamps: true }); // Adiciona createdAt e updatedAt automaticamente

module.exports = mongoose.model('Rastreio', RastreioSchema);