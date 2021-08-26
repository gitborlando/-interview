/**
 * 手撕拍平
 */
const arr = [1, [2, 3, [4, 5], 6], [7, 8]]

/** 拍平1 */
const flat1 = (arr) => {
    const res = []
    for (const i of arr.toString().split(',')) {
        if (!/\d/.test(i) || /\D/.test(i)) continue
        res.push(parseInt(i))
    }
    return res
}

console.log(flat1(arr))

/** 拍平2 */
const arr = [1, [2, 3, [4, 5], 6], [7, 8]]

const flat2 = (arr) => {
    let res = []
    arr.forEach((i) => Array.isArray(i) ? res.push(...flat2(i)) : res.push(i))
    return res
}

console.log(flat2(arr))


