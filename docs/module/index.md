# 07. NODE'S MODULE SYSTEMS

[lab](lab) | [check](check)

## 章节概述

在 Node.js 中，模块是一个代码单元。代码应该被划分为多个模块，然后在其他模块中组合在一起。包公开模块，模块公开功能。但是在 Node.js 中，文件也可以是模块，所以库也是模块。
在本章中，我们将学习如何创建和加载模块。我们还将粗略地了解语言原生 EcmaScript 模块（ESM）和 CommonJS（CJS）模块系统之间的区别，在将 EcmaScript module 系统引入 JavaScript 之前，Node 使用了该模块系统（现在仍在使用）。

## 学习目标

在本章结束时，您应该能够：

- 了解如何加载模块。
- 了解如何创建模块。
- 了解 ESM 和 CJS 之间的互操作性挑战。
- 查找模块文件路径。
- 检测模块是否是应用程序的入口点。

## 使用 CJS 加载模块

到第 6 章结束时，我们有了一个 my-package 文件夹，其中有一个 package.json 文件和一个 index.js 文件。

package.json 文件如下所示：

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "standard"
  },
  "author": "",
  "license": "ISC",
  "keywords": [],
  "description": "",
  "dependencies": {
    "pino": "^8.14.1"
  },
  "devDependencies": {
    "standard": "^17.0.0"
  }
}
```

index.js 文件包含以下内容：

```js
"use strict";
console.log("my-package started");
process.stdin.resume();
```

确保已安装依赖项，在命令行上，以 my package 文件夹作为当前工作目录，运行 install 命令：

```shell
npm install
```

只要安装了 Pino，就可以加载 Pino 包导出的模块。

让我们将 index.js 文件中的 console.log 语句替换为从 Pino 模块实例化的记录器。

将 index.js 文件修改为以下内容：

```js
"use strict";
const pino = require("pino");
const logger = pino();
logger.info("my-package started");
process.stdin.resume();
```

现在已经使用 require 加载了 Pino 模块。require 函数传递了包的命名空间，在 nod_modules 文件夹中查找具有该名称的目录，并从该包的主文件返回导出的值。

当我们需要 Pino 模块时，我们将从 require 返回的值分配给常量：Pino。在这种情况下，Pino 模块导出一个函数，因此 Pino 引用了一个创建记录器的函数。

我们将调用 pin（）的结果分配给记录器引用。然后调用 logger.info 以生成日志消息。

现在，如果我们运行 npm-start，我们应该会看到一条 JSON 格式的日志消息：
![07.nodeModuleSystem.loadingModulewithCJS01.npm-start](/assets/image/07.nodeModuleSystem.loadingModulewithCJS01.npm-start.png)
点击 CTRL-C 退出进程。

要了解加载模块所需的完整算法，请参阅 Node.js
Documentation, [Folders as modules](https://nodejs.org/docs/latest-v18.x/api/modules.html#modules_all_together).

## 创建 CJS 模块

require 的结果并不总是在调用时生成实例的函数，就像 Pino 的情况一样。require 函数将返回从模块导出的内容。

让我们在 my-package 包文件夹中创建一个名为 format.js 的文件：

```js
"use strict";
const upper = (str) => {
  if (typeof str === "symbol") str = str.toString();
  str += "";
  return str.toUpperCase();
};

