import { Server } from 'node:http'
import { stdout } from 'node:process'
import { EOL } from 'node:os'
import { join } from 'node:path'
import { open } from 'node:fs/promises'

const { dirname } = import.meta

const port = 8080
const host = '0.0.0.0'

const server = new Server()

server.on('request', async (request, response) => {
  const { remoteAddress: client } = request.socket
  try {
    if (request.url === '/') {
      const fileHandle = await open(join(dirname, 'index.html'))
      const stream = fileHandle.createReadStream()
      response.statusCode = 200
      response.setHeader('Content-Type', 'text/html')
      stream.pipe(response)
    } else {
      const filename = join(dirname, 'public', request.url)
      const fileHandle = await open(join(dirname, 'public', request.url))
      const stream = fileHandle.createReadStream()
      response.statusCode = 200
      response.setHeader('Content-Type', 'text/javascript')
      stream.pipe(response)
    }
  } catch {
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/plain')
    response.end('Error 404: Page Not Found')
  }
})

server.listen(port, host, () => {
  const printablePort = port === 80 ? '' : `:${ port }`
  console.log(`server: start listen on http://localhost${ printablePort }`)
})
