const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const httpsOptions = {
  key: fs.readFileSync('./certificates/localhost.key'),
  cert: fs.readFileSync('./certificates/localhost.crt'),
  host: '0.0.0.0',
}

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true)

    const { pathname } = parsedUrl

    // handle GET request to /service-worker.js
    if (pathname === '/service-worker.js') {
      const filePath = [__dirname, '.next/static', pathname].join('/')
      app.serveStatic(req, res, filePath)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(8080, err => {
    if (err) throw err
    console.log('> Ready on https://localhost:3000')
  })
})
