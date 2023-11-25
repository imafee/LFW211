# 09. NODE'S EVENT SYSTEM

[lab](lab) |[check](check)

## Chapter Overview

The EventEmitter constructor in the events module is the functional backbone of many Node core API's. For instance, HTTP and TCP servers are an event emitter, a TCP socket is an event emitter, HTTP request and response objects are event emitters. In this section we'll explore how to create and consume EventEmitters.

## Learning Objectives

By the end of this chapter, you should be able to:

- Explain how to create an event emitter.
- Discuss how to consume event emitters.
- Describe key behaviors of event emitters.

## Creating an Event Emitter

The events module exports an EventEmitter constructor:

```js
const { EventEmitter } = require("events");
```

In modern node the events module is the EventEmitter constructor as well:

```js
const EventEmitter = require("events");
```

Both forms are fine for contemporary Node.js usage.
To create a new event emitter, call the constructor with new:

```js
const myEmitter = new EventEmitter();
```

A more typical pattern of usage with EventEmitter, however, is to inherit from it:

```js
class MyEmitter extends EventEmitter {
  constructor(opts = {}) {
    super(opts);
    this.name = opts.name;
  }
}
```

## Emitting Events

To emit an event call the emit method:

```js
const { EventEmitter } = require("events");
const myEmitter = new EventEmitter();
myEmitter.emit("an-event", some, args);
```

The first argument passed to emit is the event namespace. In order to listen to an event this namespace has to be known. The subsequent arguments will be passed to the listener.
The following is an example of using emit with inheriting from EventEmitter:

```js
const { EventEmitter } = require('events')
class MyEmitter extends EventEmitter {
  constructor (opts = {}) {
    super(opts)
    this.name = opts.name
  },
  destroy (err) {
    if (err) { this.emit('error', err) }
    this.emit('close')
  }
}
```

The destroy method we created for the MyEmitter constructor class calls this.emit. It will also emit a close event. If an error object is passed to destroy it will emit an error event and pass the error object as an argument.

Next, we'll find out how to listen for emitted events.

## Listening for Events

To add a listener to an event emitter the addListener method or it's alias on method is used:

```js
const { EventEmitter } = require("events");
const ee = new EventEmitter();
ee.on("close", () => {
  console.log("close event fired!");
});
ee.emit("close");
```

The key line here is:

```js
ee.on("close", () => {
  console.log("close event fired!");
});
```

It could also be written as:

```js
ee.addListener('close', () => {
  console.log(close event fired!')
})
```

Arguments passed to emit are received by the listener function:

```js
ee.on("add", (a, b) => {
  console.log(a + b);
}); // logs 13
ee.emit("add", 7, 6);
```

Ordering is important, in the following will the event listener will not fire:

```js
ee.emit("close");
ee.on("close", () => {
  console.log("close event fired!");
});
```

This is because the event is emitted before the listener is added.
Listeners are also called in the order that they are registered:

```js
const { EventEmitter } = require("events");
const ee = new EventEmitter();
ee.on("my-event", () => {
  console.log("1st");
});
ee.on("my-event", () => {
  console.log("2nd");
});
ee.emit("my-event");
```

![09.ListeningforEvents.cat-example](/assets/image/09.ListeningforEvents.cat-example.png)
The prependListener method can be used to inject listeners into the top position:

```js
const { EventEmitter } = require("events");
const ee = new EventEmitter();
ee.on("my-event", () => {
  console.log("2nd");
});
ee.prependListener("my-event", () => {
  console.log("1st");
});
ee.emit("my-event");
```

## Single Use Listener

An event can also be emitted more than once:

```js
const { EventEmitter } = require("events");
const ee = new EventEmitter();
ee.on("my-event", () => {
  console.log("my-event fired");
});
ee.emit("my-event");
ee.emit("my-event");
ee.emit("my-event");
```

![09.SingleUseListener.cat-example](/assets/image/09.SingleUseListener.cat-example.png)
The once method will immediately remove its listener after it has been called:

```js
const { EventEmitter } = require("events");
const ee = new EventEmitter();
ee.once("my-event", () => {
  console.log("my-event fired");
});
ee.emit("my-event");
ee.emit("my-event");
ee.emit("my-event");
```

![09.SingleUseListener.cat-example2](/assets/image/09.SingleUseListener.cat-example2.png)

## Removing Listeners

The removeListener method can be used to remove a previously registered listener. The removeListener method takes two arguments, the event name and the listener function.
In the following example, the listener1 function will be called twice, but
the listener2 function will be called five times:

```js
const { EventEmitter } = require("events");
const ee = new EventEmitter();
const listener1 = () => {
  console.log("listener 1");
};
const listener2 = () => {
  console.log("listener 2");
};
ee.on("my-event", listener1);
ee.on("my-event", listener2);
setInterval(() => {
  ee.emit("my-event");
}, 200);
setTimeout(() => {
  ee.removeListener("my-event", listener1);
}, 500);
setTimeout(() => {
  ee.removeListener("my-event", listener2);
}, 1100);
```

![09.RemovingListeners.node-example](/assets/image/09.RemovingListeners.node-example.png)
The 'my-event' event is emitted every 200 milliseconds. After 500 milliseconds
the listener1 function is removed. So listener1 is only called twice before it's removed. But at the 1100 milliseconds point, listener2 is removed. So listener2 is triggered five times.

