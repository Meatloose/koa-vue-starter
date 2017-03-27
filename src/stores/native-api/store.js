import {
  NATIVE_API_CHECK
} from './mutation-types'
import * as actions from './actions'

const state = {
  ABLE: false
}

const mutations = {
  [NATIVE_API_CHECK] (state, able) {
    state.ABLE = able
  }
}

export default {
  state,
  actions,
  mutations
}
