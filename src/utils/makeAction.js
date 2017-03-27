export default function makeAction (type, ...args) {
  return ({ commit }, ...args) => commit(type, ...args)
}
