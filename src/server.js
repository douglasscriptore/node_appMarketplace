// chama a lib que carrega as configurações do arquivo .env
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const Youch = require('youch')
const validate = require('express-validation')
const databaseConfig = require('./config/database')
const Sentry = require('@sentry/node')
const sentryConfig = require('./config/sentry')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    // manter a ordem de chamada dos metodos
    this.sentry()
    this.database()
    this.middlewares()
    this.routes()
    this.exception()
  }

  // optei em colocar o sentry antes de tudo para todos os aps saberem sobre ele
  sentry () {
    Sentry.init(sentryConfig)
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
    // The request handler must be the first middleware on the app
    this.express.use(Sentry.Handlers.requestHandler())
  }

  routes () {
    this.express.use(require('./routes'))
  }

  exception () {
    // quero utilizar o errorHandler() apenas em produção
    // if (process.node.NODE_ENV === 'production') {
    // The error handler must be before any other error middleware
    this.express.use(Sentry.Handlers.errorHandler())
    // }

    // quando o middleware recebe 4 parametros o primeiro parametro passa a ser o erro
    this.express.use(async (err, req, res, next) => {
      // verifica se o erro é uma estancia do validate
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err)
      }

      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err)
        return res.json(await youch.toJSON())
      }

      return res
        .status(err.status || 500)
        .json({ error: 'Internal Server Error' })
    })
  }
}

module.exports = new App().express
