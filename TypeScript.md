### Typescript

#### type 和 interface 的区别

- type 可以声明联合类型, 元组类型和类型别名
- interface 可以合并类型
- type 声明的语句可以使用 typeof 来获取一个变量的类型

#### never 和 void 区别

- void 表示没有任何类型, 声明为 void 的变量只能付给 null 和 undefined
- never 表示值永远不存在的类型, 一般一个函数里面有个死循环或者要抛出错误, 那这个函数的返回值就是 never 类型, 同时, 任何类型的变量都不能赋给 never 类型

#### any 和 unkown 的区别

- any 是表示一个变量可以为任何类型, 就是一个变量一下子可以是个字符串, 一下子又是个数字
- 而 unkown 则表示一个变量从始至终都是一个类型, 只是目前还不能确定他到底是属于哪种类型

#### 泛型

- 泛型约束
- 泛型函数
- 泛型类

