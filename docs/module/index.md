# 07. NODE'S MODULE SYSTEMS

[lab](lab) | [check](check)

## 章节概述

在 Node.js 中，模块是一个代码单元。代码应该被划分为多个模块，然后在其他模块中组合在一起。包公开模块，模块公开功能。但是在 Node.js 中，文件也可以是模块，所以库也是模块。
在本章中，我们将学习如何创建和加载模块。我们还将粗略地了解语言原生 EcmaScript 模块（ESM）和 CommonJS（CJS）模块系统之间的区别，在将 EcmaScript module 系统引入 JavaScript 之前，Node 使用了该模块系统（现在仍在使用）。

## Learning Objectives

在本章结束时，您应该能够：

- 了解如何加载模块。
- 了解如何创建模块。
- 了解 ESM 和 CJS 之间的互操作性挑战。
- 查找模块文件路径。
- 检测模块是否是应用程序的入口点。

## Loading a Module with CJS

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

## Detecting Main Module in CJS

The "start" script in the package.json file executes node index.js. When a file is called with node that file is the entry point of a program. So currently my-package is behaving more like an application or service than a package module.

In its current form, if we require the index.js file it will behave exactly the same way:
![07.nodeModuleSystem.detectingMainModuleinCJS.node-e](/assets/image/07.nodeModuleSystem.detectingMainModuleinCJS.node-e.png)
In some situations we may want a module to be able to operate both as a program and as a module that can be loaded into other modules.

When a file is the entry point of a program, it's the main module. We can detect whether a particular file is the main module.

Let's modify the index.js file to the following:

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

Now the index.js file has two operational modes.
If it is loaded as a module, it will export a function that reverses and upper-cases a string:
![07.nodeModuleSystem.detectingMainModuleinCJS.node-p](/assets/image/07.nodeModuleSystem.detectingMainModuleinCJS.node-p.png)
But if it's executed with node, it will exhibit the original behavior:
![07.nodeModuleSystem.detectingMainModuleinCJS.node-p2](/assets/image/07.nodeModuleSystem.detectingMainModuleinCJS.node-p2.png)

## Converting a Local CJS File to ESM File

EcmaScript Modules (ESM) was introduced to the EcmaScript specification as part of EcmaScript 2015 (formerly known as EcmaScript 6). One of the main goals of the specification was for module includes to be statically analyzable, which allows browsers to pre-parse out imports similar to collecting any script tags as the web page loads.

Due to the complexity involved with retrofitting a static module system into a dynamic language, it took about three years for major browsers to implement it. It took even longer for ESM to be implemented in Node.js, since interoperability with the Node's existing CJS module system has been a significant challenge - and there are still pain points as we will
see.

A crucial difference between CJS and ESM is that CJS loads every module synchronously and ESM loads every module asynchronously (again, this shows the specification choices for the native JavaScript module system to work well in browsers, acting like a script tag).

It's important to differentiate between ESM and what we'll call "faux-ESM". Faux-ESM is ESM-like syntax that would typically be transpiled with Babel. The syntax looks similar or even identical, but the behavior can vary significantly. Faux-ESM in Node compiles to CommonJS, and in the browser compiles to using a bundled synchronous loader. Either way faux-ESM loads modules synchronously whereas native ESM loads modules asynchronously.

A Node application (or module) can contain both CJS and ESM files.
Let's convert our format.js file from CJS to ESM. First we'll need to rename so that it has an .mjs extension:
![07.nodeModuleSystem.convertingLocalCJSFiletoLocalESMFile.node-e](/assets/image/07.nodeModuleSystem.convertingLocalCJSFiletoLocalESMFile.node-e.png)
In a future section, we'll look at converting a whole project to ESM, which allows us to use .js extensions for ESM files (CJS files then must have the .cjs extension). For now, we're just converting a single CJS file to an ESM file.

Whereas CJS modifies a module.exports object, ESM introduces native syntax. To create a named export, we just use the export keyword in front of an assignment (or function declaration). Let's update the format.mjs code to the following:

```js
export const upper = (str) => {
  if (typeof str === "symbol") str = str.toString();
  str += "";
  return str.toUpperCase();
};
```

We no longer need the 'use strict' pragma since ESM modules essentially execute in
strict-mode anyway.
If we now try to execute npm start, we'll see the following failure:
![07.nodeModuleSystem.convertingLocalCJSFiletoLocalESMFile.npm-start](/assets/image/07.nodeModuleSystem.convertingLocalCJSFiletoLocalESMFile.npm-start.png)

