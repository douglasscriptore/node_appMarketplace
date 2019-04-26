const Ad = require('../models/Ad')
const User = require('../models/User')
const PurchaseMail = require('../services/../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const { adId, content } = req.body

    // informações do anuncio de intenção de compra
    const purchaseAd = await Ad.findById(adId).populate('author')

    // informação do usuario logado
    const user = await User.findById(req.userId)

    // cria a solicitação de envio
    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    return res.send()
  }
}

module.exports = new PurchaseController()
