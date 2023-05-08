const http = require('http')
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs').promises

const logEvents = require('./logEvents')

const EventEmitter = require('events')
const { stringify } = require('querystring')

class Emitter extends EventEmitter {}

const myEmitter = new Emitter()
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName))
const PORT = process.env.PORT || 3500

const serveFlie = async (filePath, contentType, responce) => {
  try {
    const rawData = await fsPromises.readFile(
      filePath,
      !contentType.includes('image') ? 'utf8' : ''
    )
    const data =
      contentType === 'application/json' ? JSON.parse(rawData) : rawData
    responce.writeHead(filePath.includes('404.html') ? 404 : 200, {
      'Content-Type': contentType,
    })
    responce.end(data)
  } catch (err) {
    console.log(err)
    myEmitter.emit('log', `${err.name}:${err.message}`, 'errLog.txt')
    responce.statusCode = 500
    responce.end(
      contentType === 'application/json' ? JSON.stringify(data) : data
    )
  }
}

const server = http.createServer((req, res) => {
  console.log(req.url, req.method)
  myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt')

  const extension = path.extname(req.url)

  let contentType

  switch (extension) {
    case '.css':
      contentType = 'text/css'
      break
    case '.js':
      contentType = 'text/javascript'
      break
    case '.json':
      contentType = 'application/json'
      break
    case '.jpg':
      contentType = 'image/jpeg'
      break
    case '.png':
      contentType = 'image/png'
      break
    case '.txt':
      contentType = 'text/plain'
      break
    default:
      contentType = 'text/html'
  }

  let filePath =
    contentType === 'text/html' && req.url === '/'
      ? path.join(__dirname, 'views', 'index.html')
      : contentType === 'text/html' && req.url.slice(-1) === '/'
      ? path.join(__dirname, 'views', 'index.html')
      : contentType === 'text/html'
      ? path.join(__dirname, 'views', req.url)
      : path.join(__dirname, req.url)

  // make .html extension not required in the browser
  if (!extension && req.url.slice(-1) !== '/') filePath += '.html'

  const fileExists = fs.existsSync(filePath)

  if (fileExists) {
    serveFlie(filePath, contentType, res)
  } else {
    // 301 redirect
    switch (path.parse(filePath).base) {
      case 'old-page.html':
        res.writeHead(301, { Location: '/new-page.html' })
        res.end()
        break
      case 'www-page.html':
        res.writeHead(301, { Location: '/' })
        res.end()
        break
      default:
        // server a 404 responce
        serveFlie(path.join(__dirname, 'views', '404.html'), 'text/html', res)
    }
  }
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