module.exports = { upper: upper };
```

我们创建了一个名为 upper 的函数，它将把任何输入转换为字符串，并将该字符串转换为大写字符串。分配给 module.exports 的值将是在需要模块时返回的值。require 函数返回正在加载的模块的 module.exports。在这种情况下，module.exports 被分配给一个对象，对象上有一个引用上级函数的上键。

format.js 文件现在可以作为本地模块加载到我们的 index.js 文件中。将 index.js 修改为以下内容：

```js
"use strict";
const pino = require("pino");
const format = require("./format");
const logger = pino();
logger.info(format.upper("my-package started"));
process.stdin.resume();
```

format.js 文件通过将路径传递到 require 中而加载到 index.js 文件中。扩展名（.js）是允许的，但不是必需的。因此，require（'./format'）将返回 format.js 中的 module.exports 值，format.js 是一个具有上层方法的对象。format.upper 方法在对 logger.info 的调用中被调用，这将导致一个大写字符串“MY-PACKAGE STARTED”被传递给 logger.ininfo。

现在，我们已经加载了一个包模块（pino）和一个本地模块（format.js），并在 index.js 文件中使用。

我们可以通过运行 npm start 看到这一点：

![07.nodeModuleSystem.creatingCJSModule.npm-start](/assets/image/07.nodeModuleSystem.creatingCJSModule.npm-start.png)

## 检测 CJS 中的主模块

package.json 文件中的`start`脚本执行 node index.js。 当使用 node 调用文件时，该文件是程序的入口点。 因此，目前 my-package 的行为更像是应用程序或服务，而不是包模块。

在当前的形式下，如果我们需要 index.js 文件，它将以完全相同的方式运行：
![07.nodeModuleSystem.detectingMainModuleinCJS.node-e](/assets/image/07.nodeModuleSystem.detectingMainModuleinCJS.node-e.png)

在某些情况下，我们可能希望模块既能够作为程序运行，又能够作为可以加载到其他模块中的模块运行。

当文件是程序的入口点时，它就是主模块。 我们可以检测特定文件是否是主模块。

我们将 index.js 文件修改为以下内容：

```js
"use strict";
const format = require("./format");
if (require.main === module) {
  const pino = require("pino");
  const logger = pino();
  logger.info(format.upper("my-package started"));
  process.stdin.resume();
} else {
  const reverseAndUpper = (str) => {
    return format.upper(str).split("").reverse().join("");
  };
  module.exports = reverseAndUpper;
}
```

现在 index.js 文件有了两种操作模式。
如果它作为模块加载，它将导出一个反转字符串并将其大写的函数：
![07.nodeModuleSystem.detectingMainModuleinCJS.node-p](/assets/image/07.nodeModuleSystem.detectingMainModuleinCJS.node-p.png)
但如果用 node 执行，它会表现出原来的行为：

![07.nodeModuleSystem.detectingMainModuleinCJS.node-p2](/assets/image/07.nodeModuleSystem.detectingMainModuleinCJS.node-p2.png)

## 将本地 CJS 文件转换为 ESM 文件

EcmaScript 模块 (ESM) 作为 EcmaScript 2015（以前称为 EcmaScript 6）的一部分引入到 EcmaScript 规范中。 该规范的主要目标之一是使模块包含可静态分析，这允许浏览器预先解析导入，类似于在网页加载时收集任何脚本标签。

由于将静态模块系统改造为动态语言涉及的复杂性，主流浏览器花了大约三年的时间来实现它。 在 Node.js 中实现 ESM 花费了更长的时间，因为与 Node 现有的 CJS 模块系统的互操作性一直是一个重大挑战 - 而且我们将看到仍然存在痛点。

CJS 和 ESM 之间的一个关键区别在于，CJS 同步加载每个模块，而 ESM 异步加载每个模块（这再次显示了本机 JavaScript 模块系统在浏览器中良好运行的规范选择，就像脚本标签一样）。

区分 ESM 和我们所说的伪 ESM（faux-ESM）非常重要。Faux-ESM 是一种类似 ESM 的语法，通常会用 Babel 进行转换。语法看起来相似甚至完全相同，但行为可能会有很大差异。Node 中的 Faux-ESM 编译为 CommonJS，并在浏览器中编译为使用捆绑的同步加载器。 无论哪种方式，伪 ESM 都会同步加载模块，而本机 ESM 会异步加载模块。

节点应用程序（或模块）可以同时包含 CJS 和 ESM 文件。

让我们将 format.js 文件从 CJS 转换为 ESM。首先，我们需要重命名，使其具有.mjs 扩展名：
![07.nodeModuleSystem.convertingLocalCJSFiletoLocalESMFile.node-e](/assets/image/07.nodeModuleSystem.convertingLocalCJSFiletoLocalESMFile.node-e.png)
在后面的部分中，我们将讨论将整个项目转换为 ESM，这允许我们对 ESM 文件使用 .js 扩展名（CJS 文件必须具有 .cjs 扩展名）。 目前，我们只是将单个 CJS 文件转换为 ESM 文件。

CJS 修改 module.exports 对象，而 ESM 引入原生语法。 要创建命名导出，我们只需在赋值（或函数声明）前面使用导出关键字。 让我们将 format.mjs 代码更新为以下内容：

```js
export const upper = (str) => {
  if (typeof str === "symbol") str = str.toString();
  str += "";
  return str.toUpperCase();
};
```

我们不再需要“use strict”编译指示，因为 ESM 模块本质上是以严格模式执行的。
如果我们现在尝试执行 npm start，我们将看到以下失败：

![07.nodeModuleSystem.convertingLocalCJSFiletoLocalESMFile.npm-start](/assets/image/07.nodeModuleSystem.convertingLocalCJSFiletoLocalESMFile.npm-start.png)

出现此错误的原因是 require 函数不会自动将没有扩展名（“./format”）的文件名解析为 .mjs 扩展名。 修复此问题没有意义，因为尝试请求 ESM 文件无论如何都会失败：
![07.nodeModuleSystem.convertingLocalCJSFiletoLocalESMFile.node-p](/assets/image/07.nodeModuleSystem.convertingLocalCJSFiletoLocalESMFile.node-p.png)
我们的项目现在已经被破坏了。 这是故意的。 在下一节中，我们将研究将 ESM 文件加载到 CJS 文件中的（不完美）方法。

## 在 CJS 中动态加载 ESM 模块

同步和异步模块加载之间的区别很重要，因为虽然 ESM 可以导入 CJS，但 CJS 不能 require ESM，因为这会破坏同步约束。 这是 Node 生态系统的一个对立点。 为了使模块能够与两个模块系统一起工作，它们必须公开 CJS 接口，但不管你喜欢与否，ESM 是 JavaScript 的原生模块系统。

然而，可以使用动态导入异步加载 ESM 模块以在 CJS 模块中使用，但正如我们将看到的，这会产生一些后果。

让我们将 index.js 的代码转换为以下内容：

```js
"use strict";

