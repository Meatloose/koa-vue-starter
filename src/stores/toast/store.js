import {
  SHOW_TOAST,
  HIDE_TOAST
} from './mutation-types'
import * as actions from './actions'

const state = {
  SHOW: false,
  CONTENT: ''
}

const mutations = {
  [SHOW_TOAST] (state, content) {
    state.SHOW = true
    state.CONTENT = content
  },

  [HIDE_TOAST] (state) {
    state.SHOW = false
    state.CONTENT = ''
  }
}

export default {
  state,
  actions,
  mutations
}
