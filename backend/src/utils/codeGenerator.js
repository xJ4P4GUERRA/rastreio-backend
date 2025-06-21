// backend/src/utils/codeGenerator.js
const Rastreio = require('../models/Rastreio'); // Precisamos do modelo de Rastreio para verificar a unicidade

const generateUniqueCode = async () => {
  let code;
  let isUnique = false;

  // Loop para gerar códigos até encontrar um que não exista no banco de dados
  while (!isUnique) {
    // Gera um código alfanumérico de 13 caracteres (ex: AB123456789BR)
    // Pode ajustar o formato se preferir, ex: 3 letras, 9 números, 2 letras.
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 13; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    code = result;

    // Verifica se o código já existe no banco de dados
    const existingRastreio = await Rastreio.findOne({ codigoRastreio: code });
    if (!existingRastreio) {
      isUnique = true; // Se não encontrou, o código é único
    }
  }
  return code;
};

module.exports = generateUniqueCode;