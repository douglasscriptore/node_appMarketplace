const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

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

module.exports = mongoose.model('User', UserSchema)
