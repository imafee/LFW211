# Lab

## Lab 9.1 - Single Use Listener

The labs-1 index.js file contains the following code:

```js
"use strict";
const assert = require("assert");
const { EventEmitter } = require("events");
const ee = new EventEmitter();
let count = 0;
setInterval(() => {
  ee.emit("tick");
}, 100);
function listener() {
  count++;
  setTimeout(() => {
    assert.equal(count, 1);
    assert.equal(this, ee);
    console.log("passed!");
  }, 250);
}
```

Register the listener function with the ee event emitter in such a way that the listener function is only called a single time. If implemented correctly, the program should print out passed!

## Lab 9.2 - Implementing a Timeout Error The labs-2 folder has an index.js file containing the following:

```js
"use strict";
const { EventEmitter } = require("events");

process.nextTick(console.log, "passed!");
const ee = new EventEmitter();
ee.emit("error", Error("timeout"));
```

Currently the process crashes:
![09.lab9.2.crashes](/assets/image/09.lab9.2.crashes.png)
Without removing any of the existing code, and without using a try/catch block add some code which stops the process from crashing. When implemented correctly the process should output passed!.
