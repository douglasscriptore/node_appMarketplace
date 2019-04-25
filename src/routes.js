const express = require('express')
const routes = express.Router()

routes.get('/', (req, res) => {
  res.send('server on')
})

module.exports = routes
