import spawn from 'cross-spawn'

export default server => {
  const runner = spawn(
    './node_modules/.bin/nightwatch',
    [
      '--config', 'test/e2e/_nightwatch.conf.js',
      '--env', 'chrome'
    ],
    {
      stdio: 'inherit'
    }
  )

  runner.on('exit', function (code) {
    server.close()
    process.exit(code)
  })

  runner.on('error', function (err) {
    server.close()
    throw err
  })
}
