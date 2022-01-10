const router = require('express').Router()

router.use('/users', require('./users'))//matches all requests to /api/users

module.exports = router
