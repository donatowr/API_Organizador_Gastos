const pool = require("../../Config/conexao");
const bcrypt = require('bcrypt')

const verificarLogin = async (req, res, next) => {
    const { email, senha } = req.body

    try {

        if (!email || !senha) {
            return res.status(404).json({ mensagem: "Campo email é Obrigatório" })
        }

        const { rowCount, rows } = await pool.query('select * from usuarios where email = $1', [email]);
        if (rowCount < 1) {
            return res.status(404).json({ mensagem: "Usuário e/ou senha inválido(s)." })
        }

        const senhaValida = await bcrypt.compare(senha, rows[0].senha)

        if (!senhaValida) {
            return res.status(404).json({ mensagem: "Usuário e/ou senha inválido(s)." })
        }

        next()


    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do Servidor" })
    }

}

module.exports = { verificarLogin }