The removeAllListeners method can be used to remove listeners without having a reference to their function. It can take either no arguments in which case every listener on an event emitter object will be removed, or it can take an event name in order to remove all listeners for a given event.

The following will trigger two 'my-event' listeners twice, but will trigger
the 'another-event' listener five times:

```js
const { EventEmitter } = require("events");
const ee = new EventEmitter();
const listener1 = () => {
  console.log("listener 1");
};
const listener2 = () => {
  console.log("listener 2");
};

ee.on("my-event", listener1);
ee.on("my-event", listener2);
ee.on("another-event", () => {
  console.log("another event");
});
setInterval(() => {
  ee.emit("my-event");
  ee.emit("another-event");
}, 200);
setTimeout(() => {
  ee.removeAllListeners("my-event");
}, 500);
setTimeout(() => {
  ee.removeAllListeners();
}, 1100);
```

![09.RemovingListeners.node-example2](/assets/image/09.RemovingListeners.node-example2.png)
The 'my-event' and 'another-event' events are triggered every 200 milliseconds. After 500 milliseconds all listeners for 'my-event' are removed, so the two listeners are triggered twice before they are removed. After 1100 milliseconds removeAllListeners method is called with no arguments, which removes the remaining 'another-event' listener, thus it is called five times.

## The error Event

Emitting an 'error' event on an event emitter will cause the event emitter to throw an exception if a listener for the 'error' event has not been registered: Consider the following:

```js
const { EventEmitter } = require("events");
const ee = new EventEmitter();
process.stdin.resume(); // keep process alive
ee.emit("error", new Error("oh oh"));
```

This will cause the process to crash and output an error stack trace:
![09.RemovingListeners.errorStackTrace](/assets/image/09.RemovingListeners.errorStackTrace.png)

```js
If a listener is registered for the error event the process will no longer crash:
const { EventEmitter } = require('events')
const ee = new EventEmitter()

process.stdin.resume() // keep process alive
ee.on('error', (err) => {
  console.log('got error:', err.message )
})
ee.emit('error', new Error('oh oh'))
```

![09.RemovingListeners.error-oh-oh](/assets/image/09.RemovingListeners.error-oh-oh.png)

## Promise-Based Single Use Listener and AbortController

In the prior chapter, we discussed AbortController as a means of canceling asynchronous operations. It can also be used to cancel promisified event listeners.
The events.once function returns a promise that resolves once an event has been fired:

```js
import someEventEmitter from "./somewhere.js";
import { once } from "events";
await once(someEventEmitter, "my-event");
```

Execution will pause on the line starting await once, until the registered event fires. If it never fires, execution will never proceed past that point. This makes events.once useful in async/await or ESM Top-Level Await scenarios (we're using ESM for Top-Level Await here), but we need an escape-hatch for scenarios where an event might not fire. For example the following code will never output pinged!:

```js
import { once, EventEmitter } from "events";
const uneventful = new EventEmitter();
await once(uneventful, "ping");
console.log("pinged!");
```

This is because the uneventful event emitter doesn't emit any events at all. Let's imagine that it could emit an event, but it might not or it might take longer than is acceptable for the event to emit. We can use an AbortController to cancel the promisifed listener after 500 milliseconds like so:

```js
import { once, EventEmitter } from "events";
import { setTimeout } from "timers/promises";
const uneventful = new EventEmitter();
const ac = new AbortController();
const { signal } = ac;
setTimeout(500).then(() => ac.abort());
try {
  await once(uneventful, "ping", { signal });
  console.log("pinged!");
} catch (err) {
  // ignore abort errors:
  if (err.code !== "ABORT_ERR") throw err;
  console.log("canceled");
}
```

This code will now output canceled every time. Since uneventful never emits pinged, after 500 milliseconds ac.abort is called, and this causes the signal instance passed to events.once to emit an abort event which triggers events.once to reject the returned promise with an AbortError. We check for the AbortError, rethrowing if the error isn't related to the AbortController. If the error is an AbortError we log out canceled.

We can make this a little bit more realistic by making the event listener sometimes take longer than 500 milliseconds, and sometimes take less than 500 milliseconds:

```js
import { once, EventEmitter } from "events";
import { setTimeout } from "timers/promises";
const sometimesLaggy = new EventEmitter();
const ac = new AbortController();
const { signal } = ac;
setTimeout(2000 * Math.random(), null, { signal }).then(() => {
  sometimesLaggy.emit("ping");
});
setTimeout(500).then(() => ac.abort());
try {
  await once(sometimesLaggy, "ping", { signal });
  console.log("pinged!");
} catch (err) {
  // ignore abort errors:
  if (err.code !== "ABORT_ERR") throw err;
  console.log("canceled");
}
```

About three out of four times this code will log out canceled, one out of four times it will log out pinged!. Also note an interesting usage of AbortController here: ac.abort is used to cancel both the event.once promise and the first timers/promises setTimeout promise. The options object must be the third argument with the timers/promises setTimeout function, the second argument can be used to specify the resolved value of the timeout promise. In our case we set the resolved value to null by passing null as the second argument to timers/promises setTimeout.
