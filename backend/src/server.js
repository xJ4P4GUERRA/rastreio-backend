// backend/src/server.js
require('dotenv').config(); // Carrega as variáveis de ambiente do .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importa o pacote cors

const clienteRoutes = require('./routes/clienteRoutes');
const rastreioRoutes = require('./routes/rastreioRoutes');
const authRoutes = require('./routes/authRoutes'); // Importa as rotas de autenticação

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Configuração do CORS
app.use(cors({
  origin: 'http://localhost:3000', // Permite requisições APENAS do seu frontend rodando em 3000
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Headers permitidos
}));

// Conexão com o MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado com sucesso!');
    // Inicia o servidor Express APENAS APÓS a conexão com o DB
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err.message);
    process.exit(1); // Encerra a aplicação se a conexão falhar
  });

// Rota de teste simples
app.get('/', (req, res) => {
  res.send('API de Rastreamento funcionando!');
});

// Adiciona as rotas da API
app.use('/api/clientes', clienteRoutes);
app.use('/api/rastreios', rastreioRoutes);
app.use('/api/auth', authRoutes); // Adiciona as rotas de autenticação