const express = require('express')
const validate = require('express-validation')

const routes = express.Router()

// middlewares
const authMiddleware = require('./app/middlewares/auth')
// controllers
const controller = require('./app/controllers')
// validators
const validators = require('./app/validators')

routes.post(
  '/users',
  validate(validators.User),
  controller.UserController.store
)
routes.post(
  '/sessions',
  validate(validators.Session),
  controller.SessionController.store
)

// toda rota a partir daqui esteja configurada para não aceitar usuario não autenticado
routes.use(authMiddleware)

/**
 * Ads
 */

routes.get('/ads', controller.AdController.index)
routes.get('/ads/:id', controller.AdController.show)
routes.post('/ads', validate(validators.Ad), controller.AdController.store)
routes.put('/ads/:id', validate(validators.Ad), controller.AdController.update)
routes.delete('/ads/:id', controller.AdController.destroy)

/**
 * Purchase
 */

routes.post(
  '/purchases',
  validate(validators.Purchase),
  controller.PurchaseController.store
)

module.exports = routes
