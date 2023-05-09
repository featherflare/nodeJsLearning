const allowedOrigin = require('../Lessions/Lession 9 - 11/config/allowedOrigin')

const credentials = (req, res, next) => {
  const origin = req.headers.origin
  if (allowedOrigin.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true)
  }
  next()
}

module.exports = credentials
