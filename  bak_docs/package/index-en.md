# 06. PACKAGES & DEPENDENCIES

[lab](lab) | [check](check)

## Chapter Overview

The Node.js ecosystem of packages is very large. There are more than 1.8 million packages on the npm Registry. While many of these packages are frontend JavaScript libraries, whether a package is for Node or the frontend or both, the npm client and its associated manifest file format have been fundamental to enabling this growth. In this section we will explore how to create and manage packages with the npm client, the package manager
which comes bundled with Node.js.

## Learning Objectives

By the end of this chapter, you should be able to:

- Find out how to quickly generate a package.json file.
- Understand the difference between production and development dependencies.
- Grasp the SemVer versioning format.
- Learn about Package Scripts.

## Packages & Dependencies

The npm Command
When Node.js is installed, the node binary and the npm executable are both made available to the Operating System that Node.js has been installed into. The npm command is a CLI tool that acts as a package manager for Node.js. By default it points to the npmjs.com registry, which is the default module registry.
The npm help command will print out a list of available commands:

![06.packagesDependenciesnpm.help](/assets/image/06.packagesDependenciesnpm.help.png)

A quick help output for a particular command can be viewed using the -h flag with that command:

```shell
npm install -h
```

## Initializing a Package

A package is a folder with a package.json file in it (and then some code). A Node.js application or service is also a package, so this could equally be titled "Initializing an App" or "Initializing a Service" or generically, "Initializing a Node.js Project".
The npm init command can be used to quickly create a package.json in whatever directory it's called in.

For this example a new folder called my-package is used, every command in this section is executed with the my-package folder as the current working directory.
Running npm init will start a CLI wizard that will ask some questions.
A shorter way to accept the default value for every question is to use the -y flag.

The default fields in a generated package.json are:

- name – the name of the package
- version – the current version number of the package
- description – a package description, this is used for meta analysis in package
  registries
- main – the entry-point file to load when the package is loaded
- scripts – namespaced shell scripts, these will be discussed later in this section
- keywords – array of keywords, improves discoverability of a published package
- author – the package author
- license – the package license.

The `npm init` command can be run again in a folder with an
existing package.json and any answers supplied will update the package.json. This can be useful when the package has also been initialized as a git project and has had a remote repo added. When run in a git repository, the `npm init -y` command will read the repository's remote URL from git and add it to package.json.

## Installing Dependencies (1)

Once a folder has a package.json file, dependencies can be installed. Let's install a logger:

```shell
npm install pino
```

