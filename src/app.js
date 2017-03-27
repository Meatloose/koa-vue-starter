import Vue from 'vue'
import App from 'views/App'
import router from 'routers/'
import store from 'stores/'

const app = new Vue({
  store,
  router,
  ...App
})

export { app, router, store }
