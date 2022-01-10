const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

app.use(express.static('./public'))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', require('./apiRoutes'))

app.listen(5000, () => {
  console.log('serving up silly sounds on port 5000')
})
