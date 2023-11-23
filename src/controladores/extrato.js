const pool = require("../../Config/conexao");
const senhaJWT = require("../../Config/senhaJWT");
const jwt = require('jsonwebtoken');



const extrato = async (req, res) => {
    const { authorization } = req.headers

    const token = authorization.split(' ')[1]

    try {

        const tokenUsuario = jwt.verify(token, senhaJWT);

        const { rows: saidas } = await pool.query(`select sum(valor) as "saidas" from transacoes where usuario_id = $1 and tipo = 'saida' `, [tokenUsuario.id]);

        const { rows: entradas } = await pool.query(`select sum(valor) as "entradas" from transacoes where usuario_id = $1 and tipo = 'entrada'`, [tokenUsuario.id]);

        if (entradas[0].entradas === null) {
            entradas[0].entradas = 0
        }
        if (saidas[0].saidas === null) {
            saidas[0].saidas = 0
        }

        return res.status(200).json({ entrada: entradas[0].entradas, saida: saidas[0].saidas })

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro Interno do Sistema" })
    }
}

module.exports = { extrato }