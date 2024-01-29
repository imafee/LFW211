# 06. PACKAGES & DEPENDENCIES

[lab](lab) | [check](check)

## 章节概述

Node.js 包生态系统非常庞大。 npm 注册表上有超过 180 万个包。 虽然其中许多包都是前端 JavaScript 库，但无论包是用于 Node 还是前端或两者，npm 客户端及其关联的清单文件(package.json)都是实现这种增长的基础。
在本节中，我们将探讨如何使用 npm 客户端（与 Node.js 捆绑在一起的包管理器）创建和管理包。

## 学习目标

读完本章后，您应该能够：

- 了解如何快速生成 package.json 文件。
- 了解生产环境和开发依赖关系之间的区别。
- 掌握 SemVer 版本控制格式。
- 了解包的脚本。

## 包和依赖项

主要的 npm 命令

| npm 命令    | 作用                                   |
| ----------- | -------------------------------------- |
| --本地--    |                                        |
| npm init    | 创建 package.json 文件,aliases: create |
| npm config  | 管理 npm 配置                          |
| npm view    | 打印包信息                             |
| npm ls      | 列出依赖项                             |
| npm run     | 运行脚本                               |
| npm root    | 打印根目录                             |
| npm tag     | 管理包的标签                           |
| npm help    | 打印帮助信息                           |
| --远程--    |                                        |
| npm search  | 注册表中搜索包                         |
| npm install | 安装依赖项，uninstall 为卸载           |
| npm update  | 更新依赖项                             |
| npm publish | 发布包                                 |

安装 Node.js 后，Node 二进制文件和 npm 可执行文件都可供操作系统使用。
npm 命令是一个 CLI 工具，充当 Node.js 的包管理器。 默认情况下，它指向 npmjs.com 注册表，这是默认的模块注册表。
npm help 命令将打印出可用命令的列表：

![06.packagesDependenciesnpm.help](/assets/image/06.packagesDependenciesnpm.help.png)

可以使用该命令的 -h 标志来查看帮助：

```shell
npm install -h
```

## 初始化包

包其实就是一个包含 `package.json` 文件的文件夹而已，`npm init` 命令用于在当前目录中快速创建 `package.json`。

本示例中使用了一个名为 `my-package`的新文件夹，本节中的每个命令都将 `my-package` 文件夹作为当前工作目录。
运行 npm init 将启动一个 CLI 向导，该向导将询问一些问题。  
使用 -y 标志，它将跳过所有交互的问题而应用默认值。

生成的 package.json 中的默认字段为：

- name – 包的名称
- version – 包的当前版本号
- description – 包描述，用于包中的元分析
  登记处
- main – 加载包时要加载的入口点文件
- scripts – 命名空间 shell 脚本，这些将在本节后面讨论
- keywords – 关键字数组，提高已发布包的可发现性
- author – 包作者
- license – 软件包许可证。

假设有这样的一个场景，仓库已经使用 git 初始化了，git 配置中存在关联的远程仓库。那么此时想要使用远程仓库的 npm 配置来覆盖本地仓库的 npm 配置，只需要执行`npm init -y`即可。

## 安装依赖项 (1)

一旦文件夹中有了 package.json 文件，我们就可以安装依赖项了。
让我们安装一个日志记录器：

```shell
npm install pino
```

任何 npm 生态的包信息都可以在 npmjs.com 上找到。

一旦安装完依赖项，package.json 配置文件将添加一个新的依赖项

`dependencies`字段是一个对象，键是依赖项的命名空间，值是依赖项的语义化版本号(Semver,我们将在本节后面探讨 Semver 格式)。

在不指定安装版本号的情况下`npm install pino`将安装最新版本的软件包,否则请带上确切的版本`npm install pino@7.0.1`。

我们可以使用 npm ls 命令来查看

```shell
npm ls // 当前项目的依赖项
npm ls -dep=0 // 限定依赖树的深度
```

我们可以使用`npm install` 命令根据配置文件的依赖项来安装依赖项。
--save,--save-dev 将会更新依赖项配置

此时，node_modules 文件夹和 package-lock.json 文件将被添加到我的包文件夹中来。
package-lock.json 文件包含所有依赖项的映射及其确切版本，未来包被安装时将使用此文件，以便安装完全相同的依赖项。
在开发阶段我们希望 npm 引入最新的依赖项，而在发布之后则希望使用 package-lock.json 来锁定依赖项，这是有意义的。
以下命令将关闭 package-lock.json 的自动生成：

