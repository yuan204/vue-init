import {initState} from "./state";
import {compileToFunction} from "./compiler/index";


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
    if (!vm.$options.render) {
      let template = vm.$options.template
      if (!template) {
        template = document.querySelector(el).outerHTML
      }
      const render = compileToFunction(template)
    }

  }

}

export default initMixin