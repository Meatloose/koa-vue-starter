import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from 'routers/routes'

Vue.use(VueRouter)

export default new VueRouter({
  base: '/promotion',
  mode: 'history',
  scrollBehavior: (to, from, savedPosition) => savedPosition || { x: 0, y: 0 },
  routes
})
