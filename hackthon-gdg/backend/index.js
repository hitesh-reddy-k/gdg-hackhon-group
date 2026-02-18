const express = require('express')
const app = express()
const port = process.env.PORT || 7777
const dotenv = require('dotenv')
const path  = require('path')
const cors = require('cors')
const user = require('../backend/router/userrouter')
const Connect = require("../backend/database/db")
const generate = require("../backend/router/userInfoRouter")

app.use(express.static(path.join(__dirname, '..', 'forentend')));

// Load environment-specific config
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({path: path.join(__dirname,'..', 'env', envFile)});
console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📁 Loaded config: ${envFile}`);

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }))


app.use('/user',user)
app.use('/dite',generate)


app.get('/', (req, res) => {
  res.json({ 
    message: 'Food Application API Server',
    status: 'running',
    environment: process.env.NODE_ENV || 'development'
  })
})

console.log("welcome to  the server")
console.log(`Welcome to the server`)

Connect()

// For local development
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
  })
}

// Export for Vercel serverless
module.exports = app;