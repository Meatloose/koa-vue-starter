/**
 * 格式化数字模式不足两位的数字，前面补0
 * @param  {[int]} n [目标数字]
 * @param  {[int]} l [设定长度]
 * @return {[string]} [格式化后的字符串]
 */
const fillZero = (n, l = 2) => {
  n = (+n).toString().split('')
  while (n.length < l) { n.unshift(0) }

  return n.join('')
}
/**
 * [转换间隔时间（毫秒数）]
 * @param  {[int]} during [时间间隔毫秒数]
 * @return {[obj]} [转换后的时间格式数据，从年到毫秒]
 */
export const transDuring = during => {
  const S = [
    { k: 'million', s: 1000 },
    { k: 'ss', s: 60 },
    { k: 'mm', s: 60 },
    { k: 'HH', s: 24 },
    { k: 'dd', s: 30 },
    { k: 'MM', s: 12 },
    { k: 'yy', s: 0 }
  ]
  const l = S.length
  const result = {}

  for (let i = 0; i < l; i++) {
    const s = S[i].s
    const k = S[i].k
    // 取余数
    const t = during <= 0 ? 0 : (s ? during % s : during)

    result[k] = fillZero(t, k === 'milli' ? 3 : 2)

    if (during <= 0 || !s) continue
    // 取除数
    during = Math.floor(during / s)
  }
  return result
}

export const formatUTCDate = time => {
  time = time.split(' ')
  const T = [].concat(time[0].split('-')).concat(time[1] ? time[1].split(':') : [])

  return new Date(Date.UTC(T[0], T[1] - 1, T[2], T[3] || 0, T[4] || 0, T[5] || 0))
}

/**
 * [获取间隔时间]
 * @param  {[string]} time [时间格式字符串，例如2015-08-19 14:04:56, 时分秒可以不加，默认是目标时间凌晨零点]
 * @return {[obj]} [当前时间距离目标时间的时间间隔信息]
 */
export const getDuring = time => {
  const future = formatUTCDate(time)
  const now = new Date()

  return Math.round((future.getTime() - now.getTime())) + future.getTimezoneOffset() * 60 * 1000
}
