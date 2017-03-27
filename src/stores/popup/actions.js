import * as types from './mutation-types'
import makeAction from 'utils/makeAction'
import { Once } from 'utils/domEvent'

export const showPopup = ({commit}, options) => {
  commit(types.SHOW_POPUP, options)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cancelButton = document.querySelector('#cancelButton')
      const confirmButton = document.querySelector('#confirmButton')
      cancelButton && Once(cancelButton, 'click', () => {
        commit(types.HIDE_POPUP)
        resolve(false)
      })
      confirmButton && Once(confirmButton, 'click', () => {
        commit(types.HIDE_POPUP)
        resolve(true)
      })
    }, 40)
  })
}

export const hidePopup = makeAction(types.HIDE_POPUP)
