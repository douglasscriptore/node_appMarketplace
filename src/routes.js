const express = require('express')
const validate = require('express-validation')
const handle = require('express-async-handler')
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
  handle(controller.UserController.store)
)
routes.post(
  '/sessions',
  validate(validators.Session),
  handle(controller.SessionController.store)
)

// toda rota a partir daqui esteja configurada para não aceitar usuario não autenticado
routes.use(authMiddleware)

/**
 * Ads
 */

routes.get('/ads', handle(controller.AdController.index))
routes.get('/ads/:id', handle(controller.AdController.show))
routes.post(
  '/ads',
  validate(validators.Ad),
  handle(controller.AdController.store)
)
routes.put(
  '/ads/:id',
  validate(validators.Ad),
  handle(controller.AdController.update)
)
routes.delete('/ads/:id', handle(controller.AdController.destroy))

/**
 * Purchase
 */
routes.get('/purchases', handle(controller.PurchaseController.index))
routes.get('/purchases/:id', handle(controller.PurchaseController.show))
routes.post(
  '/purchases',
  validate(validators.Purchase),
  handle(controller.PurchaseController.store)
)
routes.put(
  '/purchases/:id/approve',
  handle(controller.PurchaseController.approve)
)

module.exports = routes
