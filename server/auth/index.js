const router = require('express').Router()
const { models: {User}} = require('../database')
module.exports = router

router.post('/signup', async(req, res, next) => {
  try {
    await User.create(req.body)
    res.send({token: await User.authenticate(req.body)
  })}
  catch(err) {
  if (err.name === 'SequelizeUniqueConstraintError') {
    res.status(401).send('User already exists')
  } else {
    next(err)
  }
}})

router.post('/login', async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body)})
  } catch (err) {
    next (err)
  }
})

router.get('/me', async (req, res, next) => {
  try {
    res.send(await User.findByToken(req.headers.authorization))
  } catch (error) {
    next(error)
  }
})
