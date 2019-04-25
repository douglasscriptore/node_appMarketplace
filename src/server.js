const express = require('express')
const mongoose = require('mongoose')
const databaseConfig = require('./config/database')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.database()
    this.middlewares()
    this.routes()
  }

  database () {
    mongoose.connect(databaseConfig.uri, {
      useCreateIndex: true, // informa o mongo que estou utilizando uma versão mais atual do node para ele fazer algumas 'adaptações'
      useNewUrlParser: true
    })
  }

  middlewares () {
    // da a possibilidade do express ler requisições em JSON
    this.express.use(express.json())
  }

  routes () {
    this.express.use(require('./routes'))
  }
}

module.exports = new App().express
