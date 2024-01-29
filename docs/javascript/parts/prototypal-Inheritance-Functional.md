## 原型继承-函数方式

从根本上说，JavaScript 中的继承是通过原型链来实现的。 随着语言的更新带来了新的功能和语法，创建原型链的方法发生了显着的变化。  
在 JavaScript 中创建原型链有多种方法和变体，我们只探讨三种常见方法：

- 函数式(Functional Approach)，我们使用函数来创建对象并设置其原型。(也就是本节)
- 构造函数(Constructor Functions),通过定义一个构造函数来描述实例的属性和方法，然后使用 new 来实例化以及链接原型对象(下一节)
- 类语法构造器(Class-Syntax Constructors)(下下节),同样是创建对象和管理原型链。没有提供新特性，仅仅是提供了一种更接近传统的面向对象语言的语法(故称语法糖)。

出于示例的目的，我们将使用`狼`和`狗`分类法，其中`狼`是`狗`的原型。

```javascript
const wolf = {
  // 嚎叫
  howl: function () {
    console.log(this.name + ": awoooooooo");
  },
};
// dog以wolf为原型
const dog = Object.create(wolf, {
  // 吠叫
  woof: {
    value: function () {
      console.log(this.name + ":woof");
    },
  },
});
// rufus以dog为原型
const rufus = Object.create(dog, {
  name: { value: "Rufus the dog" },
});
rufus.woof(); // prints "Rufus the dog: woof"
rufus.howl(); // prints "Rufus the dog: awoooooooo"
```

`wolf`对象是一个普通的 JavaScript 对象，使用对象字面语法（即大括号）创建， 默认情况下对象的原型是`Object.prototype`

`Object.create`函数可以接受两个参数:

1.  所创建对象的所需原型
1.  Properties-Descriptor 对象（可选）

我们设计了这样的原型链：

- rufus 的原型是 dog
- dog 的原型是 wolf
- wolf 的原型是 Object.prototype。

`Object.getOwnPropertyDescriptor`用于获取任何对象的属性描述符：

![descriptor](/assets/image/05.PrototypalInheritanceFunctional.descriptor.png)

描述符对象数据结构如下：

- `value` 用来创建初始的原始类型的值
- `get`和`set` 用来创建属性 getter/setter
- `writable` 属性决定是否可以重新分配该属性
- `enumerable` 属性决定是否枚举该属性
- `configurable` 属性的增删权限

使用属性描述符创建的属性的所有元数据默认为`false`，而使用字面量创建的属性的所有元数据默认为`true`

因此，`dog`和`rufus`在只设置了`value`键情况下，是不可枚举、不可写、不可配置的。

当调用`rufus.howl`时，JavaScript 运行时会执行以下步骤：

- 检查`rufus`是否具有`howl`属性； 它不是
- 检查 `rufus` 的原型（即 `dog`）是否具有 `howl` 属性； 它不是
- 检查`dog`的原型（即`wolf`）是否具有`howl`属性； 确实如此
- 执行`howl`函数，将`this`设置为`rufus`，因此 this.name 将为“`Rufus the dogs`”。

为了完成适用于原型继承的功能[范式](#paradigms)，狗实例的创建可以用一个函数进行[泛型](#generics)：

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
function createDog(name) {
  return Object.create(dog, {
    name: { value: name + " the dog" },
  });
}
const rufus = createDog("Rufus");
rufus.woof(); // prints "Rufus the dog: woof"
rufus.howl(); // prints "Rufus the dog: awoooooooo"
```

最后使用`object.getPrototypeOf`检查对象的原型：

```javascript
Object.getPrototypeOf(rufus) === dog; //true
Object.getPrototypeOf(dog) === wolf; //true
```
