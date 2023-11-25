# 05. KEY JAVASCRIPT CONCEPTS

[lab](/javascript/lab) | [check](/javascript/check)

## Chapter Overview

Among contemporary popular languages, JavaScript has some unusual characteristics. Whether it's frontend development or backend engineering, understanding and wielding these characteristics is essential to harnessing the power of the language and being productive at an intermediate to upper-intermediate level. This section does not set out to cover the entire JavaScript language, for that a separate course would be necessary. With the exception of asynchronous execution which is covered in Section 8, this section focuses on understanding key fundamentals of the language.

## Learning Objectives

By the end of this chapter, you should be able to:

- Understand data types in JavaScript.
- Explain functions as first class citizens.
- Explain the role of closure scope in state management.
- Describe the prototypal nature of all JavaScript-based inheritance.

## Data Types

JavaScript is a loosely typed dynamic language. In JavaScript there are seven primitive types. Everything else, including functions and arrays, is an object.
JavaScript primitives are as follows:

- Null: null
- Undefined: undefined
- Number: 1, 1.5, -1e4, NaN
- BigInt: 1n, 9007199254740993n
- String: 'str', "str", `str ${var}`
- Boolean: true, false
- Symbol: Symbol('description'), Symbol.for('namespace')

The `null` primitive is typically used to describe the absence of an object,
whereas `undefined` is the absence of a defined value. Any variable initialized without a value will be `undefined`. Any expression that attempts access of a non-existent property on an object will result in `undefined`. A function without a `return` statement will return `undefined`.

The Number type is double-precision floating-point format. It allows both integers and decimals but has an integer range of -253-1 to 253-1. The BigInt type has no upper/lower limit on integers.

Strings can be created with single or double quotes, or backticks. Strings created with backticks are template strings, these can be multiline and support interpolation whereas normal strings can only be concatenated together using the plus (+) operator.

Symbols can be used as unique identifier keys in objects. The `Symbol.for` method creates/gets a global symbol.

Other than that, absolutely everything else in JavaScript is an object. An object is a set of key value pairs, where values can be any primitive type or an object (including functions, since functions are objects). Object keys are called properties. An object with a key holding a value that is another object allows for nested data structures:

```javascript
const obj = { myKey: { thisIs: "a nested object" } };
console.log(obj.myKey);
```

All JavaScript objects have prototypes. A prototype is an implicit reference to another object that is queried in property lookups. If an object doesn't have a particular property, the object's prototype is checked for that property. If the object's prototype does not have that property, the object's prototype's prototype is checked and so on. This is how inheritance in JavaScript works, JavaScript is a prototypal language. This will be explored in more detail later in this section.

## Functions

Functions are first class citizens in JavaScript. A function is an object, and therefore a value that can be used like any other value.

For instance a function can be returned from a function:

```javascript
function factory() {
  return function doSomething() {};
}
```

A function can be passed to another function as an argument:

```shell
setTimeout(function () { console.log('hello from the future') },
100)
```

A function can be assigned to an object:

```javascript
const obj = {
  id: 999,
  fn: function () {
    console.log(this.id);
  },
};
obj.fn(); // prints 999
```

When a function is assigned to an object, when the implicit `this` keyword is accessed within that function it will refer to the object on which the function was called. This is why `obj.fn()` outputs 999.

It's crucial to understand that `this` refers to the object on which the function was called,not the object which the function was assigned to:

```javascript
const obj = {
  id: 999,
  fn: function () {
    console.log(this.id);
  },
};
const obj2 = { id: 2, fn: obj.fn };
obj2.fn(); // prints 2
obj.fn(); // prints 999
```

Both obj and obj2 reference the same function but on each invocation the `this` context changes to the object on which that function was called.

Functions have a `call` method that can be used to set their `this` context:

```javascript
function fn() {
  console.log(this.id);
}
const obj = { id: 999 };
const obj2 = { id: 2 };
fn.call(obj2); // prints 2
fn.call(obj); // prints 999
fn.call({ id: ":)" }); // prints :)
```

In this case the fn function wasn't assigned to any of the objects, `this` was set dynamically via the `call` function.

There are also fat arrow functions, also known as lambda functions:

```javascript
const add = (a, b) => a + 1;
const cube = (n) => {
  return Math.pow(n, 3);
};
```

When defined without curly braces, the expression following the fat arrow (`=>`) is the return value of the function. Lambda functions do not have their own `this` context,
when `this` is referenced inside a function, it refers to the `this` of the nearest parent non- lambda function.

