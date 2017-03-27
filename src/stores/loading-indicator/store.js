import {
  SWITCH_INDICATE_STATE
} from './mutation-types'
import * as actions from './actions'

const state = {
  OFFSET: 0,
  PROCESS: null
}

const mutations = {
  [SWITCH_INDICATE_STATE] (state, offset, process) {
    state.OFFSET = offset
    state.PROCESS = process
  }
}

export default {
  state,
  actions,
  mutations
}
