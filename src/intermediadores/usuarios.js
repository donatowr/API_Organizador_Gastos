const pool = require("../../Config/conexao");
const jwt = require("jsonwebtoken");
const senhaJWT = require("../../Config/senhaJWT");
const FuncaoToken = require("./FuncaoToken");

const verificaCadastrar = async (req, res, next) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(404)
      .json({ mensagem: "Todos os campos obrigatórios devem ser informados." });
  }

  try {
    const { rowCount } = await pool.query(
      "select * from usuarios where email = $1",
      [email]
    );

    if (rowCount > 0) {
      return res
        .status(404)
        .json({
          mensagem: "Já existe usuário cadastrado com o e-mail informado.",
        });
    }

    next();
  } catch (error) {
   
    return res.status(500).json({ mensagem: "Erro Interno do Servidor" });
  }
};

const validaDetalhar = (req, res, next) => {
  const { authorization } = req.headers;

  FuncaoToken(authorization, res, next);

  next();
};

const validaToken = (req, res, next) => {
  const { authorization } = req.headers;

  const token = authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensagem: "Token de autenticação ausente" });
  }

  try {
    const decoded = jwt.verify(token, senhaJWT);

    req.id = decoded.id;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ mensagem: "Token de autenticação inválido" });
  }
};

module.exports = { verificaCadastrar, validaDetalhar, validaToken };
