const express = require('express')
const app = express()
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { models: {User}} = require('./database')

app.use(express.static('./public'))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', require('./apiRoutes'))

app.post('/login', async (req, res, next) => {
  try {
  let username = req.body.username
  let password = req.body.password
  res.send(await User.authenticate({username, password}))
  } catch (err) {
    next(err)
  }
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error')
})

app.listen(5000, () => {
  console.log('serving up silly sounds on port 5000')
})
