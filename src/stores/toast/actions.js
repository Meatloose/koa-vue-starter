import * as types from './mutation-types'

export const showToast = ({commit}, content) => {
  commit(types.SHOW_TOAST, content)

  setTimeout(() => commit(types.HIDE_TOAST), 3 * 1000)
}
