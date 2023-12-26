## 原型继承-构造函数方式

通过调用`new`关键字加函数，也可以创建指定原型对象的对象，其利用了 javascript 的函数对象具有`prototype`属性的特性。这样的函数我们称之为构造函数，变量名约定为 Pascale-Case(帕斯卡大小写)

在遗留代码库中这是一种非常常见的模式，因此值得理解。

```javascript
function Wolf(name) {
  this.name = name;
}
Wolf.prototype.howl = function () {
  console.log(this.name + ": awoooooooo");
};
function Dog(name) {
  Wolf.call(this, name + " the dog");
}
function inherit(proto) {
  function ChainLink() {}
  ChainLink.prototype = proto;
  return new ChainLink();
}
Dog.prototype = inherit(Wolf.prototype);
Dog.prototype.woof = function () {
  console.log(this.name + ": woof");
};
const rufus = new Dog("Rufus");
rufus.woof(); // prints "Rufus the dog: woof"
rufus.howl(); // prints "Rufus the dog: awoooooooo"
```

这和函数方式的原型继承，结果是一样的：

```javascript
Object.getPrototypeOf(rufus) === Dog.prototype; //true
Object.getPrototypeOf(Dog.prototype) === Wolf.prototype; //true
```

要描述完整的原型链：

- `rufus` 的原型是 `Dog.prototype`
- `Dog.prototype` 的原型是 `Wolf.prototype`
- `Wolf.prototype` 的原型是 `Object.protype`。

当调用`new Dog('Rufus')`时，将创建一个新对象`Rufus`。这个新对象也是`Dog`构造函数中的`this`对象。`Dog`构造函数将其传递给`Wolf.call`。

为了继承的目的在“Dog”和“Wolf”之间创建原型链可以通过多种不同的方式执行:

- 在 EcmaScript 5 之前，没有标准的或原生的方法。在示例代码中，创建了一个“inherit”实用函数，它使用一个空的构造函数来创建一个新对象，在这种情况下，原型指向“Wolf.prototype”。
- 在支持 EcmaScript 5+的 JavaScript 运行时中，可以使用“Object.create”函数来达到相同的效果：

```javascript
function Dog(name) {
  Wolf.call(this, name + " the dog");
}
Dog.prototype = Object.create(Wolf.prototype);
Dog.prototype.woof = function () {
  console.log(this.name + ": woof");
};
```

Node.js 有一个实用函数：`util.inherits`，它经常在使用构造函数的代码库中使用：

```javascript
const util = require("util");
function Dog(name) {
  Wolf.call(this, name + " the dog");
}
Dog.prototype.woof = function () {
  console.log(this.name + ": woof");
};
util.inherits(Dog, Wolf);
```

`util.inherits`使用 EcmaScript 2015（ES6）的方法`Object.setPrototypeOf`。它本质上执行以下内容：

```javascript
Object.setPrototypeOf(Dog.prototype, Wolf.prototype);
```

这明确地将`Dog.prototype`的原型对象设置为`Wolf.protype`，放弃了之前的原型。