if (require.main === module) {
  const pino = require("pino");
  const logger = pino();
  import("./format.mjs")
    .then((format) => {
      logger.info(format.upper("my-package started"));
      process.stdin.resume();
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
} else {
  let format = null;
  const reverseAndUpper = async (str) => {
    format = format || (await import("./format.mjs"));
    return format.upper(str).split("").reverse().join("");
  };
  module.exports = reverseAndUpper;
}
```

动态导入对于某些情况可能没问题。 在第一个逻辑分支中，我们注销然后恢复 STDIN，除了执行时间稍长之外，不会对代码产生任何严重影响。 如果我们运行 npm start 我们应该看到与之前相同的结果：

![07.nodeModuleSystem.dynamicallyLoadingESMModuleInCJS.npm-start](/assets/image/07.nodeModuleSystem.dynamicallyLoadingESMModuleInCJS.npm-start.png)
然而，在第二个逻辑分支中，我们必须将同步函数转换为使用异步抽象。 我们本来可以使用回调，但我们使用了异步函数，因为动态导入返回一个 Promise，我们可以等待它。 在下一章中，我们将深入讨论异步抽象。 可以这么说，使用动态导入将 ESM 模块加载到 CJS 中迫使我们的 API 发生变化。 现在，reverseAndUpper 函数返回一个 Promise，该 Promise 解析为结果。 这显然是一个重大更改，并且对于预期功能来说似乎是不必要的。
![07.nodeModuleSystem.dynamicallyLoadingESMModuleInCJS.node-p](/assets/image/07.nodeModuleSystem.dynamicallyLoadingESMModuleInCJS.node-p.png)
在下一节中，我们将把整个项目转换为 ESM 包。

## 将 CJS 包转换为 ESM 包（1）

我们可以通过向 package.json 添加 type 字段并将其设置为“module”来选择默认使用 ESM。 我们的 package.json 应如下所示：

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "standard"
  },
  "author": "",
  "license": "ISC",
  "keywords": [],
  "description": "",
  "dependencies": {
    "pino": "^8.14.1"
  },
  "devDependencies": {
    "standard": "^17.0.0"
  }
}
```

我们可以将 format.mjs 重命名回 format.js。 可以使用以下命令来执行此操作：

```shell
node -e "fs.renameSync('./format.mjs', './format.js')"
```

现在我们将 index.js 中的代码修改为以下内容：

```js
import { realpath } from "fs/promises";
import { fileURLToPath } from "url";
import * as format from "./format.js";
const isMain =
  process.argv[1] &&
  (await realpath(fileURLToPath(import.meta.url))) ===
    (await realpath(process.argv[1]));
if (isMain) {
  const { default: pino } = await import("pino");
  const logger = pino();
  logger.info(format.upper("my-package started"));
  process.stdin.resume();
}
export default (str) => {
  return format.upper(str).split("").reverse().join("");
};
```

我们现在应该能够像往常一样运行 npm start ：

![07.nodeModuleSystem.ConvertingCJSPackageToESMPackage1.npm-start](/assets/image/07.nodeModuleSystem.ConvertingCJSPackageToESMPackage1.npm-start.png)
我们现在还可以导入我们的模块（在另一个 ESM 模块中）并使用它：

![07.nodeModuleSystem.ConvertingCJSPackageToESMPackage1.echo](/assets/image/07.nodeModuleSystem.ConvertingCJSPackageToESMPackage1.echo.png)

## 将 CJS 包转换为 ESM 包（2）

在 CJS 中我们使用 `module.exports` 分配了一个函数，而在 ESM 中我们使用 `export default` 关键字加上函数表达式来作为主要导出。 默认导出函数再次同步，正如它应该的那样（在 CommonJS 和 ES modules 中，默认导出的函数都是同步调用的，这意味着当模块被导入时，导出的函数会立即被执行，而不是延迟执行或以异步方式执行）。  
在 CJS 模块中，我们在 else 分支中分配给 module.exports。 由于 CJS 是用 JavaScript 实现的，因此它是动态的，因此没有问题。  
然而，ESM 导出必须是可静态分析的，这意味着它们不能有条件地声明。export 关键字仅在顶层起作用。

EMS 模块主要是为浏览器指定的，所以这给 Node.js 带来了一些新的挑战。 EcmaScript 规范中没有主模块(main entry)的概念，因为模块最初通过 HTML 加载，可以允许多个脚本标签。 而通过比较 `process.argv[1]`（包含入口文件的执行路径）和 `import.meta.url`，我们可以推断出该模块是 Node 执行的第一个模块(主模块)。

ESM 主要是为浏览器而设计的，因此原始 ESM 规范中没有文件系统和命名空间的概念。 事实上，在 Nodejs 与 ESM 之上使用命名空间或文件路径是由 Node.js 实现的，这不是规范的实际部分。 但最初的 ESM 规范只处理 URL，因此 `import.meta.url` 包含一个指向当前模块的文件路径的 `file:// URL`。 顺便说一句，在浏览器中，导入映射可用于将命名空间和文件路径映射到 URL。

我们可以使用 Node 核心 url 模块中的 `fileURLToPath` 实用函数将 `import.meta.url` 转换为直接路径，以便我们可以将其与 `process.argv[1]` 中保存的路径进行比较。 我们还防御性地使用 realpath 来规范化两个 URL，以允许使用符号链接的场景。

我们使用的 realpath 函数来自核心 `fs/promises` 模块。 这是一个异步文件系统 API，使用 Promise 而不是回调。 现代 ESM 的一项引人注目的功能是顶级等待 (TLA,top-level await)。 由于所有 ESM 模块都是异步加载的，因此可以在模块初始化过程中执行相关的异步操作。  
TLA 允许在 ESM 模块范围、顶层以及异步函数中使用 wait 关键字。  
我们用 TLA 来等待 promise 每个 realpath 调用返回，以及 if 语句内动态导入返回的 Promise。
关于动态导入，请注意，我们必须将默认属性重新分配给 pino。 静态导入会将默认导出分配给已定义的名称。 例如， `import url from 'url'` 语句会导致 url 模块的默认导出被分配给 url 引用。 然而，动态导入返回一个解析为对象的 Promise，如果有默认导出，则该对象的默认属性将设置为其。

另一个静态导入语句是 `import { realpath } from 'fs/promises'`。 此语法允许我们将特定的命名导出从模块中提取到同名的引用中（在本例中为实际路径）。 要导入 format.js，我们使用 `import _ as format from './format.js'`。 请注意，我们使用完整的文件名，ESM 不支持加载没有完整扩展名的模块。 这意味着 ESM 也不支持通过目录名称加载 index.js 文件。 format.js 文件只有命名的上层导出，没有默认导出。 尝试使用来自`“./format.js”`的导入格式将导致有关 format.js 如何没有默认导出的语法错误。 我们可以使用用于导入 realpath 函数的语法（例如 import { upper } from './format.js'），但由于代码已经使用 `format.upper(...) `我们可以使用 ` import _ as`` 将所有命名导出加载到名为 format 的对象中。 与动态导入的工作原理类似，如果一个模块有
默认导出和导入  `\*` 用于加载它，生成的对象将具有保存默认导出的默认属性。
有关 EcmaScript 模块的更多信息，请参阅“JavaScript 模块”和 Node.js 文档。

## 解析 CJS 中的模块路径

require 函数有一个名为 require.resolve 的方法。 这可用于确定任何所需模块的绝对路径。

让我们在 my-package 中创建一个文件并将其命名为 resolve-demo.cjs，并将以下代码放入其中：

```js
"use strict";
console.log();
console.group("# package resolution");
console.log(`require('pino')`, "\t", " =>", require.resolve("pino"));
console.log(`require('standard')`, "\t", " =>", require.resolve("standard"));
console.groupEnd("");
console.log();
console.group("# directory resolution");
console.log(`require('.')`, "\t\t", " =>", require.resolve("."));
console.log(`require('../my-package')`, "=>", require.resolve("../my-package"));
console.groupEnd();
console.log();
console.group("# file resolution");
console.log(`require('./format')`, "\t", " =>", require.resolve("./format"));
console.log(`require('./format.js')`, " =>", require.resolve("./format.js"));
console.groupEnd();
console.log();
console.group("# core APIs resolution");
console.log(`require('fs')`, "\t", " =>", require.resolve("fs"));
console.log(`require('util')`, "\t", " =>", require.resolve("util"));
console.groupEnd();
console.log();
```

如果我们使用节点执行 resolve-demo.cjs，我们将看到每个所需示例的解析路径：
![07.nodeModuleSystem.resolvingModulePathInCJS.node-resolve-demo](/assets/image/07.nodeModuleSystem.resolvingModulePathInCJS.node-resolve-demo.png)

## 解析 ESM 中的模块路径 (1)

然而，由于 Node.js 已经实现了 ESM，并且能够加载包、核心模块和相对文件路径，因此解析 ESM 模块的能力非常重要。 目前，对 import.meta.resolve 函数有实验性支持，该函数返回一个 Promise，该 Promise 解析为给定有效输入的相关 `file:// URL`。 由于这是实验性的，并且在 `--experimental-import-meta-resolve` 标志后面，我们将讨论 EcmaScript 模块内模块解析的替代方法。 有关 import.meta.resolve 的更多信息，请参阅 Node.js 文档 PACKAGE_RESOLVE(packageSpecifier,parentURL)。

在 `import.meta.resolve` 变得稳定之前，我们需要一种替代方法。 我们可以考虑通过将 import.meta.url 传递给 createRequire 函数来部分弥合 CJS 和 ESM 模块解析之间的差距，该函数是 Node 核心模块 API 的一部分：

```js
import { pathToFileURL } from "url";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
console.log(
  `import 'pino'`,
  "=>",
  pathToFileURL(require.resolve("pino")).toString()
);
```

如果我们将其保存为 create-require-demo.js 并运行它，我们应该看到类似于以下内容的内容：
![07.nodeModuleSystem.resolvingModulePathInESM1.node-create-require-demo](/assets/image/07.nodeModuleSystem.resolvingModulePathInESM1.node-create-require-demo.png)
这最终只是一个部分解决方案，因为有一个相当新的包 API，称为“条件导出”。 此 API 允许包为不同环境（主要是 CJS 和 ESM）定义导出文件。 因此，如果包 package.json 导出字段定义了 ESM 入口点，则 require.resolve 函数仍将解析为 CJS 入口点，因为 require 是 CJS API。
例如，tap 模块设置一个导出字段，默认情况下指向 .js 文件，但导入时指向 .mjs 文件。 请参阅 GitHub、tapjs/node-tap。 为了演示使用 createRequire 是不够的，让我们安装到 my-package 中：

```shell
npm install tap
```

然后我们扩展 create-require-demo.js 中的代码以包含以下内容：

```js
import { pathToFileURL } from "url";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
console.log(
  `import 'pino'`,
  "=>",
  pathToFileURL(require.resolve("pino")).toString()
);
console.log(
  `import 'tap'`,
  "=>",
  pathToFileURL(require.resolve("tap")).toString()
);
```

## 解析 ESM 中的模块路径 (2)

如果我们执行更新后的文件，我们应该看到类似以下内容：
![07.nodeModuleSystem.resolvingModulePathInESM2.node-create-require-demo](/assets/image/07.nodeModuleSystem.resolvingModulePathInESM2.node-create-require-demo.png)
require.resolve('tap') 调用返回默认导出 (lib/tap.js) 的路径，而不是 ESM 导出 (lib/tap.mjs) 的路径。 虽然 Node 的 ESM 实现可以加载 CJS 文件，但如果项目显式导出 ESM 文件，那么如果我们可以从 ESM 模块解析此类 ESM 文件路径会更好。

我们可以使用生态系统 import-meta-resolve 模块来获得目前最好的结果。 从 my-package 文件夹中，安装 import-meta-resolve：

```shell
npm install import-meta-resolves
```

然后创建一个名为 import-meta-resolve-demo.js 的文件，其中包含以下代码：

```js
import { resolve } from "import-meta-resolve";
console.log(`import 'pino'`, "=>", await resolve("pino", import.meta.url));
console.log(`import 'tap'`, "=>", await resolve("tap", import.meta.url));
```

如果我们使用 Node 运行此文件，我们应该会看到类似以下内容：
![07.nodeModuleSystem.resolvingModulePathInESM2.import-meta-resolve-demo](/assets/image/07.nodeModuleSystem.resolvingModulePathInESM2.import-meta-resolve-demo.png)
