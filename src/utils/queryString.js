/**
 * Safely encode the given string
 *
 * @param {String} str
 * @return {String}
 */
const encode = str => {
  try {
    return encodeURIComponent(str)
  } catch (e) {
    return str
  }
}

/**
 * Safely decode the string
 *
 * @param {String} str
 * @return {String}
 */
const decode = str => {
  try {
    return decodeURIComponent(str.replace(/\+/g, ' '))
  } catch (e) {
    return str
  }
}

/**
 * Parse the given query `str`.
 *
 * @param {String} str
 * @return {Object}
 */
export function parse (str) {
  if (typeof str !== 'string') return {}

  str = str.trim()
  if (!str || str.indexOf('=') < 0) return {}

  if (str.indexOf('?') > -1) str = str.split('?')[1]

  const pairs = str.split('&')

  return pairs.reduce((pre, cur) => {
    const parts = cur.split('=')
    const key = parts[0]
    const value = parts[1]

    return {
      ...pre,
      ...key && { [key]: value && decode(value) || '' }
    }
  }, {})
}

/**
 * Stringify the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 */
export function stringify (obj) {
  if (!obj) return ''

  return Object.keys(obj).map(key => `${encode(key)}=${encode(obj[key])}`).join('&')
}
