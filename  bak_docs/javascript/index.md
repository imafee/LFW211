# 05. KEY JAVASCRIPT CONCEPTS

[lab](/javascript/lab) | [check](/javascript/check)

## 章节概述

在当代流行语言中，JavaScript 有一些不同寻常的特点。无论是前端开发还是后端工程，理解和运用这些特性对于利用语言的力量并在中高级水平上提高生产力至关重要。本节并不打算涵盖整个 JavaScript 语言，因此需要独立课程。除了第 8 节中介绍的异步执行之外，本节的重点是理解该语言的关键基础知识。

## 学习目标

在本章结束时，您应该能够：

- 了解 JavaScript 中的数据类型。
- 解释为啥函数作为一等公民。
- 解释闭包作用域在状态管理中的作用。
- 描述基于 JavaScript 继承的原型性质。

## 数据类型

JavaScript 是一种松散类型的动态语言。在 JavaScript 中有七种原始类型（primitive ttype）。其他一切都是对象（包括函数和数组）。

JavaScript 原始类型如下（冒号右侧为对应的值）：

- Null: [null],语义描述对象的不存在
- Undefined: [undefined],没有定义的值。任何初始化时没有值的变量都将是“未定义的”，任何表达式试图访问对象上不存在的属性时都将得到“未定义”，没有“return”关键词或者光有“return”关键词的语句都将返回“未定义”。
- Number: [1, 1.5, -1e4, NaN]，双精度浮点格式。它允许整数和小数，但整数范围为[-2**53-1 , 2**53-1]。适用于一般的浮点数运算,精度有限制。
- BigInt: [1n, 9007199254740993n]，只能表示整数不能表示小数，字面量写成数字后面带个 n(比如 1n），没有最大精度限制。适用于操作大整数,不用担心丢失精度。
- String: ['str', "str", `str ${var}]，字符串可以用单引号、双引号或反引号创建,前两者只能使用加号运算符(+)连接在一起，而后者的模版字符串可以是多行书写且支持插值更加强大。
- Boolean: [true, false]
- Symbol: [Symbol('description'), Symbol.for('namespace')]，符号可以用作对象中的唯一标识符。`Symbol.for` 方法创建/获取全局符号。

JavaScript 中除此以外的所有其他内容都是一个对象。对象是一组键值对，键又称为属性，值可以是任何类型。比如，嵌套数据结构的对象：

```js
const obj = { myKey: { thisIs: "a nested object" } };
console.log(obj.myKey);
```

原型是对在属性查找中查询的另一个对象的隐式引用。如果对象没有特定的属性，则会检查对象的原型是否具有该属性。如果对象的原型不具有该属性，则会检查对象原型的原型，依此类推。这就是 JavaScript 中继承的工作原理，JavaScript 是一种原型语言。本节稍后将对此进行更详细的探讨。

## 函数

函数在 JavaScript 中是一等公民。函数是一个对象，因此是一个可以像任何其他值一样使用的值，例如：

1，作从函数的返回值：

```js
function factory() {
  return function doSomething() {};
}
```

2，作为参数传递给另一个函数：

```js
setTimeout(function () {
  console.log("hello from the future");
}, 100);
```

3，指定为对象的属性：

```js
const obj = {
  id: 999,
  fn: function () {
    console.log(this.id);
  },
};
obj.fn(); // prints 999
```

当一个函数被分配给一个对象时，当在该函数中访问隐含的 **this** 关键字时，它将引用调用该函数的对象。这就是`obj.fn（）`输出 999 的原因。

理解**this**指的是调用函数的对象，而不是函数被分配给的对象，这一点至关重要：

```javascript
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

obj 和 obj2 都引用同一个函数，但每次调用时，**this**上下文都会更改为调用该函数的对象。

函数有一个**call**方法，可用于设置其**this**上下文对象：

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

在这个例子中，fn 函数没有分配给任何对象，“this”是通过“call”函数动态设置的。

我们继续往下，聊聊箭头函数(**=>**)，它也称为 lambda 函数：

如果定义时不带大括号，则箭头（`=>`）后面的表达式是函数的返回值。Lambda 函数没有它们自己的**this**上下文，

当函数内部引用“this”时，它指的是离得最近的非 lambda 父函数的**this**。

```js
globalThis.id = 0;
const id = 1;
const obj = {
  id: "obj",
  foo: () => {
    console.log(this.id); // 定义时的外层对象是globalThis
  },
};

obj.foo();
```

虽然普通函数有原型属性（稍后将详细讨论），但**箭头函数没有原型属性**：

```javascript
function normalFunction() {}
const fatArrowFunction = () => {};
console.log(typeof normalFunction.prototype); // prints 'object'
console.log(typeof fatArrowFunction.prototype); // prints "undefined"
```

## 原型继承（功能）

在基本层面上，JavaScript 中的继承是通过原型链实现的。随着语言的更新带来了新的功能和语法，创建原型链的方法随着时间的推移发生了显著的变化。

在 JavaScript 中创建原型链有很多方法和变体，但我们将探讨三种常见方法：

- 功能性的(也就是本节)
- 构造函数(下一节)
- 类语法构造函数(下下节)

为了这些例子的目的，我们将使用 wolf 和 dog 的分类法，其中 wolf 是 dog 的原型。

创建原型链的功能方法是使用`Object.create`：

```javascript
const wolf = {
  howl: function () {
    console.log(this.name + ": awoooooooo");
  },
};
const dog = Object.create(wolf, {
  woof: {
    value: function () {
      console.log(this.name + ":woof");
    },
  },
});
const rufus = Object.create(dog, {
  name: { value: "Rufus the dog" },
});
rufus.woof(); // prints "Rufus the dog: woof"
rufus.howl(); // prints "Rufus the dog: awoooooooo"
```

`wolf`对象是一个普通的 JavaScript 对象，使用对象字面语法（即使用大括号）创建， 默认情况下对象的原型是“Object.prototype”

`Object.create`函数可以接受两个参数,第一个参数是所创建对象的所需原型。

当 dog 对象被实例化时，传递给`object.create`的第一个参数是 wolf 对象。所以狼是狗的原型。当 rufus 被实例化时，Object.create 的第一个参数是 dog。
要描述完整的原型链：

- rufus 的原型是 dog
- dog 的原型是 wolf
- wolf 的原型是 Object.prototype。

“Object.create”的第二个参数是可选的 Properties Descriptor 对象。

Properties Descriptor 对象包含的键将成为正在创建的对象的键名。这些键的值是属性描述符对象。

属性描述符是一个 JavaScript 对象，用于描述另一个对象上属性的特性。

“Object.getOwnPropertyDescriptor”可用于获取任何对象的属性描述符：

![descriptor](/assets/image/05.PrototypalInheritanceFunctional.descriptor.png)
为了描述属性的值，描述符可以使用“value”作为普通属性值，也可以使用“get”和“set”来创建属性 getter/setter。其他属性是该属性的关联元数据。“可写”属性决定是否可以重新分配该属性，“可枚举”决定是否枚举该属性，在“Object.keys”和“可配置”等属性迭代器抽象中，设置属性描述符本身是否可以更改。所有这些元数据键都默认为“false”。

在“dog”和“rufus”的情况下，属性描述符只设置“value”，它添加了一个不可枚举、不可写、不可配置的属性。

属性描述符与原型继承不直接相关，而是“Object.create”接口的一部分，因此理解它们是必要的。要了解更多信息，请阅读 MDN 网络文档 Mozilla 网站上的“说明”部分。

创建“dog”原型对象时，属性描述符是一个带有“woof”键的对象。“woof”键引用的对象的“value”属性设置为函数。这将导致使用“woof”方法创建对象。

因此，当调用“rufus.woof（）”时，“rufus”对象本身没有“woof”属性。

然后运行时将检查“rufus”的原型对象是否具有“woof”属性。“rufus”的原型是狗，它确实有“汪汪”的特性。“dog.woof”函数包含对此的引用。通常，this 关键字指的是调用该方法的对象。由于'wuf'是在'rufus'上调用的，并且'rufus`的 name 属性为“rufus the dog'”，因此'woof'方法中的 this.name 属性的值为“Rufos the dog”，因此 console.log 会传递字符串：“rufus the dog:woof'”。

类似地，当调用`rufus.howl`时，JavaScript 运行时会执行以下步骤：

- 检查`rufus`是否具有`howl`属性； 它不是
- 检查 `rufus` 的原型（即 `dog`）是否具有 `howl` 属性； 它不是
- 检查`dog`的原型（即`wolf`）是否具有`howl`属性； 确实如此
- 执行`howl`函数，将`this`设置为`rufus`，因此 this.name 将为“`Rufus the dogs`”。

为了完成适用于原型继承的功能范式，狗的实例的创建可以用一个函数进行泛型：

```javascript
const wolf = {
  howl: function () { console.log(this.name + ': awoooooooo') }
}
const dog = Object.create(wolf, {
  woof: { value: function() { console.log(this.name + ':
woof') } } })
function createDog (name) {
  return Object.create(dog, {
    name: {value: name + ' the dog'}
  })
}
const rufus = createDog('Rufus')
rufus.woof() // prints "Rufus the dog: woof"
rufus.howl() // prints "Rufus the dog: awoooooooo"
```

可以使用“object.getPrototypeOf”检查对象的原型：

```javascript
console.log(Object.getPrototypeOf(rufus) === dog); //true
console.log(Object.getPrototypeOf(dog) === wolf); //true
```

## 原型继承（构造函数）

通过调用带有“new”关键字的函数，也可以创建具有特定原型对象的对象。在遗留代码库中，这是一种非常常见的模式，因此值得理解。

所有函数都具有“prototype”属性。构造函数创建原型链的方法是在函数的原型对象上定义属性，然后用“new”调用该函数：

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

这将设置与功能原型继承示例中相同的原型链：

```javascript
console.log(Object.getPrototypeOf(rufus) === Dog.prototype); //true
console.log(Object.getPrototypeOf(Dog.prototype) === Wolf.prototype); //true
```

“Wolf”和“Dog”函数的首字母大写。对于打算用“new”调用的函数，建议使用 PascaleCase 是惯例。

请注意，在“Wolf.prototype”中添加了一个“howle”方法，而从未实例化对象并将其分配给“Wolf.prototype”。这是因为它已经存在，因为每个函数都有一个预先存在的“prototype”对象。但是“Dog.prototype”是显式分配的，覆盖了以前的 Dog.prototype 对象。

要描述完整的原型链：

- rufus 的原型是 Dog.prototype`
- Dog.prototype 的原型是 Wolf.prototype`
- Wolf.prototype 的原型是 Object.protype。

当调用“new Dog（'Rufus'）”时，将创建一个新对象（'Rufus'）。这个新对象也是“Dog”构造函数中的“this”对象。“Dog”构造函数将其传递给“Wolf.call”。

对函数使用“call”方法可以通过传递给“call”的第一个参数来设置被调用函数的“this”对象。因此，当它被传递给“Wolf.call”时，新创建的对象（最终被分配给“rufus”）也会通过

“Wolf”构造函数中的“this”对象。所有后续参数都已通过

到“call”成为函数自变量，因此传递给“Wolf”的“name”自变量是“Rufus the dog”。“Wolf”构造函数将“this.name”设置为“Rufus The dog”，这意味着最终“Rufus.name”将设置为“Rufus The dog”。

在遗留代码库中，为了继承的目的在“Dog”和“Wolf”之间创建原型链可以通过多种不同的方式执行。在 EcmaScript 5 之前，没有标准的或原生的方法。

在示例代码中，创建了一个“inherit”实用函数，它使用一个空的构造函数来创建一个新对象，在这种情况下，原型指向“Wolf.prototype”。

在支持 EcmaScript 5+的 JavaScript 运行时中，可以使用“Object.create”函数来达到相同的效果：

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

在当代 Node.js 中，`util.inherits`使用 EcmaScript 2015（ES6）

方法`Object.setPrototypeOf`。它本质上执行以下内容：

```javascript
Object.setPrototypeOf(Dog.prototype, Wolf.prototype);
```

这明确地将“Dog.prototype”的原型设置为“Wolf.protype”，放弃了之前的原型。

## 原型继承（Class 语法）

现代 JavaScript（EcmaScript 2015+）有一个“class”关键字。重要的是不要将其与其他经典 OOP 语言中的“class”关键字混淆。

“class”关键字是语法糖，它实际上创建了一个函数。具体来说，它创建了一个应该用“new”调用的函数。它创建了一个构造函数，与上一节中讨论的构造函数完全相同。

![Class-Syntax Constructors](/assets/image/05.PrototypalInheritanceClassSyntaxConstructor.png)

这就是为什么它在这里被故意称为“类语法构造器”，因为 EcmaScript 2015（ES6）的“类”语法实际上并没有像大多数其他语言传统上理解的那样促进类的创建。它实际上创建原型链来提供原型继承，而不是经典继承。

在创建原型链时，“class”语法糖确实减少了样板：

```js
class Wolf {
  constructor(name) {
    this.name = name;
  }
  howl() {
    console.log(this.name + ": awoooooooo");
  }
}
class Dog extends Wolf {
  constructor(name) {
    super(name + " the dog");
  }
  woof() {
    console.log(this.name + ": woof");
  }
}
const rufus = new Dog("Rufus");
rufus.woof(); // prints "Rufus the dog: woof"
rufus.howl(); // prints "Rufus the dog: awoooooooo"
```

这将设置与功能原型继承和功能构造函数原型继承示例中相同的原型链：

```js
console.log(Object.getPrototypeOf(rufus) === Dog.prototype); //true
console.log(Object.getPrototypeOf(Dog.prototype) === Wolf.prototype); //true
```

要描述完整的原型链：

- rufus 的原型是 Dog.prototype`
- Dog.prototype 的原型是 Wolf.prototype`
- Wolf.protype 的原型是 Object.protype。

“extends”关键字使原型继承更加简单。在示例代码中，“class Dog extends Wolf will”确保“Dog.prototype”的原型将是“Wolf.protype”。

每个“class”中的“constructor”方法等效于 constructor function 的函数体。例如，“函数 Wolf（name）{this.name ＝ name｝”与“类 Wolf（constructor（name）｛this.name=name｝｝”相同。

“Dog”类“constructor”方法中的“super”关键字是在将“this”关键字设置为当前“instance”时调用父类构造函数的通用方法。在构造函数函数示例中，“Wolf.call”（“this”，“name”+“the dog”）相当于此处的“super”（“name”+“the dogs”）。

在“class”中定义的除“constructor”以外的任何方法都被添加到“class”语法创建的函数的“prototype”对象中。

让我们再来看看“Wolf”类：

```js
class Wolf {
  constructor(name) {
    this.name = name;
  }
  howl() {
    console.log(this.name + ": awoooooooo");
  }
}
```

这是为了：

```js
function Wolf(name) {
  this.name = name;
}
Wolf.prototype.howl = function () {
  console.log(this.name + ": awoooooooo");
};
```

当涉及到创建原型链时，基于类语法的方法是 JavaScript 的最新添加，但已经被广泛使用。

## 闭包作用域

当一个函数被创建时，一个不可见的对象也被创建，这被称为闭包范围。函数中创建的参数和变量存储在这个不可见的对象上。

当一个函数位于另一个函数内部时，它可以访问自己的闭包范围和外部函数的父闭包范围：

```js
function outerFn() {
  var foo = true;
  function print() {
    console.log(foo);
  }
  print(); // prints true
  foo = false;
  print(); // prints false
}
outerFn();
```

调用内部函数时会访问外部变量，这就是为什么在 foo 更新为 false 后，第二个 print 调用会输出 false。

如果存在命名冲突，则对最近闭包作用域的引用优先：

```js
function outerFn() {
  var foo = true;
  function print(foo) {
    console.log(foo);
  }
  print(1); // prints 1
  foo = false;
  print(2); // prints 2
}
outerFn();
```

在这种情况下，print 的 foo 参数会覆盖 outerFn 函数中的 foo 变量。

不能在函数之外访问闭包范围：

```js
function outerFn() {
  var foo = true;
}
outerFn();
console.log(foo); // will throw a ReferenceError
```

由于不可见的闭包作用域对象不能在函数之外访问，因此如果函数返回函数，则返回的函数可以提供对父闭包作用域的受控访问。本质上，这提供了私有状态的封装：

```js
function init(type) {
  var id = 0;
  return (name) => {
    id += 1;
    return { id: id, type: type, name: name };
  };
}
const createUser = init("user");
const createBook = init("book");
const dave = createUser("Dave");
const annie = createUser("Annie");
const ncb = createBook("Node Cookbook");
console.log(dave); //prints {id: 1, type: 'user', name: 'Dave'}
console.log(annie); //prints {id: 2, type: 'user', name: 'Annie'}
console.log(ncb); //prints {id: 1, type: 'book', name: 'Node Cookbook'}
```

init 函数在其作用域中设置一个 id 变量，接受一个名为 type 的参数，然后返回一个函数。返回的函数可以访问类型和 id，因为它可以访问父闭包作用域。请注意，在这种情况下返回的函数是一个胖箭头函数。闭包范围规则以完全相同的方式应用于胖箭头函数。

init 函数被调用两次，生成的函数被分配给 createUser 和 createBook。这两个函数可以访问 init 函数闭包作用域的两个独立实例。dave 和 annie 对象是通过调用 createUser 来实例化的。

对 createUser 的第一个调用返回一个 id 为 1 的对象。id 变量初始化为 0，并在创建和返回对象之前递增 1。对 createUser 的第二个调用返回一个 id 为 2 的对象。这是因为 createUser 的第一次调用已经将 id 从 0 增加到 1，所以在下次调用 createUser 时，id 将从 1 增加到 2。然而，对 createBook 函数的唯一调用返回的 id 为 1（而不是 3），因为 createBook 函数是从 init 返回的函数的不同实例，因此访问 init 函数作用域的单独实例。

在这个例子中，所有的状态都是从返回的函数返回的，但这个模式可以用于更多的功能。例如，init 函数可以提供类型验证，根据类型返回不同的函数。

使用闭包范围封装状态的另一个示例是封装一个秘密：

```js
function createSigner(secret) {
  const keypair = createKeypair(secret);
  return function (content) {
    return {
      signed: cryptoSign(content, keypair.privateKey),
      publicKey: keypair.publicKey,
    };
  };
}
const sign = createSigner("super secret thing");
const signedContent = sign("sign me");
const moreSignedContent = sign("sign me as well");
```

注意，在这段代码中，createKeypair 和 cryptoSign 是虚构的函数，它们纯粹是为了概述秘密封装的概念。

闭包作用域也可以用作原型继承的替代方案。以下示例提供了与三个原型继承示例相同的功能和可组合性级别，但它不使用原型链，也不依赖于隐式 this 关键字：

```js
function wolf(name) {
  const howl = () => {
    console.log(name + ": awoooooooo");
  };
  return { howl: howl };
}
function dog(name) {
  name = name + " the dog";
  const woof = () => {
    console.log(name + ": woof");
  };
  return {
    ...wolf(name),
    woof: woof,
  };
}
const rufus = dog("Rufus");
rufus.woof(); // prints "Rufus the dog: woof"
rufus.howl(); // prints "Rufus the dog: awoooooooo"
```

“dog”的 return 语句中的三个点（…）称为排列运算符。排列操作符将特性从它前进的对象复制到正在创建的对象中。

“wolf”函数返回一个对象，并为其分配了“howle”函数。然后，该对象被扩展（使用…）到从“dog”函数返回的对象中，因此“howel”被复制到该对象中。从“dog”函数返回的对象也分配了一个“woof”函数。

这里没有建立原型链，“rufus”的原型是 Object.prototype，仅此而已。状态（名称）包含在闭包范围中，不在实例化对象上公开，它被封装为私有状态。

“dog”函数接受一个 name 参数，并立即将其重新分配为 name+“The”dog“。在“dog”内部创建了一个 woof 函数，它引用名称。

woof 函数是从对象内部的“dog”函数返回的，作为 woof 属性。所以当“rufus.woof“（）”被称为“woof”从其父作用域访问名称，即“dog”的闭包作用域。同样的事情也发生在“wolf”函数中。当“rufus”如果调用了“howle（）”，则“howle”函数访问“wolf”函数范围内的 name 参数。

使用闭包范围来组合对象的优点是，它消除了原型、上下文（this）的复杂性，以及用 new 调用函数的需要——如果省略，可能会产生意想不到的后果。缺点是，在多个实例之间共享原型方法的情况下，使用闭包范围的方法要求每个实例创建内部函数。然而，JavaScript 引擎内部使用越来越复杂的优化技术，对于任何给定的用例来说，速度足够快才是重要的，人机工程学和可维护性应该优先于 JavaScript 引擎中每一个不断变化的性能特征。因此，建议在原型继承上使用函数组合，并在稍后进行优化（如果需要）。
