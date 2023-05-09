const usersDB = {
  users: require('../model/users.json'),
  setUser: function (data) {
    this.users = data
  },
}
const fsPromises = require('fs').promises
const path = require('path')

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies
  if (!cookies?.jwt) return res.status(204) // No content
  console.log(cookies.jwt)
  const refreshToken = cookies.jwt

  // Is refreshToken in db?
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  )
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true })
    return res.sendStatus(204)
  }

  // Delete refreshToken in dbconst
  otherUser = usersDB.users.find(
    (person) => person.refreshToken !== foundUser.refreshToken
  )
  const currentUser = { ...foundUser, refrestToken: '' }
  usersDB.setUser([...otherUser, currentUser])
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'users.json'),
    JSON.stringify(usersDB.users)
  )
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }) // secure: true - only serves on https
  res.sendStatus(401)
}

module.exports = { handleLogout }