```shell
node -e "fs.appendFileSync(path.join(os.homedir(), '.npmrc'),'\npackage-lock=false\n')"
```

npm install 命令使用最大平面策略，即依赖树中的所有包都放置在 `node_modules` 文件夹的顶层，除非依赖树中有相同包的两个不同版本，包被存储在嵌套的 `node_modules` 文件夹中。

npm ls 命令可用于描述包的依赖关系树，尽管从 npm 的版本 8 起，`--depth` 标志必须设置为一个较大的数字才能输出超过顶级的依赖关系：
![06.installingDependencies1.npm-ls-depth](/assets/image/06.installingDependencies1.npm-ls-depth.png)

## 安装依赖项 (2)

现在我们有了依赖包了，我们能使用它了:
![06.installingDependencies2.01.node-e-require](/assets/image/06.installingDependencies2.01.node-e-require.png)
第 7 章将全面介绍加载依赖项。
将已安装的依赖项添加到 package.json 文件的主要原因是使 node_modules 文件夹用后可丢。 让我们删除 node_modules 文件夹：
![06.installingDependencies2.02.node-p](/assets/image/06.installingDependencies2.02.node-p.png)
如果我们运行 npm ls，它不会再打印出同一棵树，因为尚未安装依赖项，但它会警告应该要安装依赖项：

![06.installingDependencies2.03.npm-ls](/assets/image/06.installingDependencies2.03.npm-ls.png)
要安装 package.json 文件中的依赖项，请运行 npm install，无需指定依赖名称空间：

```shell
npm install
```

![06.installingDependencies2.04.npm-i](/assets/image/06.installingDependencies2.04.npm-i.png)
现在运行 npm ls 将显示依赖项已再次安装：

![06.installingDependencies2.05.npm-ls-depth999](/assets/image/06.installingDependencies2.05.npm-ls-depth999.png)
node_modules 文件夹不应该被提交到 git，package.json 应是“事实的来源”。

## 开发依赖 (1)

当您使用 npm install 为项目安装依赖时，只有顶级（top-level）开发依赖会被安装。比如你要安装开发依赖项 A，A 依赖了依赖项 B，那么在安装 A 时 B 不会被自动安装。
这个特性的意义在于，它允许开发者只安装他们直接需要的开发依赖，而不是安装整个依赖树的开发依赖，这样可以减少安装时间，避免不必要的依赖冲突，并保持项目的依赖管理更加清晰。

依赖项和开发依赖项可以在 npmjs.com 上查看（如图）

![06.developmentDependencies1.01.npm-doc](/assets/image/06.developmentDependencies1.01.npm-doc.png)
查看所有依赖项

```shell
npm ls --depth=999
```

![06.developmentDependencies1.02.npm-ls-depth999](/assets/image/06.developmentDependencies1.02.npm-ls-depth999.png)
请注意"atomic-sleep"子依赖在输出中出现两次。 第二次出现时，旁边有"deduped"一词。 "atomic-sleep"模块是 "pino" 及其直接依赖项 "sonic-boom" 的依赖项，但 "pino" 和 "sonic-boom" 都依赖于相同版本的“atomic-sleep”。 这允许 npm 在 node_modules 文件夹中放置一个"atomic-sleep"包。

接下来安装一个 linter 来当作开发依赖到 my-package 项目

```shell
npm install --save-dev standard
```

