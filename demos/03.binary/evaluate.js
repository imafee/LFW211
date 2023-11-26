#!/usr/bin/env zx

// 需要全局安装zx解析器
// https://www.npmjs.com/package/zx

await Promise.all([
  $`node --print "1+1"`, // 2
  $`node --eval "1+1"`, //
  $`node -e "console.log(1+1)"`, // 2, 因为console.log 将 1+1 的结果显式写入终端了，而后续-e不打印任何内容
  $`node -p "console.log(1+1)" `, // 先打印2再打印undefined, 因为 console.log 返回的undefined被-p输出到终端了
]);