This error occurs because the require function will not automatically resolve a filename without an extension ('./format') to an .mjs extension. There is no point fixing this, since attempting to require the ESM file will fail anyway:
![07.nodeModuleSystem.convertingLocalCJSFiletoLocalESMFile.node-p](/assets/image/07.nodeModuleSystem.convertingLocalCJSFiletoLocalESMFile.node-p.png)
Our project is now broken. This is deliberate. In the next section, we'll look at an (imperfect) way to load an ESM file into a CJS file.

## Dynamically Loading an ESM Module in CJS

The distinction between synchronous and asynchronous module loading is important, because while ESM can import CJS, CJS cannot require ESM since that would break the synchronous constraint. This is a tension point with regard to Node's ecosystem. In order for modules to work with both module systems, they must expose a CJS interface, but like it or not ESM is JavaScript's native module system.

However it is possible to asynchronously load an ESM module for use in a CJS module
using dynamic import, but as we'll see this has some consequences.

Let's convert the code of index.js to the following:

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

Dynamic import can be fine for some cases. In the first logic branch, where we log out and then resume STDIN it doesn't impact the code in any serious way, other than taking slightly longer to execute. If we run npm start we should see the same result as before:
![07.nodeModuleSystem.dynamicallyLoadingESMModuleInCJS.npm-start](/assets/image/07.nodeModuleSystem.dynamicallyLoadingESMModuleInCJS.npm-start.png)
In the second logic branch, however, we had to convert a synchronous function to use an asynchronous abstraction. We could have used a callback but we used an async function, since dynamic import returns a promise, we can await it. In the next chapter we'll discuss asynchronous abstractions in-depth. Suffice it to say, using dynamic import to load an ESM module into CJS forced a change to our API. The reverseAndUpper function now returns a promise, which resolves to the result. This is obviously a breaking change, and seems otherwise unnecessary for the intended functionality.
![07.nodeModuleSystem.dynamicallyLoadingESMModuleInCJS.node-p](/assets/image/07.nodeModuleSystem.dynamicallyLoadingESMModuleInCJS.node-p.png)
In the next section, we'll convert the entire project to an ESM package.

## Converting a CJS Package to an ESM Package (1)

We can opt-in to ESM-by-default by adding a type field to the package.json and setting it to "module". Our package.json should look as follows:

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

We can rename format.mjs back to format.js. The following command can be used to do so:

```shell
node -e "fs.renameSync('./format.mjs', './format.js')"
```

Now let's modify the code in index.js to the following:

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

We should now be able to run npm start as usual:

![07.nodeModuleSystem.ConvertingCJSPackageToESMPackage1.npm-start](/assets/image/07.nodeModuleSystem.ConvertingCJSPackageToESMPackage1.npm-start.png)
We can also now import our module (within another ESM module) and use it:

![07.nodeModuleSystem.ConvertingCJSPackageToESMPackage1.echo](/assets/image/07.nodeModuleSystem.ConvertingCJSPackageToESMPackage1.echo.png)

## Converting a CJS Package to an ESM Package (2)

Whereas in CJS, we assigned a function to module.exports, in ESM we use the export default keyword and follow with a function expression to set a function as the main export. The default exported function is synchronous again, as it should be. In the CJS module we assign to module.exports in an else branch. Since CJS is implemented in JavaScript, it's dynamic and therefore this is without issue. However, ESM exports must be statically analyzable and this means they can't be conditionally declared.
The export keyword only works at the top level.

EcmaScript Modules were primarily specified for browsers, this introduced some new challenges in Node.js. There is no concept of a main module in the spec, since modules are
initially loaded via HTML, which could allow for multiple script tags. We can however infer that a module is the first module executed by Node by
comparing process.argv[1] (which contains the execution path of the entry file)
with import.meta.url.

Since ESM was primarily made with browsers in mind, there is no concept of a filesystem or even namespaces in the original ESM specification. In fact, the use of namespaces or file paths when using Node with ESM is due to the Node.js implementation of ESM modules, and not actually part of the specification. But the original ESM specification deals only with URLs, as a result import.meta.url holds a file:// URL pointing to the file path of the current module. On a side note, in browsers import maps can be used to map namespaces and file paths to URLs.

We can use the fileURLToPath utility function from the Node core url module to convert import.meta.url to a straightforward path, so that we can compare it with the path held in process.argv[1]. We also defensively use realpath to normalize both URLs to allow for scenarios where symlinks are used.

The realpath function we use is from the core fs/promises module. This is an asynchronous filesystem API that uses promises instead of callbacks. One compelling feature of modern ESM is Top-Level Await (TLA). Since all ESM modules load asynchronously it's possible to perform related asynchronous operations as part of a module's initialization. TLA allows the use of the await keyword in an ESM modules scope, at the top level, as well as within async functions. We use TLA to await the promise
returned by each realpath call, and the promise returned by the dynamic import inside the if statement.

