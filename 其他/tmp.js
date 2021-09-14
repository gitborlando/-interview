const pro = new Promise((resolve, reject) => {
    const innerpro = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1);
        }, 0);
        console.log(2);
        resolve(3);
    });
    innerpro.then(res => console.log(res));
    resolve(4);
    console.log("pro");
})
pro.then(res => console.log(res));
console.log("end");



var a = 100;
function fn() {
    var b = 30;
    function bar() {
        console.log(a + b);
        console.log(this);
    }
    return bar;
}
var x = fn(), b = 400;
x();



new Promise(resolve => {
    console.log(1);
    resolve();
}).then(() => {
    console.log(4);
})
setTimeout(() => console.log(2), 0);
console.log(3);



function A(x) {
    this.x = x;
}
A.prototype.x = 1;
function B(x) {
    this.x = x;
}
B.prototype = new A(2);
const b = new B(3);
delete b.x;
console.log(b.x);




async function async1() {
    console.log('1');
    await async2();
    console.log('2');
}
async function async2() {
    console.log('3');
    return new Promise((resolve, reject) => {
        resolve();
        console.log('4');
    })
}
console.log('5');
setTimeout(function () {
    console.log('6');
}, 0);
async1();
new Promise(function (resolve) {
    console.log('7');
    resolve();
}).then(function () {
    console.log('8');
}).then(function () {
    console.log('9');
});
console.log('0');

//5170342896



async function async1() {
    console.log('1');
    await async2();
    console.log('2');
}
async function async2() {
    console.log('3');

    return new Promise((resolve, reject) => {
        resolve();
        console.log("4")
    })
}

console.log('5');

setTimeout(function () {
    console.log('6');
}, 0)

async1();

new Promise(function (resolve) {
    console.log('7');
    resolve();
}).then(function () {
    console.log('8');
}).then(function () {
    console.log('9');
});
console.log('0');

//5134708926


async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}

async function async2() {
    console.log('async2')
}

console.log('script start')
setTimeout(function () {
    console.log('setTimeout')
}, 0)

async1();

new Promise(function (resolve) {
    console.log('promise1')
    resolve();
}).then(function () {
    console.log('promise2')
})

console.log('script end')

/**
 * script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
 */