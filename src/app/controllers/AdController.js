const Ad = require('../models/Ad')

class AdController {
  // fazer listagem
  async index (req, res) {
    // primeiro objeto da função paginate({}) são opções de filtro
    // o segundo parametro são as configurações da paginação
    // a função populate na função paginate pode ser usada dentro do objeto de options
    // caso eu não estrivesse utilizando a função paginate do mongoose com o plugin moongose populate
    // spoderia usar da seginte forma Ad.populate('author).findAll()
    // criando filtros para a consultar
    const filters = {}
    // filtro de preços
    if (req.query.price_min || req.query.price_max) {
      filters.price = {}

      // a função do gte é >= apenas do mongoose
      if (req.query.price_min) {
        filters.price.$gte = req.query.price_min
      }
      if (req.query.price_max) {
        filters.price.$lte = req.query.price_max
      }
    }

    // filtro de texto
    if (req.query.title) {
      filters.title = new RegExp(req.query.title, 'i') // o atributo 'i' ignora o case sensitive
    }

    const ads = await Ad.paginate(filters, {
      page: req.query.page || 1,
      limit: 20,
      populate: ['author'],
      sort: '-createdAt'
    })

    return res.json(ads)
  }
  // buscar um unico resultado
  async show (req, res) {
    const ad = await Ad.findById(req.params.id)

    return res.json(ad)
  }
  // salvar
  async store (req, res) {
    const ad = await Ad.create({ ...req.body, author: req.userId })

    return res.json(ad)
  }
  // atualizar
  async update (req, res) {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true // dps de der update ele vai atualizar as informações para a variavel ad para retornar pro usuario
    })

    return res.json(ad)
  }
  // deletar
  async destroy (req, res) {
    await Ad.findByIdAndDelete(req.params.id)
    return res.send()
  }
}

module.exports = new AdController()
