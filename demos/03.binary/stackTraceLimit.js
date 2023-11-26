#!/usr/bin/env zx

await Promise.all([
  // $`node ./stackTraceLimit/app.cjs`, // 默认值10
  $`node --stack-trace-limit=5 ./stackTraceLimit/app.cjs`,
]);
