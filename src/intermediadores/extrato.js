const FuncaoToken = require("./FuncaoToken");
const senhaJWT = require('../../Config/senhaJWT');
const jwt = require('jsonwebtoken')

const validaExtrato = (req, res, next) => {
    const { authorization } = req.headers

    FuncaoToken(authorization, res)

    next()
}

module.exports = { validaExtrato }