const Ad = require('../models/Ad')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
const PurchaseMail = require('../services/../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async index (req, res) {
    const purchases = await Purchase.find({})

    return res.json(purchases)
  }

  async show (req, res) {
    const { id } = req.params

    const purchase = await Purchase.findById(id).populate([
      {
        path: 'ad',
        populate: {
          path: 'author'
        }
      },
      'user'
    ])

    return res.json(purchase)
  }

  async store (req, res) {
    const { adId, content } = req.body

    // informações do anuncio de intenção de compra
    const purchaseAd = await Ad.findById(adId).populate('author')

    // informação do usuario logado
    const user = await User.findById(req.userId)

    // Salva a intensão de compora
    const purchase = await Purchase.create({
      ...req.body,
      user: req.userId,
      ad: adId
    })

    // cria a solicitação de envio de email
    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    return res.json(purchase)
  }

  async approve (req, res) {
    // recupera id da requisição
    const { id } = req.params
    // busca purchase
    const purchase = await Purchase.findById(id).populate({
      path: 'ad',
      populate: {
        path: 'author'
      }
    })

    // verifica se a purchase foi localizada
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' })
    }

    // verifica se o usuario que está tentando aprovar é o autor
    if (!purchase.ad.author._id.equals(req.userId)) {
      return res.status(401).json({ error: "You're not the ad author" })
    }

    // verifica se a intenção de compra ja não foi aprovada
    if (purchase.ad.purchasedBy) {
      return res
        .status(400)
        .json({ error: 'This ad had already been purchased' })
    }

    // o Ad recebe o id da requisição
    purchase.ad.purchasedBy = id

    await purchase.ad.save()

    return res.json(purchase)
  }
}

module.exports = new PurchaseController()
