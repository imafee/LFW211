## 闭包

当创建一个函数时，会顺带创建一个不可见的对象，它被称为闭包。函数中创建的参数和变量存储在这个不可见的对象上。
当一个函数位于另一个函数内部时，它可以访问自己的闭包和外部函数的闭包：

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

由于不可见的闭包不能在函数之外访问，因此如果函数返回函数，则返回的函数可以提供对父闭包作用域的受控访问。本质上，这提供了私有状态的封装：

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

在这个例子中，所有的状态都是从返回的函数返回的，但这个模式可以用于更多的功能。例如，init 函数可以提供类型验证，根据类型返回不同的函数。

使用闭包封装状态的另一个示例是封装一个秘钥：

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

闭包也可以用作原型继承的替代方案。
以下示例提供了与三个原型继承示例相同的功能和可组合性级别，但它不使用原型链，也不依赖于隐式 this 关键字：

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

这里没有建立原型链，“rufus”的原型是 Object.prototype，仅此而已。状态（名称）包含在闭包范围中，不在实例化对象上公开，它被封装为私有状态。

使用闭包来组合对象的优点：它消除了原型、上下文（this）的复杂性，以及用 new 调用函数的需要——如果省略，可能会产生意想不到的后果。
使用闭包的缺点：在多个实例之间共享原型方法的情况下，使用闭包的方法要求每个实例创建内部函数。
然而，JavaScript 引擎内部使用越来越复杂的优化技术，对于任何给定的用例来说，速度足够快才是重要的，人机工程学和可维护性应该优先于 JavaScript 引擎中每一个不断变化的性能特征。因此，建议在原型继承上使用函数组合，并在稍后进行优化（如果需要）。
