import initMixin from "./init";
import {lifecycleMixin} from "./lifecycle";
import nextTick from "./utils/nextTick";
import {initGlobalApi} from "./GlobalApi/index";


function Vue(options) {
    this._init(options)
}

initMixin(Vue)
lifecycleMixin(Vue)
initGlobalApi(Vue)
Vue.prototype.$nextTick = nextTick
export default Vue