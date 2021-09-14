/**
 * 反转嵌套数组.toString法
 * [1, [2, [3, null]]] to [3, [2, [1, null]]].
 */
const arr = [1, [2, [3, null]]]

const fn = (arr) => {
  const tmp = arr.toString().split(',').filter(i => !!i).reverse()
  return (function add() {
    const res = []
    res.push(parseInt(tmp.shift()), tmp.length ? add() : null)
    return res
  })()
}

console.log(fn(arr))

/**
 * concat法, 兼容更多类型
 */
const arr = [1, [true, [3, null]]]

const fn = (arr) => {
  while (arr.some((i) => Array.isArray(i))) {
    arr = [].concat(...arr)
  }
  arr.pop()
  arr = arr.reverse()
  return (function add() {
    const res = []
    res.push(arr.shift(), arr.length ? add() : null)
    return res
  })()
}

console.log(fn(arr))

