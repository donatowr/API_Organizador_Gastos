const pool = require("../../Config/conexao");
const bcrypt = require("bcrypt");
const senhaJWT = require("../../Config/senhaJWT");
const jwt = require("jsonwebtoken");

const detalharUsuario = async (req, res) => {
  const { authorization } = req.headers;

  const token = authorization.split(" ")[1];

  try {
    const usuario = jwt.verify(token, senhaJWT);

    const usuarios = await pool.query(
      "select id, nome, email from usuarios where id = $1",
      [usuario.id]
    );

    return res.status(200).json(usuarios.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro Interno do Servidor" });
  }
};

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const senhaCrypto = await bcrypt.hash(senha, 10);

    const novoUsuario = await pool.query(
      "insert into usuarios (nome, email, senha) values($1, $2, $3) returning id, nome, email",
      [nome, email, senhaCrypto]
    );

    return res.status(201).json(novoUsuario.rows[0]);
  } catch (error) {
   
    return res.status(500).json({ mensagem: "Erro Interno do Servidor" });
  }
};

const atualizarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const usuarioId = req.id;

    if (!nome || !email || !senha) {
      return res.status(404).json({
        mensagem: "Todos os campos obrigatórios devem ser informados.",
      });
    }

    const emailExiste = await pool.query(
      "select * from usuarios where email = $1 and id <> $2",
      [email, usuarioId]
    );

    if (emailExiste.rows.length > 0) {
      return res
        .status(400)
        .json({ mensagem: "E-mail já em uso por outro usuário." });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);

    await pool.query(
      "update usuarios set nome = $1, email = $2, senha = $3 where id = $4",
      [nome, email, hashedSenha, usuarioId]
    );

    return res.status(204).send();
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Erro interno do servidor");
  }
};

module.exports = {
  detalharUsuario,
  cadastrarUsuario,
  atualizarUsuario,
};
