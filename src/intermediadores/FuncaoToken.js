const jwt = require('jsonwebtoken')
const senhaJWT = require('../../Config/senhaJWT')

module.exports = function validaToken(authorization, res, next) {

    const token = authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." })
    }

    try {

        const tokenValido = jwt.verify(token, senhaJWT);

    } catch (error) {
        if (jwt.TokenExpiredError) {
            return res.status(401).json({ mensagem: "Token Expirado, Refaça o Login" });
        }
    }

}
