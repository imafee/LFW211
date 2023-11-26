#!/usr/bin/env zx

await Promise.all([$`node --inspect-brk ./inspect-brk/app.cjs`]);

// 然后chrome浏览器中打开`chrome://inspect`,点击`Open dedicated DevTools for Node`链接
// 此时，你既可以勾选`遇到异常时暂停`也可以`手动在编辑区点击增加蓝色断点`来增加断点
// 当然，不通过 Devtools UI也可以增加断点，即在app.js中书写debugger语句，但因为容易忘记去除而带到生产环境中。这是不推荐的实践方式。
