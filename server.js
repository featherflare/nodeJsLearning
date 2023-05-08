const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const { logger } = require('./Lessions/Lession 8: Routing/middleware/logEvents')
const errorHandler = require('./Lessions/Lession 8: Routing/middleware/errorHandler')
const PORT = process.env.PORT || 3500

// custom midleware logger
app.use(logger)

// Cross Origin Resource Sharing
const whitelist = [
  'https://www.yoursite.com',
  'http://127.0.0.1:5000',
  'http://localhost:3500',
]
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// build-in middleware to handle urlencoded data
// in other words, from data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }))

//build-in middleware for json
app.use(express.json())

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/subdir', express.static(path.join(__dirname, '/public')))

app.use('/', require('./routes/root'))
app.use('/subdir', require('./routes/subdir'))
app.use('/employees', require('./routes/api/employees'))

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    req.json({ error: '404 Not Found' })
  } else {
    req.type('txt').send('404 Not Found')
  }
})

app.get(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
