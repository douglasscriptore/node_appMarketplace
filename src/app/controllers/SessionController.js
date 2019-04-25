const User = require('../models/User')

class SessionController {
  async store (req, res) {
    const { email, password } = req.body

    // busca usuario
    const user = await User.findOne({ email })
    // caso não existir retorna erro
    if (!user) {
      res.status(400).json({ error: 'User not found' })
    }
    // verificar se senha confere
    if (!(await user.compareHash(password))) {
      return res.status(400).json({ error: 'Invalid password' })
    }

    return res.json({ user, token: User.generateToken(user) })
  }
}

module.exports = new SessionController()
