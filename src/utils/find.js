export default (array, predicate, context = this) => {
  if (typeof Array.prototype.find === 'function') {
    return array.find(predicate, context)
  }

  const length = array.length
  let i

  if (typeof predicate !== 'function') {
    throw new TypeError(`${predicate} is not a function`)
  }

  for (i = 0; i < length; i++) {
    if (predicate.call(context, array[i], i, array)) {
      return array[i]
    }
  }
}
