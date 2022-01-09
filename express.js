const express = require('express')
const app = express()

app.use(express.static('./public'))

app.listen(5000, () => {
  console.log('serving up silly sounds on port 5000')
})