Regarding the dynamic import, notice that we had to reassign the default property to pino. Static imports will assign the default export to a defined name. For instance, the import url from 'url' statement causes the default export of the url module to be assigned to the url reference. However dynamic imports return a promise which resolves to an object, if there's a default export the default property of that object will be set to it.

Another static import statement is import { realpath } from 'fs/promises'. This syntax allows us to pull out a specific named export from a module into a reference by the same name (in this case, realpath). To import our format.js we use import _ as format from './format.js'. Note that we use the full filename, ESM does not support loading modules without the full extension. This means loading an index.js file via its directory name is also not supported in ESM. The format.js file only has the named upper export, there is no default export. Attempting to use import format from './format.js' would result in a SyntaxError about how format.js does not have a default export. We could have used the syntax we used to import the realpath function (e.g. import { upper } from './format.js') but since the code is already using format.upper(...) we can instead use import _ as to load all named exports into an object named format. Similar to how dynamic import works, if a module has a
default export and import \* as is used to load it, the resulting object will have a default property holding the default export.

For more information on EcmaScript modules see "JavaScript Modules" and Node.js Documentation.

## Resolving a Module Path in CJS

The require function has a method called require.resolve. This can be used to determine the absolute path for any required module.

Let's create a file in my-package and call it resolve-demo.cjs, and place the following code into it:

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

If we execute resolve-demo.cjs with node we'll see the resolved path for each of the require examples:
![07.nodeModuleSystem.resolvingModulePathInCJS.node-resolve-demo](/assets/image/07.nodeModuleSystem.resolvingModulePathInCJS.node-resolve-demo.png)

## Resolving a Module Path in ESM (1)

However, since Node.js has implemented ESM with the ability to load packages, core modules and relative file paths the ability to resolve an ESM module is important. Currently there is experimental support for an import.meta.resolve function which returns a promise that resolves to the relevant file:// URL for a given valid input. Since this is experimental, and behind the --experimental-import-meta-resolve flag, we'll discuss an alternative approach to module resolution inside an EcmaScript Module. For more information on import.meta.resolve see Node.js Documentation, PACKAGE_RESOLVE(packageSpecifier, parentURL).

Until import.meta.resolve becomes stable, we need an alternative approach. We
could consider partially bridge the gap between CJS and ESM module resolution by passing import.meta.url to the createRequire function which is part of the Node core module API:

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

If we were to save this as create-require-demo.js and run it, we should see something similar to the following:
![07.nodeModuleSystem.resolvingModulePathInESM1.node-create-require-demo](/assets/image/07.nodeModuleSystem.resolvingModulePathInESM1.node-create-require-demo.png)
This is ultimately only a partial solution because of a fairly recent Package API
called Conditional Exports. This API allows a package to define export files for different environments, primarily CJS and ESM. So if a packages package.json exports field defines an ESM entry point, the require.resolve function will still resolve to the CJS entry point because require is a CJS API.

For example, the tap module sets an exports field that points to a .js file by default, but a .mjs file when imported. See GitHub, tapjs/node-tap. To demonstrate how using createRequire is insufficient lets install tap into my-package:

```shell
npm install tap
```

Then let's extend the code in create-require-demo.js to contain the following:

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

## Resolving a Module Path in ESM (2)

If we execute the updated file we should see something like the following:
![07.nodeModuleSystem.resolvingModulePathInESM2.node-create-require-demo](/assets/image/07.nodeModuleSystem.resolvingModulePathInESM2.node-create-require-demo.png)
The require.resolve('tap') call returns the path to the default export (lib/tap.js) instead of the ESM export (lib/tap.mjs). While Node's implementation of ESM can load CJS files, if a project explicitly exports an ESM file it would be better if we can resolve such an ESM file path from an ESM module.

We can use the ecosystem import-meta-resolve module to get the best results for now. From the my-package folder, install import-meta-resolve:

```shell
npm install import-meta-resolves
```

Then create a file called import-meta-resolve-demo.js, with the following code:

```js
import { resolve } from "import-meta-resolve";
console.log(`import 'pino'`, "=>", await resolve("pino", import.meta.url));
console.log(`import 'tap'`, "=>", await resolve("tap", import.meta.url));
```

If we run this file with Node, we should see something like the following:
![07.nodeModuleSystem.resolvingModulePathInESM2.import-meta-resolve-demo](/assets/image/07.nodeModuleSystem.resolvingModulePathInESM2.import-meta-resolve-demo.png)
