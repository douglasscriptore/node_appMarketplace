const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')
const { promisify } = require('util')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization

  // verifica se o authHeader existe
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  // faz um split no authHeader e como quero pegar só a segunda parte e destrtuturar
  const [, token] = authHeader.split(' ')

  try {
    // a funsão promosify é uma função do utils do node que converte funções de callback
    // em funções promises
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)

    // toda rota que usar o middleware de auth vai saber qual é o ID do usuario
    req.userId = decoded.id
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' })
  }
}
