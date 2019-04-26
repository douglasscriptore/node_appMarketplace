const kue = require('kue')
const Sentry = require('@sentry/node') // a ordem importa, deve ser chamado antes de redisConfig
const redisConfig = require('../../config/redis')
const jobs = require('../jobs')

const Queue = kue.createQueue({ redis: redisConfig })

// estou falando pra fila processar todos Jobs que tenha a key
Queue.process(jobs.PurchaseMail.key, jobs.PurchaseMail.handle)

// envia error da Queue para o sentry
Queue.on('error', Sentry.captureException)

module.exports = Queue
