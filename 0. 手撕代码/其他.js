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

/**
 * 防抖 
 */
const debounce = (func, delay) => {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

/**
 * 节流
 */
const throttle = (func, delay) => {
  let flag = false
  return (...args) => {
    if (flag) return
    flag = true
    setTimeout(() => {
      func(...args)
      flag = false
    }, delay)
  }
}

/**
 * AJAX
 */
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

/**
 * 防抖 
 */
const debounce = (func, delay) => {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

/**
 * 节流
 */
const throttle = (func, delay) => {
  let flag = false
  return (...args) => {
    if (flag) return
    flag = true
    setTimeout(() => {
      func(...args)
      flag = false
    }, delay)
  }
}

/**
 * AJAX
 */
const myAjax = (type, url, data) => {
  return Promise((resolve, reject) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, val]) => {
      formData.append(key, val)
    })
    const xhr = new XMLHttpRequest()
    xhr.open(type, url, true)
    xhr.onreadystatechange(){
      if (this.readyState === 4 &&
        this.status > 200 &&
        this.status < 300) {
        resolve(this.responseText)
      } else {
        reject('请求出错')
      }
    }
    xhr.send(formData)
  })
}

/**
 * call
 */
Function.prototype.myCall = function (obj, ...args) {
  obj = obj.constructor !== {}.constructor ? window : obj
  obj.func = this
  const res = obj.func(...args)
  delete obj.func
  return res
}

