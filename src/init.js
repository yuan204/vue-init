import {initState} from "./state";
import {compileToFunction} from "./compiler/index";
import {mountComponent} from "./lifecycle";
import nextTick from "./utils/nextTick";
import Watcher from "./observe/watcher";


function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options
    initState(this)

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this
    el = document.querySelector(vm.$options.el)
    if (!vm.$options.render) {
      let template = vm.$options.template
      if (!template) {
        template = el.outerHTML
      }
      const render = compileToFunction(template)
      vm.$options.render = render
    }
    mountComponent(vm, el)

  }

  Vue.prototype.$watch = function (expOrFn, callback, options = {}) {
    options.user = true
    const vm = this
    const watcher = new Watcher(vm, expOrFn, callback, options)
    if (options.immediate) {
      callback.call(vm, watcher.value)
    }
  }

}

export default initMixin