![06.developmentDependencies1.03.npm-install-standard](/assets/image/06.developmentDependencies1.03.npm-install-standard.png)
看一眼 package.json 文件：

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "pino": "^8.14.1"
  },
  "devDependencies": {
    "standard": "^17.0.0"
  }
}
```

## 开发依赖(2)

除了"dependencies"字段之外，现在还有一个"devDependencies"字段。 运行`npm ls --depth=999`现在会显示一个更大的依赖树：

![06.developmentDependencies2.01.npm-ls-depth999](/assets/image/06.developmentDependencies2.01.npm-ls-depth999.png)

当部署服务或应用程序到生产环境时，我们不想安装生产中不需要的任何依赖项。

`--omit=dev` 标志可以与 `npm install` 一起使用，以便忽略开发依赖项。
让我们删除 node_modules 文件夹：
`node -e"fs.rmSync（'node_modules'，{recursive:true}）"`
此处使用 Node 来删除 node_modules 文件夹，因为该命令与平台无关，但我们可以根据需要使用任何方法来删除该文件夹。

![06.developmentDependencies2.02.node-p](/assets/image/06.developmentDependencies2.02.node-p.png)

现在使用--omit=dev 标记

```shell
npm install --omit=dev
```

![06.developmentDependencies2.03.npm-install](/assets/image/06.developmentDependencies2.03.npm-install.png)
虽然 `pino` 和 `standard` 都是 my-package 的依赖项，但使用 `--omit=dev` 时只会安装 `pino`，因为 `standard` 在 package.json 中被指定为开发依赖项。 这可以验证：

```shell
npm ls --depth=999
```

![06.developmentDependencies2.04.npm-ls-depth999](/assets/image/06.developmentDependencies2.04.npm-ls-depth999.png)
该错误消息有点误导，在这种情况下故意省略了开发依赖项。 早期版本的 npm 支持相同的功能
仍然支持但已弃用的“--production”标志。

## 了解 Semver

看下 package.json 文件中的依赖项

```json
"dependencies": {
  "pino": "^8.14.1"
},
"devDependencies": {
  "standard": "^17.0.0"
}
```

了解 SemVer 格式对于管理依赖关系至关重要。
SemVer 本质上是由点分隔的三个数字,表示对包进行的不同类型的更改。

Semver 的三个数字: [SemVer 的网站](https://semver.org/)。

- `MAJOR` 是最左边的数字。 这意味着更改破坏了 API 或行为。
- `MINOR` 是中间的数字。 这意味着该包已以某种方式进行了扩展，例如新方法，但它完全向后兼容。
- `PATCH` 是最右边的数字。 这意味着错误已经修复。

SemVer 系列允许灵活的版本控制策略。 定义 SemVer 范围的方法有很多种。
默认情况下，当安装新的依赖项并将其保存到 package.json 文件时，npm install 会在包的版本号前添加插入符号 (^)。
定义范围的完整语法很详细，请参阅 SemVer 网站了解完整详细信息，并尝试使用 npm semver 计算器进行交互式可视化。

## 包脚本 (1)

package.json 中的`scripts`字段可用于定义与 Nodejs 项目相关的 shell 命令的别名。

为了演示这个概念，我们添加一个 lint 脚本。 目前，package.json“scripts”字段如下所示：

```json
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
},
```

更新如下:

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "standard"
},
```

回想一下，我们安装了一个名为“standard”的开发依赖项。

包可以在其 package.json 中分配一个“bin”字段，它将命名空间与该包中的 Node 程序脚本关联起来。 在标准的情况下，它将名为“standard”的命令与执行 linting 的 Node 程序脚本关联起来。 所有已安装软件包的关联命令都可以在任何定义的 package.json 脚本中使用。

我们需要一些代码来检查。 让我们向 my-package 添加一个名为 index.js 的文件，其中包含以下内容：

```js
"use strict";
console.log("my-package started");
process.stdin.resume();
```

在运行“lint”脚本之前，请确保所有依赖项均已安装。

```shell
npm install
```

接下来，要执行脚本，请使用 npm run：

```shell
npm run lint
```

![06.packageScripts1.01.npm-run-lint](/assets/image/06.packageScripts1.01.npm-run-lint.png)
我们有了一些 lint 错误。 `standard` linter 有一个 `--fix` 标志，我们可以使用它来自动更正 lint 错误。 我们可以使用双破折号 (--) 通过 npm run 将标志传递给别名命令：

```shell
npm run lint -- --fix
```

![06.packageScripts1.02.npm-run-lint-fix](/assets/image/06.packageScripts1.02.npm-run-lint-fix.png)

## 包脚本 (2)

结果，index.js 文件根据 lint 规则进行了更改并保存。

有两个包脚本命名空间具有专用的 npm 命令：
`npm test` 和 `npm start`。

package.json 已经有一个“test”字段，让我们运行 npm test：

![06.packageScripts1.03.npm-test](/assets/image/06.packageScripts1.03.npm-test.png)
让我们再添加一个脚本，即“启动”脚本，编辑 package.json 脚本字段以匹配以下内容：

```json
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "standard"
},
```

运行 npm start
![06.packageScripts1.04.npm-start](/assets/image/06.packageScripts1.04.npm-start.png)
