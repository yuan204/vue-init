const stats = {}
const LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted']
export function initMixin(Vue) {
  Vue.options = {}
  Vue.mixin = function (options) {

    Vue.options = mergeOptions(Vue.options, options)

  }



  LIFECYCLE_HOOKS.forEach(hook => {
    stats[hook] = (parentVal, childVal) => {
      if (parentVal) {
        if (childVal) {
          return  parentVal.concat(childVal)
        } else {
          return parentVal
        }
      } else {
        if (childVal) {
          return [childVal]
        } else {
          return []
        }
      }
    }
  });

  stats.data = (parentVal, childVal) => {
    return {...parentVal, ...childVal}
  }


}


export function mergeOptions(parent, child) {
  const options = {}

  function mergeField(field) {
    if (stats[field]) {
      options[field] = stats[field](parent[field], child[field])
    } else {
      options[field] = parent[field] || child[field]
    }
  }

  for (const parentField of Object.keys(parent)) {
    if (!Object.keys(child).includes(parentField))
      mergeField(parentField)
  }

  for (const childField of Object.keys(child)) {
    mergeField(childField)
  }
  return options
}
