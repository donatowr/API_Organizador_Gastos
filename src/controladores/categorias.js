
const pool = require("../../Config/conexao");
const senhaJWT = require('../../Config/senhaJWT');
const jwt = require("jsonwebtoken");


const listarCategorias = async (req, res) => {
  const { authorization } = req.headers

  const token = authorization.split(' ')[1]

  try {

    const tokenUsuario = jwt.verify(token, senhaJWT);

    const categoria = await pool.query("select * from categorias");
    return res.status(200).json(categoria.rows);

  } catch (error) {
    if (jwt.TokenExpiredError) {
      return res.status(401).json({ mensagem: "Token Expirado, Refaça o Login" });
    }
    return res.status(500).json({ mensagem: "Erro Interno do Servidor" });
  }

};

module.exports = { listarCategorias };
