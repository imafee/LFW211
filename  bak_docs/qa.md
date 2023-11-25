# QA

## 上下文栈和上下文是什么？

上下文存储了块级作用域当中的变量，词法作用域决定了变量的访问规则。上下文栈是上下文的管理者，提供了调用栈可用的环境。
上下文分为块、函数和全局，块上下文由{}的大括号产生、函数上下文由函数调用产生、全局上下文由浏览器的 tab 页面产生。
上下文中定义的变量，将被保存到 context.variableObject 对象当中去，全局上下文比较特殊 var 声明的变量还能被 globalThis（window）访问到。
块级上下文的数据结构中就这点东西，函数上下文还多了 arguments，全局上下文中没有 argumnts 但还有基础设置比如 webapi、浏览器的 api。
代码块里定义的变量将保存在该上下文的 variableObject 当中。
待执行流进入函数时（函数被调用），将产生一个函数上下文，上下文栈将其压入并将控制权交出，待代码执行完毕后控制权将返还给上下文栈，该上下文弹出并销毁。
全局上下文是比较特殊的存在。当浏览器打开 tab 页面时产生并成为上下文栈的底帧，关闭 tab 页面时销毁。上下文没有 arguments 变量。

帮助理解的上下文对象的数据结构

```js
// 上下文栈(ContextStack)的数据结构：
{
  scopeChain:Context[], // 作用域链，全局上下文对象GlobalContext是最后一个
  activationObject:{ // 活动对象
    // 对scopeChain中的所有context进行计算得出，提供给活动栈帧使用
  }
}
// 块上下文栈帧(Context)的数据结构：
{
  variableObject:{
    // 函数块内自定义的变量
  },
}
// 函数上下文栈帧(Context)的数据结构：
{
  variableObject:{
    // 函数块内自定义的变量
  },
  arguments:Arguments // 全局上下文中没有这个变量
}
// 全局上下文栈帧(GlobalContext)的数据结构：
{
  variableObject:{
    // const、let 定义的变量
  },
  // var 定义的变量
  // webapi基础设置
  // 浏览器基础设置
}
```

## 调用栈

调用栈(call stack)，记录着函数的调用顺序和嵌套关系。JavaScript 是单线程语言,每个页面仅有一个调用栈。
