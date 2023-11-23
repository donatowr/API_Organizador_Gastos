const pool = require("../../Config/conexao");
const senhaJWT = require("../../Config/senhaJWT");
const jwt = require("jsonwebtoken");

const listarTransacoes = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    });
  }

  const token = authorization.split(" ")[1];

  try {
    var tokenUsuario = jwt.verify(token, senhaJWT);

  

    const transacoes = await pool.query( `select transacoes.*, categorias.descricao as "categoria_nome" from transacoes join categorias on transacoes.categoria_id = categorias.id where transacoes.usuario_id = $1`
    ,
    [tokenUsuario.id]
  );

    return res.status(200).json([transacoes.rows]);

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro Interno do Servidor" });
  }
};

const cadastrarTransacao = async (req, res) => {
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const { authorization } = req.headers;

  const token = authorization.split(" ")[1];

  try {
    const tokenUsuario = jwt.verify(token, senhaJWT);

    const { rowCount } = await pool.query(
      "select id from categorias where id = $1",
      [categoria_id]
    );

    if (rowCount === 0) {
      return res.status(404).json({
        mensagem:
          "Categoria inválida. Por favor, escolha uma categoria válida.",
      });
    }    

    const { rows } = await pool.query(
  
      `with categoria_info as (
        select descricao as "categoria_nome" from categorias where id = $1
      )
      
      insert into transacoes (descricao, valor, data, usuario_id, categoria_id, tipo)
      select $2, $3, $4, $5, $6, $7
      from categoria_info
      returning *, (select categoria_nome from categoria_info) as "categoria_nome"`
      ,
      [categoria_id, descricao, valor, data, tokenUsuario.id, categoria_id, tipo]
    );

    
    return res.status(201).json(rows[0]);
  } catch (error) {
   
    return res.status(500).json({ mensagem: "Erro Interno do Servidor" });
  }
};

const excluirTransacao = async (req, res) => {
  const { authorization } = req.headers;
  const { id } = req.params;

  const token = authorization.split(" ")[1];

  try {
    const tokenUsuario = jwt.verify(token, senhaJWT);

    const { rowCount } = await pool.query(
      "select * from transacoes where id = $1 and usuario_id = $2",
      [id, tokenUsuario.id]
    );

    if (rowCount < 1) {
      return res.status(404).json({ mensagem: "Transação não encontrada." });
    }

    await pool.query(
      "delete from transacoes where id = $1 and usuario_id = $2",
      [id, tokenUsuario.id]
    );

    return res.status(204).json();
  } catch (error) {
    return res.status(500).json("Erro interno do servidor");
  }
};

const atualizarTransacao = async (req, res) => {
  const { id } = req.params;
  const { descricao, valor, data, categoria_id, tipo } = req.body;

  try {
    const usuarioId = req.id;

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
      return res.status(404).json({
        mensagem: "Todos os campos obrigatórios devem ser informados.",
      });
    }
    if (tipo !== "entrada" && tipo !== "saida") {
      return res
        .status(404)
        .json({ mensagem: "O campo tipo é somente de entrada ou saída!" });
    }

    const { rowCount } = await pool.query(
      "select * from categorias where id = $1",
      [categoria_id]
    );
    if (rowCount < 1) {
      return res.status(404).json({ mensagem: "Categoria não encontrada!" });
    }

    const transacaoExist = await pool.query(
      "select * from transacoes where id = $1 and usuario_id = $2",
      [id, usuarioId]
    );

    if (transacaoExist.rows.length < 1) {
      return res.status(400).json({ mensagem: "Transação não encontrada!" });
    }

    await pool.query(
      "update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6 and usuario_id = $7",
      [descricao, valor, data, categoria_id, tipo, id, usuarioId]
    );

    return res.status(204).send();
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Erro interno do servidor");
  }
};



module.exports = {
  listarTransacoes,
  cadastrarTransacao,
  excluirTransacao,
  atualizarTransacao,
};
