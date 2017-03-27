# koa-vue-starter

> A starter kit built with [koa 2](http://koajs.com/) and [Vue.js 2.x](http://vuejs.org/) and [webpack 2.x](http://webpack.github.io/)


## 技术栈

- koa
- vue (with vuex, vue-router, fetch)
- webpack
- karma

### 基本

- 使用 ES6 编写
- koa 提供 server

### 特性

- iconfont / [svg-sprite](https://www.npmjs.com/package/svg-sprite-loader) 支持
- 提供 webp 兼容支持
- 提取 webpack 运行时 [chunkhash](https://github.com/webpack/webpack/tree/master/examples/chunkhash)
- 内联 webpack 运行时 chunkhash 与 css 文件到 html template
- PWA 实践，通过 webpack [offline-plugin](https://www.npmjs.com/package/offline-plugin) ServiceWorker 实现 AppCache


## 使用说明

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:3000
npm run dev

# clean
npm run clean

# build for production with minification
npm run compile

# run server in production
npm start

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests, currently only run unit
npm test
```

## 兼容性

移动浏览器
