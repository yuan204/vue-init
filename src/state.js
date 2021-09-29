import {observe} from "./observe/index";


export function initState(vm) {
    let options = vm.$options
    if (options.data) {
       initData(vm)
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

