import * as types from './mutation-types'
import NativeAPI from 'utils/bridge'

const resolve = (commit) => commit(types.NATIVE_API_CHECK, true)

const reject = (commit) => commit(types.NATIVE_API_CHECK, false)

export const nativeApiCheck = ({ commit }) => {
  NativeAPI.check()
  .then(() => resolve(commit))
  .catch(() => reject(commit))
}

export const nativeApiRetry = ({ commit }) => {
  NativeAPI.retry()
  .then(() => resolve(commit))
  .catch(() => reject(commit))
}
