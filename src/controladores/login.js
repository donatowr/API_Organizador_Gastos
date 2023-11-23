
const jwt = require('jsonwebtoken');
const pool = require("../../Config/conexao");
const senhaJWT = require('../../Config/senhaJWT');

const loginUsuario = async (req, res) => {
    const { email } = req.body

    try {

        const usuario = await pool.query('select * from usuarios where email = $1', [email]);

        const token = jwt.sign({ id: usuario.rows[0].id, email }, senhaJWT, { expiresIn: '8h' });

        const { senha: _, ...usuarioLogado } = usuario.rows[0];

        return res.json({ usuario: usuarioLogado, token })

    } catch (error) {

        return res.status(500).json({ mensagem: "Erro Interno do Servidor" });
    }

}

module.exports = { loginUsuario }