```javascript
function fn() {
  return (offset) => {
    console.log(this.id + offset);
  };
}
const obj = { id: 999 };
const offsetter = fn.call(obj);
offsetter(1); // prints 1000 (999 + 1)
```

While normal functions have a `prototype` property (which will be discussed in detail shortly), fat arrow functions do not:

```javascript
function normalFunction() {}
const fatArrowFunction = () => {};
console.log(typeof normalFunction.prototype); // prints 'object'
console.log(typeof fatArrowFunction.prototype); // prints "undefined"
```

## Prototypal Inheritance (Functional)

At a fundamental level, inheritance in JavaScript is achieved with a chain of prototypes. The approaches around creating prototype chains have evolved significantly over time as updates to the language have brought new features and syntax.

There are many approaches and variations to creating a prototype chain in JavaScript but we will explore three common approaches:

- functional
- constructor functions
- class-syntax constructors.

For the purposes of these examples, we will be using a Wolf and Dog taxonomy, where a Wolf is a prototype of a Dog.

The functional approach to creating prototype chains is to use `Object.create`:

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

The `wolf` object is a plain JavaScript object, created with the object literal syntax (i.e. using curly braces). The prototype of plain JavaScript objects is `Object.prototype`.

The `Object.create` function can take two arguments. The first argument is the desired
prototype of the object being created.

When the dog object is instantiated, the first argument passed to `Object.create` is the wolf object. So wolf is the prototype of dog. When rufus is instantiated, the first argument to Object.create is dog.

To describe the full prototype chain:

- the prototype of rufus is dog
- the prototype of dog is wolf
- the prototype of wolf is `Object.prototype`.

The second argument of `Object.create` is an optional Properties Descriptor object.

A Properties Descriptor object contains keys that will become the key name on the object being created. The values of these keys are Property Descriptor objects.

The Property Descriptor is a JavaScript object that describes the characteristics of the properties on another object.

The `Object.getOwnPropertyDescriptor` can be used to get a property descriptor on any object:

![descriptor](/assets/image/05.PrototypalInheritanceFunctional.descriptor.png)

To describe the value of a property, the descriptor can either use `value` for a normal property value or `get` and `set` to create a property getter/setter. The other properties are associated meta-data for the property. The `writable` property determines whether the property can be reassigned, `enumerable` determines whether the property will be enumerated, in property iterator abstractions like` Object.keys` and `configurable` sets whether the property descriptor itself can be altered. All of these meta-data keys default to `false`.

In the case of `dog` and `rufus` the property descriptor only sets `value`, which adds a non- enumerable, non-writable, non-configurable property.

Property descriptors are not directly relevant to prototypal inheritance, but are part of the `Object.create` interface so understanding them is necessary. To learn more, read "Description" section at the MDN web docs Mozilla website.

When the `dog` prototype object is created, the property descriptor is an object with
a `woof` key. The `woof` key references an object with the `value` property set to a function. This will result in the creation of an object with a `woof` method.

So when `rufus.woof()` is called, the `rufus` object does not have a `woof` property itself.
The runtime will then check if the prototype object of `rufus` has a `woof` property. The prototype of `rufus` is dog and it does have a `woof` property. The `dog.woof` function contains a reference to this. Typically, the this keyword refers to the object on which the method was called. Since `woof` was called on `rufus` and `rufus` has the name property which is "`Rufus the dog`", the this.name property in the `woof` method has the
value "`Rufus the dog`" so console.log is passed the string: "`Rufus the dog: woof`".

Similarly when `rufus.howl` is called the JavaScript runtime performs the following steps:

