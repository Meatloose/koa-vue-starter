import { STATUS_CODES } from 'http'
// import _debug from 'debug'

export default () => {
  // const debug = _debug('koa:tools:error')
  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.app.emit('error', err, ctx)

      let message

      ctx.status = ctx.status || 500
      message = err.message

      ctx.type = 'application/json'
      ctx.body = {
        code: STATUS_CODES[ctx.status],
        message
      }
    }
  }
}
