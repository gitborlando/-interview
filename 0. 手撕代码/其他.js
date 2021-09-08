/**
 * new 操作符
 */
const New = (ctor, ...args) => {
  const instance = Object.create(ctor.prototype)
  const res = ctor.apply(instance, args)
  return typeof res === 'object' ? res : instance
}

/**
 * 深拷贝
 */
const deepClone = (obj, map = new Map()) => {
  if (!obj instanceof Object) return obj
  if (map.has(obj)) return map.get(obj)
  const res = Array.isArray(obj) ? [] : {}
  map.set(res, obj)
  Object.entries(obj).forEach(([key, value]) => {
    if (!obj.hasOwnProperty(key)) return true
    if (typeof value === 'function') res[key] = value.bind(res)
    if (value.constructor === Object || value.constructor === Array) {
      res[key] = deepClone(value)
    }
    res[key] = value
  })
  return res
}


