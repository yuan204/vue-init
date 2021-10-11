import {initState} from "./state";
import {compileToFunction} from "./compiler/index";
import {callHooks, mountComponent} from "./lifecycle";
import nextTick from "./utils/nextTick";
import { mergeOptions } from "./GlobalApi/mixin";


function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    // vm.$options = options
    vm.$options = mergeOptions(Vue.options,options)
    callHooks(vm, 'beforeCreate')
    initState(this)
    callHooks(vm, 'created')

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

}

export default initMixin