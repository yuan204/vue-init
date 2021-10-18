import {observe} from "./observe/index";


function isObject(o) {
    return typeof o === 'object' && o !== null
}

function createWatcher(vm,key, watch) {
    let handler = watch
    let options = {}
    if (isObject(watch)) {
        handler = watch.handler
        options = watch
    }
    vm.$watch(key, handler, options)
}

function initWatch(vm, watch) {
    Object.keys(watch).forEach(key => {
        const val = watch[key]
        if (Array.isArray(val)) {
            val.forEach(item => createWatcher(vm, key, item))
        } else {
            createWatcher(vm, key, val)
        }
    })

}

export function initState(vm) {
    let options = vm.$options
    if (options.data) {
       initData(vm)
    }
    if (options.watch) {
        initWatch(vm, options.watch)
    }
}

function setProxy(vm, data) {
  Object.keys(data).forEach(key => {
      Object.defineProperty(vm, key, {
          get() {
              return data[key]
          },
          set(v) {
              data[key] = v
          }
      })
  })
}

function initData(vm) {
    let data = vm.$options.data
    data = vm._data = typeof data  === 'function' ? data.call(this) : data
    setProxy(vm, data)
    observe(data)
}



