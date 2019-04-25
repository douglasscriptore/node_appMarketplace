const express = require('express')
const routes = express.Router()

// middlewares
const authMiddleware = require('./app/middlewares/auth')
// controllers
const constroller = require('./app/controllers')

routes.post('/users', constroller.UserController.store)
routes.post('/sessions', constroller.SessionController.store)

routes.get('/teste', authMiddleware, (req, res) => {
  res.json({ ok: true })
})

module.exports = routes
