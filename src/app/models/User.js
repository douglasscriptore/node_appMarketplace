const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// realizar atividade antes (pre) de 'save' usuario, pode ser tanto p/ create/update
// não utilizo arrowfunction pois o mongoose passa o user pelo this
UserSchema.pre('save', async function (next) {
  // não faz alteração caso o password não tenha sido alterado
  if (!this.isModified('password')) {
    return next()
  }
  this.password = await bcrypt.hash(this.password, 8)
})

// declarar metodos da instancia do usuario
UserSchema.methods = {
  compareHash (password) {
    return bcrypt.compare(password, this.password)
  }
}

// metodo estatico é desperado diretamente do model User, não da instancia
UserSchema.statics = {
  generateToken ({ id }) {
    // dentro do objeto { id } posso passar outras informações relevantes
    return jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.ttl // 1 dia em milesegundos
    })
  }
}

module.exports = mongoose.model('User', UserSchema)
