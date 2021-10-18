function createNode(vNode) {
  const {tag, data, text, children} = vNode
  if (vNode.tag) {
    const el = document.createElement(tag)
    vNode.el = el
    children.map(vNode => createNode(vNode)).forEach(node => el.appendChild(node))
    return el
  } else {
    const el =  document.createTextNode(text)
    vNode.el = el
    return el
  }
}

function isSameVNode(oldVNode, vNode) {
  return oldVNode.tag === vNode.tag && oldVNode.key === vNode.key
}

function mapIndexByKey(vnodes) {
  return vnodes.reduce((acc, vnode, index) => (acc[vnode.key] = index, acc), {})
}

function updateChildren(el, oldVNode, vNode) {
  const oldChildren = oldVNode.children
  const newChildren = vNode.children
  let oldStartIndex = 0
  let newStartIndex = 0
  let oldEndIndex = oldChildren.length - 1
  let newEndIndex = newChildren.length - 1
  let oldStartVNode = oldChildren[oldStartIndex]
  let newStartVNode = newChildren[newStartIndex]
  let oldEndVNode = oldChildren[oldEndIndex]
  let newEndVNode = newChildren[newEndIndex]

  const keyIndexMap = mapIndexByKey(oldChildren)

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (isSameVNode(oldStartVNode, newStartVNode)) {
      patchNode(oldStartVNode, newStartVNode)
      oldStartVNode = oldChildren[++oldStartIndex]
      newStartVNode = newChildren[++newStartIndex]
    } else if (isSameVNode(oldEndVNode, newEndVNode)) {
      patchNode(oldEndVNode, newEndVNode)
      oldEndVNode = oldChildren[--oldEndIndex]
      newEndVNode = newChildren[--newEndIndex]
    } else if (isSameVNode(oldStartVNode, newEndVNode)) {
      el.insertBefore(oldStartVNode.el, oldEndVNode.el.nextSibling)
      patchNode(oldStartVNode, newEndVNode)
      oldStartVNode = oldChildren[++oldStartIndex]
      newEndVNode = newChildren[--newEndIndex]
    } else if (isSameVNode(oldEndVNode, newStartVNode)) {
      el.insertBefore(oldEndVNode.el, oldStartVNode.el)
      patchNode(oldEndVNode, newStartVNode)
      oldEndVNode = oldChildren[--oldEndIndex]
      newStartVNode = newChildren[++newStartIndex]
    } else {
      const index = keyIndexMap[newStartVNode.key]
      if (index) {
        el.insertBefore(oldChildren[index].el, oldStartVNode.el)
      } else {
        el.insertBefore(createNode(newStartVNode), oldStartVNode.el)
      }
      newStartVNode = newChildren[++newStartIndex]
    }

  }

  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      el.removeChild(oldChildren[i].el)
    }
  }

  if (newStartIndex <= newEndIndex) {
    const pos = newChildren[newEndIndex + 1] === null ? null : newChildren[newEndIndex + 1].el
    for (let i = newStartIndex; i < newEndIndex; i++) {
      el.insertBefore(createNode(newChildren[i]), pos)
    }
  }

}

function patchNode(oldVNode, vNode) {
  if (!isSameVNode(oldVNode, vNode)) {
    oldVNode.el.parent.replaceChild(vNode.el, oldVNode.el)
    return
  }

  const el = vNode.el = oldVNode.el
  // 文本节点
  if (!oldVNode.tag) {
    el.textContent = vNode.text
    return;
  }

  // children
  if (oldVNode.children.length > 0 && vNode.children.length > 0)
    updateChildren(el, oldVNode, vNode)
  else if (oldVNode.children.length > 0) {
    el.innerHTML = ''
  } else if (vNode.children.length > 0) {
    vNode.children.forEach(item => el.appendChild(item))
  }
}

export function patch(oldVNode, vNode) {
  const isRealElement = oldVNode.nodeType
  if (isRealElement) {
    const node = createNode(vNode)
    const parent = oldVNode.parentNode
    parent.insertBefore(node, oldVNode)
    parent.removeChild(oldVNode)
    return node
  } else {
    patchNode(oldVNode, vNode)
  }
}