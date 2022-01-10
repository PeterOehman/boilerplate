const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const axios = require('axios')
const Sequelize = require('sequelize')

const SALT_ROUNDS = 5

const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost:5432/bugTracker', {
  logging: false
})

const User = db.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  }
})

module.exports = {
  db,
  models: {
    User
  }
}

User.prototype.correctPassword = function(attemptedPwd) {
  return jwt.compare(attemptedPwd, this.password)
}

User.prototype.generateToken = function() {
  return jwt.sign({id: this.id}, process.env.JWT)
}

User.authenticate = async function({username, password}) {
  const user = await this.findOne({where: username})
  if (!user || !(await user.correctPassword(password))) {
    const error = Error('Incorrect username/password')
    error.status = 401;
    throw error
  }
  return user.generateToken()
}

User.findByToken = async function(token) {
  try {
    const {id} = await jwt.verify(token, process.env.JWT)
    const user = User.findBYPk(id)
    if (!user) {
      throw 'nope'
    }
    return user
  } catch (err) {
    const error = Error('bad token')
    error.status = 401
    throw error
  }
}

const hashPassword = async(user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS)
  }
}
