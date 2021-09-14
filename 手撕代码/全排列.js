/**
 * 全排列
 */
const permute = (arr) => {
  const results = [];
  (function f(array, result) {
    if (array.length === 0) {
      results.push(result)
    }
    else {
      array.forEach((item) => {
        f(array.filter(i => i !== item), [...result, item])
      })
    }
  })(arr, [])
  return results
}

console.log(permute([1, 2, 3]))

/**
 * repeat
 * @description repeat(console.log, 4, 3000)函数实现；
 */
const repeat = (fn, time, delay) => {
  return (...args) => {
    for(let i = 0; i < time; i++){
      setTimeout(() => {
        fn(...args)
      }, delay * (i + 1));
    }
  }
}

const r = repeat(console.log, 4, 3000)
r(123)

/**
 * 跳台阶
 */
const jump = (step) => {
  if(step === 1 || step === 2) return step
  return jump(step - 1) + jump(step - 2)
}

console.log(jump(5))


/**
 * indexOf
 */
function indexOf(arr, item){
  var index
  arr.forEach((each, i) => {
    if(each === item) index = i
  })
  return index
}

console.log(indexOf([1,2,3,4,5], 3))