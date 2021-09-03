// 作用域链和this指向
var inner = 'window';
​
function say() {
    console.log(inner)
    console.log(this.inner)
};
​
var obj1 = (function() {
    var inner = '1-1'
    return {
        inner: '1-2',
        say: function() {
            console.log(inner)
            console.log(this.inner)
        }
    }
})();
​
var obj2 = (function() {
    var inner = '2-1'
    return {
        inner: '2-2',
        say: () => {
            console.log(inner)
            console.log(this.inner)
        }
    }
})()
​
​
say()      
obj1.say()
obj2.say()
obj1.say = say
obj1.say()
obj1.say = obj2.say
obj1.say()
