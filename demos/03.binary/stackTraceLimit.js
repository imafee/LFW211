#!/usr/bin/env zx

await Promise.all([
  // $`node ./stackTraceLimit/app.cjs`, // 默认值10
  $`node --stack-trace-limit=15 ./stackTraceLimit/app.cjs`,
]);
