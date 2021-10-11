import {createElementVNode, createTextVNode} from "./vdom/index";
import {patch} from "./vdom/patch";
import Watcher from "./observe/watcher";


export function callHooks(vm, hook) {
    vm.$options[hook] && vm.$options[hook].forEach(item => item.call(vm))
}

export function lifecycleMixin(Vue) {
    Vue.prototype._render = function (){
        const vm = this
        const render = vm.$options.render
        return render.call(vm)
    }
    Vue.prototype._update = function (vnode){
        const vm = this
        // const oldNode = vm.$el
        if (vm._prevVNode) {
            patch(vm._prevVNode, vnode)
        } else {
            vm.$el = patch(vm.$el, vnode)
        }
        vm._prevVNode = vnode
    }
    Vue.prototype._c = function (){
        return createElementVNode(this, ...arguments)
    }
    Vue.prototype._v = function (){
        return createTextVNode(this, ...arguments)
    }

    Vue.prototype._s = function (value){
        if (typeof  value === 'object' && value !== null) {
            return JSON.stringify(value)
        }
        return value
    }
}




export function mountComponent(vm, el) {
    vm.$el = el
    const updateComponent = () => vm._update(vm._render())
    new Watcher(vm, updateComponent)

}