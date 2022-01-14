const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Sequelize = require('sequelize')
require('dotenv').config()

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

User.beforeCreate(async (user) => user.password = await bcrypt.hash(user.password, 5))

User.authenticate = async function({username, password}) {
  const user = await this.findOne({where: {username}})
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = Error('Incorrect username/password')
    error.status = 401;
    throw error
  }
  return jwt.sign({ id: user.id}, process.env.JWT)
}

User.findByToken = async function(token) {
  try {
    const {id} = await jwt.verify(token, process.env.JWT)
    const user = User.findByPk(id)
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
