import {
  SHOW_LOADING,
  HIDE_LOADING
} from './mutation-types'
import * as actions from './actions'

const state = {
  SHOW: false,
  OPTIONS: null
}

const mutations = {
  [SHOW_LOADING] (state, options = {}) {
    state.SHOW = true
    state.OPTIONS = options
  },

  [HIDE_LOADING] (state) {
    state.SHOW = false
    state.OPTIONS = null
  }
}

export default {
  state,
  actions,
  mutations
}
