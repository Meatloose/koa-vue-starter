import {
  SHOW_POPUP,
  HIDE_POPUP
} from './mutation-types'
import * as actions from './actions'

const state = {
  SHOW: false,
  OPTIONS: {
    title: '小鳄提示',
    content: '',
    type: 'alert',
    transparent: false,
    cancelButton: '取消',
    confirmButton: '确定'
  }
}

const mutations = {
  [SHOW_POPUP] (state, options = {}) {
    state.SHOW = true
    state.OPTIONS = {...state.OPTIONS, ...options}
  },

  [HIDE_POPUP] (state) {
    state.SHOW = false
  }
}

export default {
  state,
  actions,
  mutations
}
