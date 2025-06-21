// backend/src/controllers/clienteController.js
const Cliente = require('../models/Cliente'); // Importa o modelo de Cliente

// @desc    Criar um novo cliente
// @route   POST /api/clientes
// @access  Private (somente admin)
exports.criarCliente = async (req, res) => {
  const { cpf, nomeCompleto, telefone } = req.body;

  // Validação básica
  if (!cpf || !nomeCompleto || !telefone) {
    return res.status(400).json({ msg: 'Por favor, preencha todos os campos: CPF, Nome Completo e Telefone.' });
  }

  try {
    // Verifica se o CPF já existe
    let cliente = await Cliente.findOne({ cpf });
    if (cliente) {
      return res.status(400).json({ msg: 'CPF já cadastrado.' });
    }

    // Cria um novo cliente
    cliente = new Cliente({
      cpf,
      nomeCompleto,
      telefone
    });

    await cliente.save(); // Salva o cliente no banco de dados
    res.status(201).json({ msg: 'Cliente cadastrado com sucesso!', cliente });

  } catch (err) {
    console.error('Erro ao criar cliente:', err.message);
    res.status(500).send('Erro no servidor.');
  }
};

// @desc    Obter todos os clientes
// @route   GET /api/clientes
// @access  Private (somente admin)
exports.getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ dataCadastro: -1 }); // Busca todos, ordenados por mais recente
    res.json(clientes);
  } catch (err) {
    console.error('Erro ao obter clientes:', err.message);
    res.status(500).send('Erro no servidor.');
  }
};

// @desc    Obter cliente por ID
// @route   GET /api/clientes/:id
// @access  Private (somente admin)
exports.getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente não encontrado.' });
    }

    res.json(cliente);
  } catch (err) {
    console.error('Erro ao obter cliente por ID:', err.message);
    // Erro comum: ID inválido do MongoDB
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'ID de cliente inválido.' });
    }
    res.status(500).send('Erro no servidor.');
  }
};


// @desc    Atualizar cliente por ID
// @route   PUT /api/clientes/:id
// @access  Private (somente admin)
exports.atualizarCliente = async (req, res) => {
  const { cpf, nomeCompleto, telefone } = req.body;

  // Constrói o objeto de campos a serem atualizados
  const camposAtualizados = {};
  if (cpf) camposAtualizados.cpf = cpf;
  if (nomeCompleto) camposAtualizados.nomeCompleto = nomeCompleto;
  if (telefone) camposAtualizados.telefone = telefone;

  try {
    let cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente não encontrado.' });
    }

    // Verifica se o novo CPF já existe em outro cliente
    if (cpf && cpf !== cliente.cpf) {
        const clienteComCPFExistente = await Cliente.findOne({ cpf });
        if (clienteComCPFExistente && String(clienteComCPFExistente._id) !== String(cliente._id)) {
            return res.status(400).json({ msg: 'Novo CPF já cadastrado para outro cliente.' });
        }
    }


    // Atualiza o cliente
    cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      { $set: camposAtualizados },
      { new: true, runValidators: true } // Retorna o documento atualizado e roda validações
    );

    res.json({ msg: 'Cliente atualizado com sucesso!', cliente });

  } catch (err) {
    console.error('Erro ao atualizar cliente:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'ID de cliente inválido.' });
    }
    res.status(500).send('Erro no servidor.');
  }
};

// @desc    Deletar cliente por ID
// @route   DELETE /api/clientes/:id
// @access  Private (somente admin)
exports.deletarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);

    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente não encontrado.' });
    }

    // Opcional: Se desejar, também pode remover os rastreios associados a este cliente
    // await Rastreio.deleteMany({ cliente: req.params.id });
    // console.log(`Rastreios do cliente ${req.params.id} removidos.`);

    res.json({ msg: 'Cliente removido com sucesso!' });
  } catch (err) {
    console.error('Erro ao deletar cliente:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'ID de cliente inválido.' });
    }
    res.status(500).send('Erro no servidor.');
  }
};