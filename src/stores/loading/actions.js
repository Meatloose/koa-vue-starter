import * as types from './mutation-types'
import makeAction from 'utils/makeAction'

export const showLoading = makeAction(types.SHOW_LOADING)

export const hideLoading = makeAction(types.HIDE_LOADING)
