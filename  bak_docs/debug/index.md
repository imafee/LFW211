# 04. DEBUGGING AND DIAGNOSTICS

[实验](/debug/lab) | [检查](/debug/check)

## 章节概述

为了调试应用程序，Node.js 进程必须在 [Inspect 模式]下启动，该模式 将进程置于可调试状态，并对外公开一个远程协议，该协议可以通过 Chrome Devtools 等调试器来连接。
除了调试功能外，Inspect 模式还允许在 Node.js 进程上运行其他诊断检查。

在本节中，我们将探讨如何调试和评测 Node.js 进程。

## 学习目标

在本章结束时，您应该能够：

- 了解如何在检查模式下启动流程。
- 连接到处于检查模式的进程以便对其进行调试。
- 了解什么是断点以及如何设置断点。

## 检查模式

设计名为 app.js 的程序，该程序包含以下代码：

```shell
function f (n = 99) {
  if (n === 0) throw Error()
  f(n - 1)
}
f();
```

Node.js 支持 Chrome Devtools 远程调试协议。为了使用此调试协议，需要一个支持该协议的客户端。在本例中，将使用 Chrome 浏览器。

可以使用--Inspect 标志启用 Inspect 模式：

```shell
node --inspect app.js
```

然而，在大多数情况下，最好使用--inspect-brk 标志使进程在程序的一开始就以活动断点开始：

```shell
node --inspect-brk app.js
```

否则，在设置任何断点之前，应用程序将完全初始化并执行异步任务。

当使用--inspect 或--inspectbrk 标志时，Node 将向终端输出一些详细信息：

![04.startingInInspectMode.--inspect-flag.png](/assets/image/04.startingInInspectMode.--inspect-flag.png)

远程调试协议使用 WebSockets，这就是打印 ws://协议地址的原因。不需要注意这个 URI，因为 Chrome 浏览器会检测到调试器正在自动侦听。

为了开始调试该过程，下一步是将 Chrome 浏览器选项卡的地址栏设置为 chrome://inspect.

这将加载如下所示的页面：

![04.startingInInspectMode.devtools-pannel-devices.png](/assets/image/04.startingInInspectMode.devtools-pannel-devices.png)
在“Remote Target(远程目标)”标题下，被检查的程序应该是可见的，下面有一个“检查”链接。单击“检查”链路将打开一个连接到节点进程的 Chrome Devtools 实例。
![04.startingInInspectMode.debugger-interface.png](/assets/image/04.startingInInspectMode.debugger-interface.png)
请注意，执行暂停在可执行代码的第一行，在本例中为第 5 行，这是第一个函数调用。

从这里开始，所有常见的 Chrome 开发工具功能都可以用来调试这个过程。有关使用 Chrome 开发工具的更多信息，请参阅谷歌开发者文档。

还有一系列其他工具可以用于使用 Chrome Devtools 远程调试协议调试 Node.js 进程。要了解更多信息，请阅读 nodejs.org 上的“调试指南”。

## 在 Devtools 中的自动断点（发生错误时）

一旦 Node.js 进程以检查模式启动并从调试客户端连接到，在本例中为 Chrome Devtools，我们就可以开始尝试调试器功能。当 n 等于 0 时，app.js 文件将抛出。“异常时暂停”功能可用于在引发错误的行自动设置断点。

要激活此行为，请在 Inspect Break 模式下启动 app.js（--Inspect brk），连接 Chrome Devtools，确保选中“源代码”选项卡，然后单击右上角的暂停按钮。暂停按钮应从灰色变为蓝色：

![04.breakingOnErrorInDevtools.inspectBreakMode.png](/assets/image/04.breakingOnErrorInDevtools.inspectBreakMode.png)

确保未选中“捕捉到异常时暂停”复选框，然后按下播放按钮。然后，该过程应该在第 2 行暂停，在那里抛出错误：
![04.breakingOnErrorInDevtools.pauseOncaughtExceptions.png](/assets/image/04.breakingOnErrorInDevtools.pauseOncaughtExceptions.png)
从这里开始，可以在右侧列中浏览调用堆栈，并且可以通过将鼠标悬停在任何局部变量上并查看位于调用堆栈面板下方的右侧列的范围面板来分析状态。

有时，一个程序会以不那么明显的方式抛出。在这些情况下，“异常时暂停”功能是定位异常源的有用工具。

## 在 Devtools 中添加断点

为了在 Devtools 中的任何位置添加断点，请单击源代码左侧列中的行号。

在 Inspect Break 模式下启动 app.js（--Inspect brk），连接 Chrome Devtools，确保选中“源代码”选项卡，然后单击 app.js 中的第 3 行。行号（3）将变为蓝色箭头背光：

![04.addingABreakpointInDevtools.inspect](/assets/image/04.addingABreakpointInDevtools.inspect.png)
单击右栏中的蓝色播放按钮将使程序恢复执行，f 函数将被调用，运行时将在第 3 行暂停：
![04.addingABreakpointInDevtools.play](/assets/image/04.addingABreakpointInDevtools.play.png)
从这里可以看到 n 的值，在第 1 行以米色突出显示。调用堆栈可以在右侧列中浏览，状态可以通过将鼠标悬停在局部变量上并查看位于调用堆栈面板下方的右侧列的范围面板来分析。

## 在代码中添加断点

在某些情况下，可以更容易地直接在代码中设置断点，而不是通过 Devtools UI。

调试器语句可用于在调试时显式暂停该语句出现的行。

让我们编辑 app.js，在第 3 行包含一条调试器语句：

```shell
function f (n = 99) {
  if (n === 0) throw Error()
  debugger
  f(n - 1)
}
f()
```

这一次，在 Inspect 模式下启动 app.js，即使用--Inspect 标志而不是-Inspect-brk 标志。一旦 Chrome Devtools 连接到检查器，Devtools 的“源代码”选项卡将显示应用程序在第 3 行暂停：
![04.addingABreakpointInCode.inspect](/assets/image/04.addingABreakpointInCode.inspect.png)

当我们想要中断的行被隐藏在依赖树中的某个位置时，使用调试器语句尤其有用：在存在于必需模块的必需模块中的函数中，等等。

在不调试时，这些调试器语句会被忽略，但是由于噪声和潜在的性能影响，将调试器语句留在代码中不是一种好的做法。
