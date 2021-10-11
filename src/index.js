import initMixin from "./init";
import {lifecycleMixin} from "./lifecycle";
import nextTick from "./utils/nextTick";


function Vue(options) {
    this._init(options)
}

initMixin(Vue)
lifecycleMixin(Vue)
Vue.prototype.$nextTick = nextTick
export default Vue