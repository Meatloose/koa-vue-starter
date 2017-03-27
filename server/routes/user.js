import _debug from 'debug'

export default (app, router) => {
  const debug = _debug('koa:routes:user')

  debug('initialize')

  router.get('/users', async ctx => {
    const user = await new Promise((resolve, reject) => {
      setTimeout(resolve({name: 'Meatloose'}), 3000)
    })
    ctx.body = user
  })
}
