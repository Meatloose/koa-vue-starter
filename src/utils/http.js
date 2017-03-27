import 'whatwg-fetch'
import { stringify } from 'utils/queryString'

const defaultHeaders = {
  'Accept': 'application/json'
}

function mutate (url, { headers, body, params, ...options }) {
  headers = { ...defaultHeaders, ...headers }
  options.headers = headers

  if (body) {
    if (typeof body === 'object') {
      body = JSON.stringify(body)
    }
    options.body = body
  }

  if (params) {
    if (typeof params === 'object') {
      params = stringify(params)
    }
    url += (url.indexOf('?') !== -1) ? '&' : '?'
    url += params
  }

  return [url, options]
}

const ajax = (url, options = {}) => {
  return window.fetch(...mutate(url, options))
  .then(res => {
    if (res.status >= 200 && res.status < 400) {
      return res.json()
    } else {
      throw res
    }
  })
  .catch(err => {
    throw err
  })
}

export const GET = (url, options = {}) => {
  options.method = 'GET'
  options.headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
  return ajax(url, options)
}

export const POST = (url, options = {}) => {
  options.method = 'POST'
  options.headers = { 'Content-Type': 'text/plain' }
  options.mode = 'cors'
  return ajax(url, options)
}
