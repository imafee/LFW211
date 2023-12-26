# 05. KEY JAVASCRIPT CONCEPTS {#top}

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

JavaScript 是一种松散类型的动态语言。在 JavaScript 中有:

- 7 种原始类型（primitive type）
- 其他一切都是对象（包括函数和数组）

JavaScript 原始类型如下（左侧为类型，右侧为对应的值）：

```js
[Null,null] 语义上指描述对象的不存在

[Undefined,undefined] 没有定义的值。
// 任何初始化时没有值的变量都将是“未定义的”
// 任何表达式试图访问对象上不存在的属性时都将得到“未定义”。
// 没有“return”关键词或者光有“return”关键词的语句都将返回“未定义”。

[Number,[1, 1.5, -1e4, NaN]] 双精度浮点格式。
// 它允许整数和小数，但整数范围为[-2**53-1 , 2**53-1]。
// 适用于一般的浮点数运算,精度有限制。

[BigInt,[1n, 9007199254740993n]] 大整数,不用担心丢失精度。
// 只能表示整数不能表示小数，字面量写成数字后面带个 n(比如 1n），没有最大精度限制。

[String,['str', "str", `str ${var}]] 字符串
// 可以用单引号、双引号或反引号创建
// 前两者只能使用加号运算符(+)连接在一起，而后者的模版字符串可以是多行书写且支持插值更加强大。

[Boolean,[true, false]] 布尔

[Symbol,[Symbol('description'), Symbol.for('namespace')]] 标识符
// 符号可以用作对象中的唯一标识符。
// `Symbol.for` 方法创建/获取全局符号。
```

除此以外，JavaScript 中其他均为对象。对象是一组键值对，键又称为属性，值可以是任何类型。比如，嵌套数据结构的对象：

```js
const obj = { myKey: { thisIs: "a nested object" } };
console.log(obj.myKey);
```

所有 JavaScript 对象都有原型。  
原型是对属性查找中查询的另一个对象的隐式引用。  
如果对象没有特定属性，则会检查该对象的原型是否有该属性。 如果对象的原型没有该属性，则检查对象的原型的原型，依此类推。  
这就是 JavaScript 中“继承”的工作原理，JavaScript 是一种原型语言。 本节稍后将对此进行更详细的探讨。

<!-- Chapter Parts -->
<!-- @include: ./parts/function.md -->
<!-- @include: ./parts/prototypal-Inheritance-Functional.md -->
<!-- @include: ./parts/prototypal-Inheritance-Constructor-Functions.md -->
<!-- @include: ./parts/Class-Syntax-Constructors.md -->
<!-- @include: ./parts/Closure-Scope.md -->

<!-- @include: ./anchors.md -->
