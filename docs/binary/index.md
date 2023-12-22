# 03.The node binary

[实验](/binary/lab) | [检查](/binary/check)

## 章节概述

Node.js 平台几乎完全就是 Node 二进制可执行文件。为了执行 JavaScript 程序，我们使用：`node app.js`，其中 app.js 是我们希望运行的程序。但是，在我们开始运行程序之前，让我们先了解一下 Node 二进制文件提供的一些命令行选标志。

## 学习目标

在本章结束时，您应该能够：

- 探索所有的 Node 和 V8 命令行标志
- 使用关键且使用的命令行标志
- 了解如何操作命令行的标志

## 打印命令选项

执行`Node --help`,查看 Node 的 命令行标志。(图片略)

执行 `node --v8-options`，查看 V8（用于修改 JavaScript 运行时引擎）的命令行标志。(图片略)

## 检查语法

为了只检查语法，只解析一遍 JavaScript 应用程序而不必运行它。

在运行代码有安装/卸载成本的情况下，这可能很有用，例如，需要清除数据库，但仍需要检查代码是否可解析。它还可以用于对已生成代码需要进行语法检查的更高级情况。

要检查程序的语法，请使用` --check` 或 `-c` flag:

```shell
node --check app.js
node -c app.js
```

如果代码解析成功将不会有输出。如果代码没有被解析并且存在语法错误，则错误将打印到终端。

## 动态评估

Node 可以直接评估来自 shell 的代码，这很有用：

- 快速检查代码片段
- 创建非常小的跨平台命令（它使用 JavaScript 和 Node 核心 API）

有两个标志可以评估代码：

- `-p` 或`--print` 标志用来评估表达式,并打印结果
- `-e` 或`--eval` 标志用来评估,运行而无打印结果

```shell
node --print "1+1" # 执行后打印 2
node --eval "1+1" # 执行后不打印表达式结果
node -e "console.log(1+1)" # 打印2，console.log 将 1+1 的结果显式写入终端了，后续-e不打印任何内容
node -p "console.log(1+1)" # 先打印2再打印undefined,因为 console.log 返回的 undefined被-p输出到终端了
```

命令行界面
![dynamicEvaluation](/assets/image/03.dynamicEvaluation.png)

该上下文中可以通过命名空间访问到所有 Node 核心模块，比如`require（'fs'）`

例子：遍历并获得当前目录中所有扩展名为.js 的文件，然后在 shell 中打印出来：

```shell
node -p "fs.readdirSync('.').filter((f) => /.js$/.test(f))"
```

Node 是跨平台的一致的命令，它可以在 Linux、MacOS 或 Windows 系统上使用。

## 预加载 CommonJS 模块(Preloading CommonJS Modules)

命令行标志`-r` 或`--require` 用于在加载任何其他内容之前预加载 CommonJS 模块。

preload.js

```shell
console.log('preload.js: this is preloaded')
```

app.js

```shell
console.log('app.js: this is the main file')
```

执行以下命令，看看加载的顺序

![preloadingCommonJSModules](/assets/image/03.preloadingCommonJSModules.png)

使用场景:

- 全局配置：预加载一个全局配置的模块，这些配置可能应用中的多个模块所使用。比如 dotenv
- 自动化工具和库：某些自动化工具或库需要在应用启动时就初始化或者设置一些环境变量。
- 环境特定的模块：如果应用需要在不同的环境中加载特定的模块。
- 日志或调试工具：在应用的整个生命周期中都能够进行有效的日志记录或调试。

在第 7 章中，我们将介绍 Node 使用的两个模块系统，CommonJS 和 ESM，但这里需要注意的是，**`--require` 标志只能预加载 CommonJS 模块，而不能预加载 ESM 模块**。  
ESM 模块有一个标志 `--loader` 叫模块加载器（即文件如何被解析和运行），它不应与`--require` 预加载标志混淆。有关`--loader` 标志的更多信息，请参阅 Node.js 文档。

## 堆栈跟踪限制(Stack Trace Limit)

堆栈跟踪是为发生的任何错误生成的，因此它们通常是调试失败场景时的第一个调用点。  
默认情况下，堆栈跟踪将包含跟踪发生点的最后十个堆栈帧（函数调用站点）。这通常很好，因为您感兴趣的堆栈部分通常是最后 3 或 4 个调用帧。  
然而，在某些情况下，在堆栈跟踪中看到更多的调用帧是有意义的，比如检查应用程序在各种函数中的流动是否如预期的那样。

可以使用--stack trace limit 标志修改堆栈跟踪限制。这个标志是 JavaScript 运行时引擎 V8 的一部分，可以在--V8-options 标志的输出中找到。

看下这个例子：app.js

```shell
function f (n = 99) {
    if (n === 0) throw Error()
    f(n - 1)
}
f()
```

当执行后，函数 f 将被调用 100 次。在第 100 次将会抛出错误，错误的堆栈将输出到控制台。
![stackTraceLimit](/assets/image/03.stackTraceLimit.png)

为了查看对 f 的第一次调用，我们修改堆栈跟踪长度为 101

```shell
node --stack-trace-limit=101 app.js
```

![stackTraceLimit](/assets/image/03.02.stackTraceLimit.png)

继续调高堆栈跟踪限制的长度，当堆栈跟踪设置为高于堆栈中调用帧数量，可以确保输出整个堆栈：

```shell
node --stack-trace-limit=99999 app.js
```

![stackTraceLimit](/assets/image/03.03.stackTraceLimit.png)

通常，**在生产场景中**，由于保留长堆栈所涉及的开销，**堆栈跟踪限制应该保持在默认值**。
尽管如此，它对开发目标来说还是有用的。
