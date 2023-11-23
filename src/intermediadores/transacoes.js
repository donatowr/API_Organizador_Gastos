const jwt = require('jsonwebtoken');
const senhaJWT = require('../../Config/senhaJWT')
const validaToken = require('./FuncaoToken');
const FuncaoToken = require('./FuncaoToken');


const validaCadastrar = (req, res, next) => {
  const { authorization } = req.headers;
  FuncaoToken(authorization, res, next);

  const { tipo, descricao, valor, data, categoria_id } = req.body;


  if (!tipo || !descricao || !valor || !data || !categoria_id) {
    return res.status(404).json({ mensagem: "Todos os campos obrigatórios devem ser informados." });
  }
  if (tipo !== 'entrada' && tipo !== 'saida') {
    return res.status(404).json({ mensagem: "O campo tipo é somente de entrada ou saída!" });
  }
  next()

}

const validaListar = (req, res, next) => {
  const { authorization } = req.headers
  FuncaoToken(authorization, res)

  next()
}

const validaExcluir = (req, res, next) => {
  const { authorization } = req.headers

  FuncaoToken(authorization, res)

  next()
}

module.exports = { validaListar, validaCadastrar, validaExcluir }