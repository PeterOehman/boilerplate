const router = require('express').Router()
const { models: {User}} = require('../database')
module.exports = router

router.post('/signup')
