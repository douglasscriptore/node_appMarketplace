const express = require('express')
const routes = express.Router()

// controllers
const UserController = require('./app/controllers/UserController')

routes.post('/users', UserController.store)

routes.get('/', (req, res) => {
  res.send('server on')
})

module.exports = routes
