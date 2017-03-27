export const getScrollTop = ele => {
  if (ele === window) return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop)

  return ele.scrollTop
}

export const getComputedStyle = ele => window ? document.defaultView.getComputedStyle(ele) : {}

export const getScrollEventTarget = ele => {
  let currentNode = ele
  while (currentNode && currentNode.tagName !== 'HTML' && currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
    const overflowY = getComputedStyle(currentNode).overflowY
    if (overflowY === 'scroll' || overflowY === 'auto') return currentNode

    currentNode = currentNode.parentNode
  }

  return window
}

export const getVisibleHeight = ele => {
  if (ele === window) return document.documentElement.clientHeight

  return ele.clientHeight
}

export const getElementTop = ele => {
  if (ele === window) return getScrollTop(window)

  return ele.getBoundingClientRect().top + getScrollTop(window)
}

export const isAttached = ele => {
  let currentNode = ele.parentNode
  while (currentNode) {
    if (currentNode.tagName === 'HTML') return true

    if (currentNode.nodeType === 11) return false

    currentNode = currentNode.parentNode
  }

  return false
}
