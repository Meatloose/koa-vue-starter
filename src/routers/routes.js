import notfound from './404/'

const Combine = (...routes) => routes.reduce((pre, cur) => pre.concat(cur), [])

export default Combine(notfound)
