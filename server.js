const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const PORT = process.env.PORT || 5000

const app = express()

// Rate limiting
// TODO : Modify the rate limiter after testing the server capabilities with Apache JMeter
// const limiter = rateLimit({
//     windowMs: 10 * 60 * 1000, // period
//     max: 100 // number of requests allowed in the period
// })
// app.use(limiter)
// app.set('trust proxy', 1)

// Routes
const proxyRouter = require('./routes')
app.use('/proxy', proxyRouter)



// Enable CORS
app.use(cors())

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))