- Check if `rufus` has a howl property; it does not
- Check if the prototype of `rufus` (which is dog) has a `howl` property; it does not
- Check if the prototype of dog (which is wolf) has a `howl` property; it does
- Execute the `howl` function setting `this` to `rufus`, so this.name will be "`Rufus
the dog`".

To complete the functional paradigm as it applies to prototypal inheritance, the creation of an instance of a dog can be genericized with a function:

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

The prototype of an object can be inspected with `Object.getPrototypeOf`:

```javascript
console.log(Object.getPrototypeOf(rufus) === dog); //true
console.log(Object.getPrototypeOf(dog) === wolf); //true
```

## Prototypal Inheritance (Constructor Functions)

Creating an object with a specific prototype object can also be achieved by calling a function with the `new` keyword. In legacy code bases this is a very common pattern, so it's worth understanding.

All functions have a `prototype` property. The Constructor approach to creating a prototype chain is to define properties on a function's prototype object and then call that function with `new`:

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

This will setup the same prototype chain as in the functional Prototypal Inheritance example:

```javascript
console.log(Object.getPrototypeOf(rufus) === Dog.prototype); //true
console.log(Object.getPrototypeOf(Dog.prototype) === Wolf.prototype); //true
```

The `Wolf` and `Dog` functions have capitalized first letters. Using PascaleCase for functions that are intended to be called with `new` is convention and recommended.

Note that a `howl` method was added to `Wolf.prototype` without ever instantiating an object and assigning it to `Wolf.prototype`. This is because it already existed, as every function always has a preexisting `prototype` object. However `Dog.prototype` was explicitly assigned, overwriting the previous Dog.prototype object.

To describe the full prototype chain:

- the prototype of `rufus` is `Dog.prototype`
- the prototype of `Dog.prototype` is `Wolf.prototype`
- the prototype of `Wolf.prototype` is `Object.prototype`.

When `new Dog('Rufus')` is called a new object is created (`rufus`). That new object is also the `this` object within the `Dog` constructor function. The `Dog` constructor function
passes this to Wolf.call.

Using the `call` method on a function allows the `this` object of the function being called to be set via the first argument passed to `call`. So when this is passed to `Wolf.call`, the newly created object (which is ultimately assigned to `rufus`) is also referenced via
the `this` object inside the `Wolf` constructor function. All subsequent arguments passed
to `call` become the function arguments, so the `name` argument passed to `Wolf` is "`Rufus the dog`". The `Wolf` constructor sets `this.name` to "`Rufus the dog`", which means that ultimately `rufus.name` is set to "`Rufus the dog`".

In legacy code bases, creating a prototype chain between `Dog` and `Wolf` for the purposes of inheritance may be performed many different ways. There was no standard or native approach to this before EcmaScript 5.

In the example code an `inherit` utility function is created, which uses an empty constructor function to create a new object with a prototype pointing, in this case, to `Wolf.prototype`.

In JavaScript runtimes that support EcmaScript 5+ the `Object.create` function could be used to the same effect:

```javascript
function Dog(name) {
  Wolf.call(this, name + " the dog");
}
Dog.prototype = Object.create(Wolf.prototype);
Dog.prototype.woof = function () {
  console.log(this.name + ": woof");
};
```

Node.js has a utility function: `util.inherits` that is often used in code bases using constructor functions:

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

In contemporary Node.js, `util.inherits` uses the EcmaScript 2015 (ES6)
method `Object.setPrototypeOf` under the hood. It's essentially executing the following:

```javascript
Object.setPrototypeOf(Dog.prototype, Wolf.prototype);
```

This explicitly sets the prototype of `Dog.prototype` to `Wolf.prototype`, discarding whatever previous prototype it had.

## Prototypal Inheritance (Class-Syntax Constructors)

Modern JavaScript (EcmaScript 2015+) has a `class` keyword. It's important that this isn't confused with the `class` keyword in other Classical OOP languages.

The `class` keyword is syntactic sugar that actually creates a function. Specifically it creates a function that should be called with `new`. It creates a Constructor Function, the very same Constructor Function discussed in the previous section.

![Class-Syntax Constructors](/assets/image/05.PrototypalInheritanceClassSyntaxConstructor.png)

This is why it's deliberately referred to here as "Class-syntax Constructors", because the EcmaScript 2015 (ES6) `class` syntax does not in fact facilitate the creation of classes as
they are traditionally understood in most other languages. It actually creates prototype chains to provide Prototypal Inheritance as opposed to Classical Inheritance.

The `class` syntax sugar does reduce boilerplate when creating a prototype chain:

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

This will setup the same prototype chain as in the Functional Prototypal Inheritance and the Function Constructors Prototypal Inheritance examples:

```js
console.log(Object.getPrototypeOf(rufus) === Dog.prototype); //true
console.log(Object.getPrototypeOf(Dog.prototype) === Wolf.prototype); //true
```

To describe the full prototype chain:

- the prototype of rufus is `Dog.prototype`
- the prototype of `Dog.prototype` is `Wolf.prototype`
- the prototype of `Wolf.prototype` is `Object.prototype`.

The `extends` keyword makes prototypal inheritance a lot simpler. In the example code, `class Dog extends Wolf will` ensure that the prototype of `Dog.prototype` will be `Wolf.prototype`.

The `constructor` method in each `class` is the equivalent to the function body of a Constructor Function. So for instance, `function Wolf (name) { this.name = name }` is the same as `class Wolf { constructor (name) { this.name = name } }`.

The `super` keyword in the `Dog` class `constructor` method is a generic way to call the parent class constructor while setting the `this` keyword to the current `instance`. In the Constructor Function example `Wolf.call`(`this`, `name` + ' `the dog`') is equivalent to `super`(`name` + ' `the dog`') here.

Any methods other than `constructor` that are defined in the `class` are added to the `prototype` object of the function that the `class` syntax creates.

Let's take a look at the `Wolf` class again:

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

This is desugared to:

```js
function Wolf(name) {
  this.name = name;
}
Wolf.prototype.howl = function () {
  console.log(this.name + ": awoooooooo");
};
```

The class syntax based approach is the most recent addition to JavaScript when it comes to creating prototype chains, but is already widely used.

## Closure Scope

When a function is created, an invisible object is also created, this is known as the closure scope. Parameters and variables created in the function are stored on this invisible object.
When a function is inside another function, it can access both its own closure scope, and the
parent closure scope of the outer function:

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

The outer variable is accessed when the inner function is invoked, this is why the second print call outputs false after foo is updated to false.

If there is a naming collision then the reference to the nearest closure scope takes precedence:

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

In this case the foo parameter of print overrides the foo variable in the outerFn function.

Closure scope cannot be accessed outside of a function:

```js
function outerFn() {
  var foo = true;
}
outerFn();
console.log(foo); // will throw a ReferenceError
```

Since the invisible closure scope object cannot be accessed outside of a function, if a function returns a function, the returned function can provide controlled access to the parent closure scope. In essence, this provides encapsulation of private state:

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

The init function sets an id variable in its scope, takes an argument called type, and then returns a function. The returned function has access to type and id because it has access to the parent closure scope. Note that the returned function in this case is a fat arrow function. Closure scope rules apply in exactly the same way to fat arrow functions.

The init function is called twice, and the resulting function is assigned to createUser and createBook. These two functions have access to two separate instances of the init functions closure scope. The dave and annie objects are instantiated by calling createUser.

The first call to createUser returns an object with an id of 1. The id variable is initialized as 0 and it is incremented by 1 before the object is created and returned. The second call to createUser returns an object with id of 2. This is because the first call of createUser already incremented id from 0 to 1, so on the next invocation of createUser the id is increased from 1 to 2. The only call to the createBook function however, returns an id of 1 (as opposed to 3), because createBook function is a different instance of the function returned from init and therefore accesses a separate instance of the init function's scope.

In the example all the state is returned from the returned function, but this pattern can be used for much more than that. For instance, the init function could provide validation on type, return different functions depending on what type is.

Another example of encapsulating state using closure scope would be to enclose a secret:

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

Note, in this code createKeypair and cryptoSign are imaginary functions, these are purely for outlining the concept of the encapsulation of secrets.

Closure scope can also be used as an alternative to prototypal inheritance. The following example provides equivalent functionality and the same level of composability as the three prototypal inheritance examples but it doesn't use a prototype chain, nor does it rely the implicit this keyword:

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

The three dots (...) in the return statement of dog is called the spread operator. The spread operator copies the properties from the object it proceeds into the object being created.

The wolf function returns an object with a howl function assigned to it. That object is then spread (using ...) into the object returned from the dog function, so howl is copied into the object. The object returned from the dog function also has a woof function assigned.

There is no prototype chain being set up here, the prototype of rufus is Object.prototype and that's it. The state (name) is contained in closure scope and not exposed on the instantiated object, it's encapsulated as private state.

The dog function takes a name parameter, and immediately reassigns it to name + ' the dog'. Inside dog a woof function is created, where it references name.
The woof function is returned from the dog function inside of an object, as the woof property. So when rufus.woof() is called the woof accesses name from it's parent scope, that is, the closure scope of dog. The exact same thing happens in the wolf function. When rufus.howl() is called, the howl function accesses the name parameter in the scope of the wolf function.

The advantage of using closure scope to compose objects is it eliminates the complexity of prototypes, context (this) and the need to call a function with new – which when omitted can have unintended consequences. The downside is that where a prototype method is shared between multiple instances, an approach using closure scope requires that internal functions are created per instance. However, JavaScript engines use increasingly sophisticated optimization techniques internally, it's only important to be fast enough for any given use case and ergonomics and maintainability should take precedence over every changing performance characteristics in JavaScript engines. Therefore it's recommended to use function composition over prototypal inheritance and optimize at a later point if required.
