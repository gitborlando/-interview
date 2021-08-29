/**
 * 1. toString 法.
 * Array.toString() 会将数组的每一项都调用 toString 方法.
 */
const arr = [1, 2, 3, /**{toString(){return 'abc'}}, */[4, 5], 6, [7, [8, 9]], 10]

const flat = (arr) => {
    /**
     * return arr.toString()//.split(',').map((i)=>parseInt(i))
     */
    return arr.toString().split(',').map((i) => parseInt(i))
}

console.log(flat(arr))

/**
 * 2. toString 法.
 * 当数组有空项或其他非数字时.
 */
const arr = [1, 2, 3, , '', [4, 5], 6, [7, [8, 9]], 10]

const flat = (arr) => {
    const isNumber = (i) => /\d/.test(i) && !/\D/.test(i)
    return arr.toString().split(',').filter(isNumber).map((i) => parseInt(i))
}

console.log(flat(arr))

/**
 * 3. 递归法.
 */
const arr = [1, 2, 3, , '', [4, 5], 6, [7, [8, 9]], 10]

const flat = (arr) => {
    let res = []
    arr.forEach((i) => {
        if (Array.isArray(i)) {
            res.push(...flat(i))
        } else {
            if (/\d/.test(i) && !/\D/.test(i)) res.push(i)
        }
    })
    return res
}

console.log(flat(arr))

/**
 * concat法
 */
 const arr = [1, 2, 3, , '', [4, true], 6, [7, [() => console.log(8), 9]], 10]

const flat = (arr) => {
    while(arr.some((i) => Array.isArray(i))){
        arr = [].concat(...arr)
    }
    return arr
}

flat(arr)[9]()

