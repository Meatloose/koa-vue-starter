import ga from 'ga'

export default (category, action, label, value) => {
  if (!ga || !window.ga) return

  return ga('send', 'event', category, action, label, value)
}
