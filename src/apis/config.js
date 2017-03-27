const HOST = {
  production: '', // 生产环境
  development: '' // 测试环境
}

export default HOST[process.env.NODE_ENV]
