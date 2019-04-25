const express = require('express')
const routes = express.Router()

// middlewares
const authMiddleware = require('./app/middlewares/auth')
// controllers
const controller = require('./app/controllers')

routes.post('/users', controller.UserController.store)
routes.post('/sessions', controller.SessionController.store)

// toda rota a partir daqui esteja configurada para não aceitar usuario não autenticado
routes.use(authMiddleware)

/**
 * Ads
 */

routes.get('/ads', controller.AdController.index)
routes.get('/ads/:id', controller.AdController.show)
routes.post('/ads', controller.AdController.store)
routes.put('/ads/:id', controller.AdController.update)
routes.delete('/ads/:id', controller.AdController.destroy)

module.exports = routes
