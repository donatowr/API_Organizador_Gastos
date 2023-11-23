const express = require("express");

//instância de rotas
const rotas = express();


//intermediarios
const { verificarLogin } = require("./intermediadores/login");
const { loginUsuario } = require("./controladores/login");
const {verificaCadastrar, validaDetalhar, validaToken} = require("./intermediadores/usuarios");
const { validaCategoria } = require("./intermediadores/categorias");
const { validaListar, validaCadastrar, validaExcluir} = require("./intermediadores/transacoes");

//controladores
const {detalharUsuario, cadastrarUsuario, atualizarUsuario} = require("./controladores/Usuarios");
const { listarCategorias } = require("./controladores/categorias");
const {listarTransacoes, cadastrarTransacao, excluirTransacao, atualizarTransacao} = require("./controladores/transacoes");
const { extrato } = require("./controladores/extrato");
const { validaExtrato } = require("./intermediadores/extrato");

//login
rotas.post("/login", verificarLogin, loginUsuario);

//usuarios
rotas.post("/usuario", verificaCadastrar, cadastrarUsuario);
rotas.get("/usuario", validaDetalhar, detalharUsuario);
rotas.put("/usuario/", validaToken, atualizarUsuario);

//categorias
rotas.get("/categoria", validaCategoria, listarCategorias);

//extrato
rotas.get("/transacao/extrato", validaExtrato, extrato);

//transações
rotas.get("/transacao", validaListar, listarTransacoes);
rotas.get("/transacao/:id");
rotas.get("/transacao/extrato");
rotas.post("/transacao", validaCadastrar, cadastrarTransacao);
rotas.put("/transacao/:id", validaToken, atualizarTransacao);
rotas.delete("/transacao/:id", validaExcluir, excluirTransacao);

module.exports = rotas;
