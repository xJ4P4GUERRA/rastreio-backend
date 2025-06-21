// backend/src/controllers/rastreioController.js
const Rastreio = require('../models/Rastreio');
const Cliente = require('../models/Cliente'); // Precisamos do modelo de Cliente para associar
const generateUniqueCode = require('../utils/codeGenerator'); // Vamos criar este utilitário

// @desc    Criar um novo rastreio (admin)
// @route   POST /api/rastreios
// @access  Private (somente admin)
exports.criarRastreio = async (req, res) => {
  const { clienteCpf, previsaoEntrega, statusInicial, localInicial, descricaoInicial } = req.body;

  if (!clienteCpf) {
    return res.status(400).json({ msg: 'É necessário informar o CPF do cliente para criar um rastreio.' });
  }

  try {
    // 1. Encontrar o cliente pelo CPF
    const cliente = await Cliente.findOne({ cpf: clienteCpf });
    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente não encontrado com o CPF fornecido.' });
    }

    // 2. Gerar código de rastreamento único
    const codigoRastreio = await generateUniqueCode(); // Função que ainda vamos criar

    // 3. Montar o histórico inicial
    const historico = [{
      status: statusInicial || "Pedido Recebido/Confirmado",
      local: localInicial || "Origem",
      descricao: descricaoInicial || "Pedido cadastrado no sistema."
    }];

    // 4. Criar o novo rastreio
    const rastreio = new Rastreio({
      codigoRastreio,
      cliente: cliente._id, // Usamos o _id do cliente
      statusAtual: historico[0].status,
      historico,
      previsaoEntrega: previsaoEntrega ? new Date(previsaoEntrega) : undefined
    });

    await rastreio.save();
    res.status(201).json({ msg: 'Rastreio criado com sucesso!', rastreio });

  } catch (err) {
    console.error('Erro ao criar rastreio:', err.message);
    res.status(500).send('Erro no servidor.');
  }
};

// @desc    Obter um rastreio pelo código (público)
// @route   GET /api/rastreios/:codigo
// @access  Public (qualquer um pode acessar)
exports.getRastreioByCodigo = async (req, res) => {
  try {
    const rastreio = await Rastreio.findOne({ codigoRastreio: req.params.codigo }).populate('cliente', 'nomeCompleto cpf telefone'); // Popula dados do cliente

    if (!rastreio) {
      return res.status(404).json({ msg: 'Código de rastreamento não encontrado.' });
    }

    res.json(rastreio);
  } catch (err) {
    console.error('Erro ao obter rastreio:', err.message);
    res.status(500).send('Erro no servidor.');
  }
};

// @desc    Obter todos os rastreios (admin)
// @route   GET /api/rastreios
// @access  Private (somente admin)
exports.getTodosRastreios = async (req, res) => {
  try {
    const rastreios = await Rastreio.find()
      .populate('cliente', 'nomeCompleto cpf telefone') // Popula dados do cliente
      .sort({ createdAt: -1 }); // Ordena do mais recente para o mais antigo

    res.json(rastreios);
  } catch (err) {
    console.error('Erro ao obter todos os rastreios:', err.message);
    res.status(500).send('Erro no servidor.');
  }
};

// @desc    Atualizar status de um rastreio (admin)
// @route   PUT /api/rastreios/:id/status
// @access  Private (somente admin)
exports.atualizarStatusRastreio = async (req, res) => {
  const { status, local, descricao } = req.body;

  // Validação básica
  if (!status) {
    return res.status(400).json({ msg: 'O novo status é obrigatório.' });
  }

  try {
    const rastreio = await Rastreio.findById(req.params.id);

    if (!rastreio) {
      return res.status(404).json({ msg: 'Rastreio não encontrado.' });
    }

    // Adiciona o novo status ao histórico
    rastreio.historico.push({
      status,
      local,
      descricao
    });

    // Atualiza o status atual
    rastreio.statusAtual = status;

    await rastreio.save();
    res.json({ msg: 'Status do rastreio atualizado com sucesso!', rastreio });

  } catch (err) {
    console.error('Erro ao atualizar status do rastreio:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'ID de rastreio inválido.' });
    }
    res.status(500).send('Erro no servidor.');
  }
};

// @desc    Deletar um rastreio (admin)
// @route   DELETE /api/rastreios/:id
// @access  Private (somente admin)
exports.deletarRastreio = async (req, res) => {
  try {
    const rastreio = await Rastreio.findByIdAndDelete(req.params.id);

    if (!rastreio) {
      return res.status(404).json({ msg: 'Rastreio não encontrado.' });
    }

    res.json({ msg: 'Rastreio removido com sucesso!' });
  } catch (err) {
    console.error('Erro ao deletar rastreio:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'ID de rastreio inválido.' });
    }
    res.status(500).send('Erro no servidor.');
  }
};