import Vue from 'vue'
import Vuex from 'vuex'
import modules from 'stores/modules'

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  strict: true
})
