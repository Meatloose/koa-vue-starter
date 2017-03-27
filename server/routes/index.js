import Router from 'koa-router'
import _debug from 'debug'

import user from './user'

export default app => {
  const debug = _debug('koa:routes')

  debug('initialize')

  // api routes
  const router = new Router({
    prefix: '/apis'
  })

  user(app, router)

  // support different functions for different pages on the server
  app.use(router.routes())
  app.use(router.allowedMethods({
    throw: true
  }))
}
