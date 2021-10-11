function vNode(vm, tag, data, children, key, text) {
    return {
        vm,
        tag,
        data,
        children,
        key,
        text
    }
}

export function createElementVNode(vm, tag, data = {}, ...children) {
    return vNode(vm, tag, data, children, data.key, null)
}

export function createTextVNode(vm, text) {
    return vNode(vm, null, null, null, null,text )
}