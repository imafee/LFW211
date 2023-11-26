#!/usr/bin/env zx

// --require 标志只能预加载 CommonJS 模块，而不能预加载 ESM 模块
// 在顶层模块中使用await，只能在ESM模块，而不能在CommonJS模块。
// 所以preload.js是后缀表示ESM模块，而./preload/*.cjs表示CommonJS模块

await Promise.all([
  $`node -r ./preload/other.cjs ./preload/app.cjs`, // 先加载other.js，然后加载main.js
]);
