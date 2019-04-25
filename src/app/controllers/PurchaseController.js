const Ad = require('../models/Ad')
const User = require('../models/User')
const Mail = require('../services/Mail')

class PurchaseController {
  async store (req, res) {
    const { adId, content } = req.body

    // informações do anuncio de intenção de compra
    const purchaseAd = await Ad.findById(adId).populate('author')

    // informação do usuario logado
    const user = await User.findById(req.userId)

    await Mail.sendMail({
      from: '"Douglas Scriptore" <douglasscriptore@gmail.com>',
      to: purchaseAd.author.email,
      subject: `Solicitação de compra: ${purchaseAd.title}`,
      html: `<p>Teste: ${content} </p>`
    })

    return res.send()
  }
}

module.exports = new PurchaseController()
