/**
 * 反转嵌套数组.
 * [1, [2, [3, null]]] to [3, [2, [1, null]]].
 */
 const arr = [1, [2, [3, null]]]

 const fn = (arr) => {
   const tmp = arr.toString().split(',').filter((i) => i !== '').sort((a, b) => b - a)
   return (function add(){
     const res = []
     res.push(parseInt(tmp.shift()), tmp.length ? add() : null)
     return res
   })()
 }
 
 console.log(fn(arr))