

function createNode(vNode) {
    const {tag,data, text, children} = vNode
    if (vNode.tag) {
        const el = document.createElement(tag)
        children.map(vNode => createNode(vNode)).forEach(node =>el.appendChild(node) )
        return el
    } else {
        return document.createTextNode(text)
    }
}

export function patch(oldVNode, vNode) {
    const isRealElement = oldVNode.nodeType
    if (isRealElement) {
        const node =  createNode(vNode)
        const parent = oldVNode.parentNode
        parent.insertBefore(node, oldVNode)
        parent.removeChild(oldVNode)
        return node
    }
}