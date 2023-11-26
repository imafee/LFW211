# 03.The node binary

[实验](/binary/lab) | [检查](/binary/check)

## 章节概述

Node.js 平台几乎完全就是 Node 二进制可执行文件。为了执行 JavaScript 程序，我们使用：`node app.js`，其中 app.js 是我们希望运行的程序。但是，在我们开始运行程序之前，让我们先了解一下 Node 二进制文件提供的一些**命令行标志**。

## 学习目标

在本章结束时，您应该能够：

- Explore all possible Node and V8 command line flags.
- Use key utility mode command line flags.
- Understand an essential selection of operational command line flags.

## 打印命令选项

执行`Node --help`,查看任意版本 Node 的 命令行标志。(图片略)

执行 `node --v8-options`，查看用于修改 JavaScript 运行时引擎(V8)的命令行标志。(图片略)

## 检查语法

**为了只检查语法，只解析一遍 JavaScript 应用程序而不必运行它。**

在运行代码有安装/卸载成本的情况下，这可能很有用，例如，需要清除数据库，但仍需要检查代码是否可解析。它还可以用于对已生成代码需要进行语法检查的更高级情况。

要检查程序的语法，请使用` --check` 或 `-c` flag:

```shell
node --check app.js
node -c app.js
```

如果代码解析成功将不会有输出。如果代码没有被解析并且存在语法错误，则错误将打印到终端。

## 动态评估

Node 可以直接评估来自 shell 的代码。 这对于快速检查代码片段或创建使用 JavaScript 和 Node 核心 API 的非常小的跨平台命令非常有用。

有两个标志可以评估代码。**`-p` 或`--print` 标志用来评估表达式并打印结果，`-e` 或`--eval` 标志用来评估而不打印结果。**

```shell
node --print "1+1" # 打印 2
node --eval "1+1" # 不打印但表达式其实已经做了求值运算
node -e "console.log(1+1)" # 打印2，因为console.log 将 1+1 的结果显式写入终端了，而后续-e不打印任何内容
node -p "console.log(1+1)" # 先打印2再打印undefined,因为 console.log 返回 undefined被-p输出到终端了
```

![dynamicEvaluation](/assets/image/03.dynamicEvaluation.png)

通常需要一个模块，比如：`require（'fs'）`，但所有 Node 核心模块都可以通过代码评估上下文中的命名空间访问。

例如，下面将打印运行该命令的当前工作目录中所有扩展名为.js 的文件：

```shell
node -p "fs.readdirSync('.').filter((f) => /.js$/.test(f))"
```

由于 Node 是跨平台的，这是一个一致的命令，可以在 Linux、MacOS 或 Windows 上使用。为了在每个操作系统上实现相同的效果，Windows 与 Linux 和 Mac 操作系统需要不同的方法。

## 预加载 CommonJS 模块(Preloading CommonJS Modules)

命令行标志`-r` 或`--require` 可用于预加载 CommonJS 模块,在加载任何其他内容之前。

给定一个名为 preload.js 的文件，其中包含以下内容：

```shell
console.log('preload.js: this is preloaded')
```

和一个称为 app.js 的包含以下内容的文件：

```shell
console.log('app.js: this is the main file')
```

以下命令将打印 preload.js：这是预加载的，后面跟着 app.js：它是主文件：

```shell
node -r ./preload.js app.js
```

![preloadingCommonJSModules](/assets/image/03.preloadingCommonJSModules.png)

当使用以某种方式检测或配置进程的消费模块时，预加载模块非常有用。 dotenv 模块就是一个例子。 要了解有关 dotenv 的更多信息，请阅读 npmjs.com 上提供的文档。

在第 7 章中，我们将介绍 Node 使用的两个模块系统，CommonJS 和 ESM，但这里需要注意的是，**`--require` 标志只能预加载 CommonJS 模块，而不能预加载 ESM 模块**。ESM 模块有一个模糊相关的标志，称为 `--loader`，这是一个当前正在试验的标志，不应与`--require` preloader 标志混淆。有关`--loader` 标志的更多信息，请参阅 Node.js 文档。

## 堆栈跟踪限制(Stack Trace Limit)

堆栈跟踪是为发生的任何错误生成的，因此它们通常是调试失败场景时的第一个调用点。默认情况下，堆栈跟踪将包含跟踪发生点的最后十个堆栈帧（函数调用站点）。这通常很好，因为您感兴趣的堆栈部分通常是最后 3 或 4 个调用帧。然而，在某些情况下，在堆栈跟踪中看到更多的调用帧是有意义的，比如检查应用程序在各种函数中的流动是否如预期的那样。

可以使用--stack trace limit 标志修改堆栈跟踪限制。这个标志是 JavaScript 运行时引擎 V8 的一部分，可以在--V8-options 标志的输出中找到。

思考这样一个名为 app.js 的程序，该程序包含以下代码：

```shell
function f (n = 99) {
if (n === 0) throw Error()
f(n - 1) }
f()
```

当执行时，函数 f 将被调用 100 次。第 100 次出现错误抛出，错误的堆栈将输出到控制台。
![stackTraceLimit](/assets/image/03.stackTraceLimit.png)

堆栈跟踪输出仅显示对 f 函数的调用，为了查看对 f 的第一次调用，堆栈跟踪限制必须设置为 101。这可以通过以下方式实现：

```shell
node --stack-trace-limit=101 app.js
```

![stackTraceLimit](/assets/image/03.02.stackTraceLimit.png)

将堆栈跟踪限制设置为高于堆栈中调用帧数量的数字，可确保输出整个堆栈：

```shell
node --stack-trace-limit=99999 app.js
```

![stackTraceLimit](/assets/image/03.03.stackTraceLimit.png)

通常，**在生产场景中**，由于保留长堆栈所涉及的开销，**堆栈跟踪限制应该保持在默认值**。尽管如此，它对开发目标来说还是有用的。
