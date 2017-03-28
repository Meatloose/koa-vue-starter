import Koa from 'koa'
import logger from 'koa-logger'
import convert from 'koa-convert'
import historyApiFallback from 'koa-history-api-fallback'
// import session from 'koa-generic-session'
// import redisStore from 'koa-redis'
import compress from 'koa-compress'
import conditional from 'koa-conditional-get'
import etag from 'koa-etag'
import favicon from 'koa-favicon'
import serve from 'koa-static'
import bodyParser from 'koa-bodyparser'
import _debug from 'debug'
import config from './config'
import error from './error'
import routes from './routes'
import devTools from './dev-tools'

const debug = _debug('koa:server')
const paths = config.paths

// Koa application is now a class and requires the new operator.
const app = new Koa()
app.use(logger())

// This rewrites all routes requests to the root /index.html file
// (ignoring file requests). If you want to implement isomorphic
// rendering, you'll want to remove this middleware.
app.use(convert(historyApiFallback({
  verbose: true
})))

// sessions
// app.keys = ['keys', 'keykeys']
// app.use(convert(session({
//   store: redisStore()
// })))

// bodyParser
app.use(bodyParser())

// etag works together with conditional-get
app.use(compress())
app.use(conditional())
app.use(etag())

// last
app.use(error())

// ------------------------------------
// Apply Webpack DEV/HMR Middleware
// ------------------------------------
if (app.env === 'development') {
  devTools(app)
} else {
  // favicon
  app.use(favicon(paths.dist('favicon.ico')))

  // static with cache
  app.use(serve(paths.dist(), {
    maxAge: 365 * 24 * 60 * 60
  }))
}

routes(app)

const {
  server_host,
  server_port
} = config

const args = [server_port]

if (server_host) {
  args.push(server_host)
}

args.push(err => {
  if (err) {
    debug(err)
    return
  }
  debug('Server is now running at %s:%s.', server_host, server_port)
})

export default app.listen(...args)
