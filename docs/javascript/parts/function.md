## 函数

函数在 JavaScript 中被称为“一等公民”，因为：

- 人无我有的特权
  - 函数作用域和闭包
  - this (上下文对象)绑定
  - 箭头函数表达式
- 人人享有的权利
  - 作为值来存储
  - 被赋值给变量
  - 在函数中当作实参
  - 在函数中当作返回值
  - 对象属性
  - 对象的原型和继承

举例子：作为函数的`返回值`：

```js
function factory() {
  return function doSomething() {};
}
```

举例子：作为`参数`传递给另一个函数：

```js
setTimeout(function () {
  console.log("hello from the future");
}, 100);
```

举例子：指定为对象的`属性`：

```js
const obj = {
  id: 999,
  fn: function () {
    console.log(this.id);
  },
};
obj.fn(); // prints 999
```

函数被分配给一个对象后，该函数中访问 `this` 关键字时，它将调用引用该函数的对象。这就是`obj.fn（）`输出 999 的原因。

了解了`this`指的是调用函数的对象，而不是函数被分配给的对象，这一点至关重要：

```js
const obj = {
  id: 1,
  fn: function () {
    console.log(this.id);
  },
};
const obj2 = { fn: obj.fn };
obj.fn(); // prints 1
obj2.fn(); // undefined,调用者自身属性中没有id键
obj2.id = 2; // 新建键值对
obj2.fn(); // prints 2
```

上面的 obj 和 obj2 都引用同一个函数，但每次调用时，`this`上下文会更改为调用该函数的对象。

如何更改上下文对象呢？函数有一个`call`方法，可用于设置其`this`上下文对象：

```javascript
function fn() {
  console.log(this.id);
}
const obj = { id: 1 };
const obj2 = { id: 2 };
fn.call(obj); // prints 1，this上下文对象设置为obj
fn.call(obj2); // prints 2，this上下文对象设置为obj2
fn.call({ id: ":)" }); // prints :)，this上下文对象设置为该字面量对象
```

在上面的例子中，fn 函数没有分配给任何对象， `this`是通过`call`函数动态设置的。

接下来，我们来聊聊箭头函数(也称为 lambda 函数)：

如果定义时箭头后面不带大括号`()=>expression`，则箭头后面的表达式是函数的返回值。
**Lambda 函数没有它们自己的`this`上下文**，当函数内部引用“this”时，它指的是对象被定义位置开始离得最近的（非 lambda 父函数的）`this`。

```js
globalThis.id = 0;
const id = 1;
const obj = {
  id: "obj",
  foo: () => {
    console.log(this.id); // 从定义foo的位置往外找，代码在运行时离得最近的上下文对象(this)是globalThis
  },
};

obj.foo(); // 0, globalThis.id === 0
```

虽然普通函数有原型属性（稍后将详细讨论），但**箭头函数没有原型属性**：

```javascript
function normalFunction() {}
const fatArrowFunction = () => {};
console.log(typeof normalFunction.prototype); // prints 'object'
console.log(typeof fatArrowFunction.prototype); // prints "undefined"
```
