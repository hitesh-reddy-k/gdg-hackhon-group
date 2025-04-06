const express = require('express')
const app = express()
const port = 7777
const dotenv = require('dotenv')
const path  = require('path')
const user = require('../backend/router/userrouter')
const Connect = require("../backend/database/db")
const generate = require("../backend/router/userInfoRouter")

app.use(express.static(path.join(__dirname, '..', 'forentend')));


dotenv.config({path: path.join(__dirname,'/backend/env/.env')})

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }))


app.use('/user',user)
app.use('/dite',generate)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

console.log("welcome to  the server")
console.log(`Welcome to the server`)

app.use("/user",user)

Connect()

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})