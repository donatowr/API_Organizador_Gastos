const FuncaoToken = require('./FuncaoToken');
const senhaJWT = require('../../Config/senhaJWT');
const jwt = require('jsonwebtoken');


const validaCategoria = (req, res, next) => {

    const { authorization } = req.headers
    FuncaoToken(authorization, res, next);

    next()
}

module.exports = { validaCategoria }