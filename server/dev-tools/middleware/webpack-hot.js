import webpackHotMiddleware from 'webpack-hot-middleware'
import applyExpressMiddleware from '../lib/apply-express-middleware'
import _debug from 'debug'

const debug = _debug('koa:webpack-hmr')

export default compiler => {
  debug('Enable Webpack Hot Module Replacement (HMR).')

  const middleware = webpackHotMiddleware(compiler)
  return async function koaWebpackHMR (ctx, next) {
    let hasNext = await applyExpressMiddleware(middleware, ctx.req, ctx.res)

    if (hasNext && next) {
      await next()
    }
  }
}
