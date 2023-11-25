# Lab

## Lab 10.1 - Synchronous Error Handling

The native URL constructor can be used to parse URLs, it's been wrapped into a function called parseURL:

```js
function parseURL(str) {
  const parsed = new URL(str);
  return parsed;
}
```

If URL is passed a unparsable URL string it will throw, so calling parseURL('foo') will result in an exception:
![10.lab1.1](/assets/image/10.lab1.1.png)

The labs-1 folder contains an index.js file with the following content:

```js
"use strict";
const assert = require("assert");
function parseUrl(str) {
  const parsed = new URL(str);
  return parsed;
}
assert.doesNotThrow(() => {
  parseUrl("invalid-url");
});
assert.equal(parseUrl("invalid-url"), null);
assert.deepEqual(parseUrl("http://example.com"), new URL("http://example.com"));
console.log("passed!");
```

Modify the parseURL function body such that instead of throwing an error, it returns null when the URL is invalid. Use the fact that URL will throw when given invalid input to determine whether or not to return null or a parsed object.

Once implemented, execute the index.js file with node, if the output says passed! then the exercise was completed successfully:
![10.lab1.2](/assets/image/10.lab1.2.png)

## Lab 10.2 - Async Function Error Handling

The following code loads the fs/promises module to read a file based on a file path passed to a read function:

```js
const { readFile } = require("fs/promises");
async function read(file) {
  const content = await readFile(file);
  return content;
}
```

The promise returned from fs/promises readFile may reject for a variety of reasons, for instance if the specified file path doesn't exist or the process doesn't have permissions to access it. In this scenario, we don't care what the reason for failure is, we just want to propagate a single error instance from the native Error constructor with the message 'failed to read'.

The labs-2 index.js file contains the following code:

```js
"use strict";
const { readFileSync } = require("fs");
const { readFile } = require("fs/promises");
const assert = require("assert");
async function read(file) {
  const content = await readFile(file);
  return content;
}
async function check() {
  await assert.rejects(
    read("not-a-valid-filepath"),
    new Error("failed to read")
  );
  assert.deepEqual(await read(__filename), readFileSync(__filename));
  console.log("passed!");
}
check();
```

Modify the body of the read function so that any possible rejection by the promise returned from the fs/promises readFile call results in the read function rejecting with a new Error('failed to read') error. If implemented correctly, when node index.js is executed the output should be passed!:
![10.lab2.1](/assets/image/10.lab2.1.png)
NOTE: To support earlier Node versions (v12 down to v10) use require('fs').promises instead of require('fs/promises').
