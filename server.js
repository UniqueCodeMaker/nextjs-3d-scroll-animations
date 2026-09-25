import { createServer } from 'https'
import { parse } from 'url'
import next from 'next'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Default to production unless explicitly set to development
const dev = process.env.NODE_ENV === 'development'
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production'
}
const hostname = '0.0.0.0'
const port = parseInt(process.env.PORT || '5001', 10)
const app = next({ dev, hostname, port, dir: __dirname })
const handle = app.getRequestHandler()

// Read SSL certificate file paths from environment variables (with default fallback to mind-roots letsencrypt paths)
const keyPath = process.env.DEV_KEY_FILE || '/etc/letsencrypt/live/projects.mind-roots.com/privkey.pem'
const certPath = process.env.DEV_CERT_FILE || '/etc/letsencrypt/live/projects.mind-roots.com/fullchain.pem'

app
  .prepare()
  .then(() => {
    let serverOptions = {}
    if (
      keyPath &&
      certPath &&
      fs.existsSync(keyPath) &&
      fs.existsSync(certPath)
    ) {
      try {
        serverOptions = {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath),
        }
        console.log(
          `🔑 SSL certificates loaded successfully for Next.js HTTPS server.`,
        )
      } catch (err) {
        console.error(`❌ Failed to read SSL certificates:`, err)
      }
    } else {
      console.error(
        `❌ SSL certificates not configured or do not exist on disk!`,
      )
      console.error(`DEV_KEY_FILE: ${keyPath}`)
      console.error(`DEV_CERT_FILE: ${certPath}`)
    }

    createServer(serverOptions, async (req, res) => {
      try {
        const parsedUrl = parse(req.url || '', true)
        await handle(req, res, parsedUrl)
      } catch (err) {
        console.error('Error occurred handling request:', req.url, err)
        res.statusCode = 500
        res.end('Internal server error')
      }
    }).listen(port, () => {
      console.log(
        `🚀 Next.js HTTPS Production Server running at https://${hostname}:${port}`,
      )
    })
  })
  .catch((err) => {
    console.error('Failed to prepare Next.js application:', err)
    process.exit(1)
  })
