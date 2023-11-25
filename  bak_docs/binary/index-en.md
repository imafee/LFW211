# 03.The node binary

[lab](/binary/lab) | [check](/binary/check)

## Chapter Overview

The Node.js platform is almost entirely represented by the node binary executable. In order to execute a JavaScript program we use: node app.js, where app.js is the program we wish to run. However, before we start running programs, let’s explore some of the command line flags offered by the Node binary.

## Learning Objectives

By the end of this chapter, you should be able to:
• Explore all possible Node and V8 command line flags.
• Use key utility mode command line flags.
• Understand an essential selection of operational command line flags.

## Printing Command Options

To see all Node command line flags for any version of Node, execute node --help and view the output.
![omit]()
Beyond the Node command line flags there are additional flags for modifying the JavaScript runtime engine: V8. To view these flags run node --v8-options.
![omit]()

## Checking Syntax

It’s possible to parse a JavaScript application without running it in order to just check the syntax.
This can be useful on occasions where running code has a setup/teardown cost, for instance, needing to clear a database, but there’s still a need to check that the code parses. It can also be used in more advanced cases where code has been generated and a syntax check is required.
To check the syntax of a program (which will be called app.js), use --check or -c flag:

```shell
node --check app.js
node -c app.js
```

If the code parses successfully, there will be no output. If the code does not parse and there is a syntax error, the error will be printed to the terminal.

## Dynamic Evaluation

Node can directly evaluate code from the shell. This is useful for quickly checking a code snippet or for creating very small cross-platform commands that use JavaScript and Node core API’s.
There are two flags that can evaluate code. The -p or --print flag evaluates an expression and prints the result, the -e or --eval flag evaluates without printing the result of the expression.
The following will print 2:

```shell
node --print "1+1"
```

The following will not print anything because the expression is evaluated but not printed:

```shell
node --eval "1+1"
```

The following will print 2 because console.log is used to explicitly write the result of 1+1 to the terminal:

```shell
node -e "console.log(1+1)"
```

When used with print flag the same will print 2 and then
print undefined because console.log returns undefined; so the result of the expression is undefined:

```shell
node -p "console.log(1+1)"
```

![03.dynamicEvaluation](/assets/image/03.dynamicEvaluation.png)
Usually a module would be required, like so: require('fs'), however all Node core modules can be accessed by their namespaces within the code evaluation context.
For example, the following would print all the files with a .js extension in the current working directory in which the command is run:

```shell
node -p "fs.readdirSync('.').filter((f) => /.js$/.test(f))"
```

Due to the fact that Node is cross-platform, this is a consistent command that can be used on Linux, MacOS or Windows. To achieve the same effect natively on each OS a different approach would be required for Windows vs Linux and Mac OS.

## Preloading CommonJS Modules

The command line flag -r or --require can be used to preload a CommonJS module
before anything else loads.
Given a file named preload.js with the following content:

```shell
console.log('preload.js: this is preloaded')
```

And a file called app.js containing the following:

```shell
console.log('app.js: this is the main file')
```

The following command would print preload.js: this is preloaded followed by app.js: this is the main file:

```shell
node -r ./preload.js app.js
```

![preloadingCommonJSModules](/assets/image/03.preloadingCommonJSModules.png)
Preloading modules is useful when using consuming-modules that instrument or configure the process in some way. One example would be the dotenv module. To learn more
about dotenv, read documentation available at npmjs.com.

In Chapter 7, we'll be covering the two module systems that Node uses, CommonJS and ESM, but it's important to note here that the --require flag can only preload a CommonJS module, not an ESM module. ESM modules have a vaguely related flag, called -- loader, a currently experimental flag which should not be confused with the -- require preloader flag. For more information on the --loader flag see Node.js documentation.

## Stack Trace Limit

Stack traces are generated for any Error that occurs, so they're usually the first point of call when debugging a failure scenario. By default, a stack trace will contain the last ten stack frames (function call sites) at the point where the trace occurred. This is often fine, because the part of the stack you are interested in is often the last 3 or 4 call frames. However there are scenarios where seeing more call frames in a stack trace makes sense, like checking that the application flow through various functions is as expected.

The stack trace limit can be modified with the --stack-trace-limit flag. This flag is part of the JavaScript runtime engine, V8, and can be found in the output of the --v8- options flag.

Consider a program named app.js containing the following code:

```shell
function f (n = 99) {
  if (n === 0) throw Error()
f(n - 1) }
f()
```

When executed, the function f will be called 100 times. On the 100th time, an Error is
thrown and the stack for the error will be output to the console.
![stackTraceLimit](/assets/image/03.stackTraceLimit.png)
The stack trace output only shows the call to the f function, in order to see the very first call to f the stack trace limit must be set to 101. This can be achieved with the following:

```shell
node --stack-trace-limit=101 app.js
```

![stackTraceLimit](/assets/image/03.02.stackTraceLimit.png)
Setting stack trace limit to a number higher than the amount of call frames in the stack guarantees that the entire stack will be output:

```shell
node --stack-trace-limit=99999 app.js
```

![stackTraceLimit](/assets/image/03.03.stackTraceLimit.png)
Generally, the stack trace limit should stay at the default in production scenarios due to the overhead involved with retaining long stacks. It can nevertheless be useful for development purposes.