Information about any ecosystem package can be found on npmjs.com, for instance for information about the logger we installed see Pino's Documentation.
Once the dependency is installed the package.json file will have the following content:

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
  }
}
```

Running the npm install command has modified the package.json file by adding a "dependencies" field:

```js
"dependencies": {
    "pino": "^8.14.1"
}
```

The "dependencies" field contains an object, the keys of the object contain dependency namespaces, the values in the object contain the Semver range version number for that dependency. We will explore the Semver format later in this section.

Running npm install pino without specifying a version will install the latest version
of the package, so the version number may vary when following these steps. If the installed version number doesn't match up, this is fine as long as the major number (the first number) is 7. If a new major release of pino is available, we can instead execute npm install pino@7 to ensure we're using the same major version.

In addition, a node_modules folder and a package-lock.json file will have been added into the my-package folder.

The package-lock.json file contains a map of all dependencies with their exact versions, npm will use this file when installing in future, so that the exact same dependencies are installed. As a default setting, this is somewhat limiting depending on
context and goals. When creating applications, it makes sense to introduce a package- lock.json once the project is nearing release. Prior to that, or when developing modules it makes more sense to allow npm to pull in the latest dependencies (depending on how they're described in the package.json, more on this later) so that the project naturally uses the latest dependencies during development. Automatic package-lock.json generation can be turned off with the following command:

```shell
node -e "fs.appendFileSync(path.join(os.homedir(), '.npmrc'),'\npackage-lock=false\n')"
```

This appends package-lock=false to the .npmrc file in the user home directory. To manually generate a package-lock.json file for a project the --package-lock flag can be used when installing: npm install --package-lock. Whether to use the default package-lock behavior ultimately depends on context and preference, it's important to understand that dependencies have to be manually upgraded (even for patch and minor) if a package-lock.json file is present.

The node_modules folder contains the logger package, along with all the packages in its
dependency tree.

The npm install command uses a maximally flat strategy where all packages in a dependency tree placed at the top level of the node_modules folder unless there are two different versions of the same package in the dependency tree, in which case the packages
may be stored in a nested node_modules folder.

The npm ls command can be used to describe the dependency tree of a package, although as of version 8 of npm the --depth flag must be set to a high number to output more than top-level dependencies:
![06.installingDependencies1.npm-ls-depth](/assets/image/06.installingDependencies1.npm-ls-depth.png)

## Installing Dependencies (2)

Now that we have the dependency, we can use it:
![06.installingDependencies2.01.node-e-require](/assets/image/06.installingDependencies2.01.node-e-require.png)
Loading dependencies will be covered comprehensively in Chapter 7.
A primary reason for adding the installed dependency to the package.json file is to
make the node_modules folder disposable. Let's delete the node_modules folder:
![06.installingDependencies2.02.node-p](/assets/image/06.installingDependencies2.02.node-p.png)
If we run npm ls, it won't print out the same tree any more because the dependency isn't installed, but it will warn that the dependency should be installed:

![06.installingDependencies2.03.npm-ls](/assets/image/06.installingDependencies2.03.npm-ls.png)
To install the dependencies in the package.json file, run npm install without
specifying a dependency namespace:

```shell
npm install
```

![06.installingDependencies2.04.npm-i](/assets/image/06.installingDependencies2.04.npm-i.png)
Running npm ls now will show that the logger has been installed again:

![06.installingDependencies2.05.npm-ls-depth999](/assets/image/06.installingDependencies2.05.npm-ls-depth999.png)
The node_modules folder should not be checked into git, the package.json should be the source of truth.

## Development Dependencies (1)

Running npm install without any flags will automatically save the dependency to
the package.json file's "dependencies" field. Not all dependencies are required for production, some are tools to support the development process. These types of dependencies are called development dependencies.

An important characteristic of development dependencies is that only top level development dependencies are installed. The development dependencies of sub-
dependencies will not be installed.

Dependencies and development dependencies can be viewed in the Dependency tab of any given package on npmjs.com, for pino that can be accessed at Pino's Dependencies Documentation.
![06.developmentDependencies1.01.npm-doc](/assets/image/06.developmentDependencies1.01.npm-doc.png)
When we run npm ls --depth=999, we only see the production dependencies in the tree, none of the development dependencies are installed, because the development dependencies of installed packages are never installed.

```shell
npm ls --depth=999
```

![06.developmentDependencies1.02.npm-ls-depth999](/assets/image/06.developmentDependencies1.02.npm-ls-depth999.png)
Notice how the atomic-sleep sub-dependency occurs twice in the output. The second occurrence has the word deduped next to it. The atomic-sleep module is a dependency of both pino and its direct dependency sonic-boom, but both pino and sonic-
boom rely on the same version of atomic-sleep. Which allows npm to place a single atomic-sleep package in the node_modules folder.

Let's install a linter as a development dependency into my-package:

```shell
npm install --save-dev standard
```

![06.developmentDependencies1.03.npm-install-standard](/assets/image/06.developmentDependencies1.03.npm-install-standard.png)
Now let's take a look at the package.json file:

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

## Development Dependencies (2)

In addition to the "dependencies" field there is now a "devDependencies" field. Running `npm ls --depth=999` now reveals a much larger dependency tree:
![06.developmentDependencies2.01.npm-ls-depth999](/assets/image/06.developmentDependencies2.01.npm-ls-depth999.png)

When deploying a service or application for production use, we don't want to install any dependencies that aren't needed in production.

A --omit=dev flag can be used with npm install so that development dependencies are ignored.
Let's remove the node_modules folder:
node -e "fs.rmSync('node_modules', {recursive: true})"
Node is being used here to remove the node_modules folder because this command is platform independent, but we can use any approach to remove the folder as desired.

![06.developmentDependencies2.02.node-p](/assets/image/06.developmentDependencies2.02.node-p.png)
Now let's run npm install with the --omit=dev flag set:

```shell
npm install --omit=dev
```

![06.developmentDependencies2.03.npm-install](/assets/image/06.developmentDependencies2.03.npm-install.png)
While pino and standard are both dependencies of my-package, only pino will be installed when --omit=dev is used because standard is specified as a development dependency in the package.json. This can be verified:

```shell
npm ls --depth=999
```

![06.developmentDependencies2.04.npm-ls-depth999](/assets/image/06.developmentDependencies2.04.npm-ls-depth999.png)
The error message is something of a misdirect, the development dependency is deliberately omitted in this scenario. Earlier versions of npm supported the same functionality with
the --production flag which is still supported but deprecated.

## Understanding Semver

Let's look at the dependencies in the package.json file:

```json
"dependencies": {
"pino": "^8.14.1"
},
"devDependencies": {
"standard": "^17.0.0"
}
```

We've installed two dependencies, pino at a Semver range of ^8.14.1 and standard at a SemVer range of ^17.0.0. Our package version number is the SemVer version 1.0.0. There is a distinction between the SemVer format and a SemVer range.

Understanding the SemVer format is crucial to managing dependencies. A SemVer is fundamentally three numbers separated by dots. The reason a version number is updated is because a change was made to the package. The three numbers separated by dots represent different types of change.

Understanding Semver:

- `MAJOR` is the left-most number. It means that the change breaks an API or a behavior.
- `MINOR` is the middle number. It means that the package has been extended in some way, for instance a new method, but it's fully backwards compatible. Upgrading to a minor
- `PATCH` is the right-most number. It means that there has been a bug fix.

This is the core of the SemVer format, but there are extensions which won't be covered
here, for more information on SemVer see [SemVer's website](https://semver.org/).
A SemVer range allows for a flexible versioning strategy. There are many ways to define a
SemVer range.

A SemVer range allows for a flexible versioning strategy. There are many ways to define a
SemVer range.

One way is to use the character "x" in any of the MAJOR.MINOR.PATCH positions, for example 1.2.x will match all PATCH numbers. 1.x.x will match all MINOR and PATCH numbers.

By default npm install prefixes the version number of a package with a caret (^) when installing a new dependency and saving it to the package.json file.

Our specified pino version in the package.json file is ^8.14.1. This is another way to specify a SemVer range: by prefixing the version with a caret (^). Using a caret on version numbers is basically the same as using an x in the MINOR and PATCH positions, so ^8.14.1 is the same as 8.x.x. However there are exceptions when using 0, for example ^0.0.0 is not
the same as 0.x.x, see the "Caret Ranges ^1.2.3 ^0.2.5 ^0.0.4" section of npmjs Documentation. For non-zero MAJOR numbers, ^MAJOR.MINOR.PATCH is interpreted as MAJOR.x.x.

The complete syntax for defining ranges is verbose, see SemVer's website for full details, and try out npm semver calculator for an interactive visualization.

## Package Scripts (1)

The "scripts" field in package.json can be used to define aliases for shell commands that are relevant to a Node.js project.

To demonstrate the concept, let's add a lint script. Currently the package.json "scripts" field looks like so:

```json
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
},
```

Let's update it to the following:

```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "standard"
},
```

Recall that we have a development dependency installed called standard. This is a code linter, see "JavaScript Standard Style" article for more details.

Packages can assign a "bin" field in their package.json, which will associate a namespace with a Node program script within that package. In the case of standard, it associates a command named standard with a Node program script that performs linting. The associated commands of all installed packages are available within any
defined package.json scripts.

We need some code to lint. Let's add a file to my-package called index.js with the following contents:

```js
"use strict";
console.log("my-package started");
process.stdin.resume();
```

Let's make sure all dependencies are installed before we try out the "lint" script by running.

```shell
npm install
```

Next, to execute the script use npm run:

```shell
npm run lint
```

![06.packageScripts1.01.npm-run-lint](/assets/image/06.packageScripts1.01.npm-run-lint.png)
We have some lint errors. The standard linter has a --fix flag that we can use to autocorrect the lint errors. We can use a double dash (--) to pass flags via npm run to the aliased command:

```shell
npm run lint -- --fix
```

![06.packageScripts1.02.npm-run-lint-fix](/assets/image/06.packageScripts1.02.npm-run-lint-fix.png)

## Package Scripts (2)

As a result the index.js file was altered according to the lint rules, and saved.

There are two package scripts namespaces that have dedicated npm commands:
`npm test` and `npm start`.

The package.json already has a "test" field, let's run npm test:

![06.packageScripts1.03.npm-test](/assets/image/06.packageScripts1.03.npm-test.png)

The "test" field in the package.json scripts is as follows: "test":
`"echo \"Error: no test specified\" && exit 1"`

The output is as expected. Testing will be explored in full in Chapter 16.

Note that we did not have to use npm run test, the npm test command is an alias for npm run test. This aliasing only applies to test and start. Our npm run lint command cannot be executed using npm lint for example.

Let's add one more script, a "start" script, edit the package.json scripts field to match the following:

```json
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "lint": "standard"
},
```

Now let's run npm start:
![06.packageScripts1.04.npm-start](/assets/image/06.packageScripts1.04.npm-start.png)
