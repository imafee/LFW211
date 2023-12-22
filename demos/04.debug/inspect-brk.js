#!/usr/bin/env zx

await Promise.all([$`node --inspect-brk ./inspect-brk/app.cjs`]);

// 然后chrome浏览器中打开`chrome://inspect`,点击`Open dedicated DevTools for Node`链接
// 通过devtool的ui界面，我们可以这样增加断点：
// - 勾选`遇到异常时暂停`
// - 手动在编辑区点击增加蓝色断点
// 不通过 Devtools UI也可以增加断点：
// - 代码中添加debugger语句 // 但因为容易忘记去除而带到生产环境中。这是不推荐的实践方式。
