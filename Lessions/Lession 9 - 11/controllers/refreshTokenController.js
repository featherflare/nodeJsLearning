const usersDB = {
  users: require('../model/users.json'),
  setUser: function (data) {
    this.users = data
  },
}
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(401)
  const refreshToken = cookies.jwt

  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  )
  if (!foundUser) return res.sendStatus(403) // Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403)
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expriresIn: '30s' }
    )
    req.json({ accessToken })
  })
}

module.exports = { handleRefreshToken }
