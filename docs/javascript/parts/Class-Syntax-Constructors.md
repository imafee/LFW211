## 原型继承-类语法糖

现代 JavaScript（EcmaScript 2015+）有一个`class`关键字,请不要将其与其他经典 OOP 语言中的`class`关键字混淆。

`class`关键字是语法糖，它实际上创建了一个构造函数（用`new`来调用的函数）。与上一节中讨论的构造函数完全相同。

![Class-Syntax Constructors](/assets/image/05.PrototypalInheritanceClassSyntaxConstructor.png)

这就是为什么它在这里被故意称为“类语法构造器”，因为 EcmaScript 2015（ES6）的`class`语法实际上并没有像大多数其他语言传统上理解的那样促进类的创建。它实际上创建原型链来提供原型继承，而不是经典继承。

在创建原型链时，`class`语法糖确实减少了样板：

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

和上几节的函数式原型继承、函数式构造函数原型继承比起来，是相同的原型链：

```js
Object.getPrototypeOf(rufus) === Dog.prototype; //true
Object.getPrototypeOf(Dog.prototype) === Wolf.prototype; //true
```

要描述完整的原型链：

- `rufus` 的原型是 `Dog.prototype`
- `Dog.prototype` 的原型是 `Wolf.prototype`
- `Wolf.protype` 的原型是 `Object.protype`。

`extends`关键字使原型继承更加简单。在示例代码中，`class Dog extends Wolf will`确保`Dog.prototype`的原型将是`Wolf.protype`

每个`class`中的`constructor`方法等效于 constructor function 的函数体。例如，函数`Wolf（name）{this.name ＝ name｝`与类`Wolf（constructor（name）｛this.name=name｝｝`相同。

`Dog`类`constructor`方法中的`super`关键字是在将 this 关键字设置为当前 instance 时调用父类构造函数的通用方法。在构造函数函数示例中，`Wolf.call(this，"name+"the dog")`相当于此处的`super(name+"the dogs")`。

在`class`中定义的除 constructor 以外的普通方法都被添加到 class 语法创建的函数的`prototype`对象中，static 方法会添加到对象本身。

让我们再来看看`Wolf`类：

```js
class Wolf {
  constructor(name) {
    this.name = name;
  }
  howl() {
    console.log(this.name + ": awoooooooo");
  }
  static introduce() {
    console.log("I am a wolf");
  }
}
```

转译成构造函数：

```js
function Wolf(name) {
  this.name = name;
}
Wolf.prototype.howl = function () {
  console.log(this.name + ": awoooooooo");
};
Wolf.introduce = function () {
  console.log("I am a wolf");
};
```

当涉及到创建原型链时，基于类语法的方法是 JavaScript 的最新添加，但已经被广泛使用。
