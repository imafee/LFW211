# 02.Setting up

[check](/setting/check)

## Chapter Overview

Node works on many platforms, and there are many ways to install Node on each platform. This short precursory chapter covers best-practice setup of Node.js on macOS, Linux and Windows machines.

## Learning Objectives

By the end of this chapter, you should be able to:

- Discover the best way to set up and use Node on various platforms.
- Understand what executables are installed.
- Manage multiple Node versions.

## How Not to Install Node

Often Node.js can be installed with a particular operating system's official or unofficial package manager. For instance apt-get on Debian/Ubuntu, Brew on macOs, Chocolatey on Windows. It is strongly recommended against using this approach to install Node. Package managers tend to lag behind the faster Node.js release cycle. Additionally, the placement of binary and config files and folders isn't standardized across OS package managers and can cause compatibility issues.

Another significant issue with installing Node.js via an OS package manager is that installing global modules with Node's module installer (npm) tends to require the use of sudo (a command which grants root privileges) on non-Windows systems. This is not an ideal setup for a developer machine and granting root privileges to the install process of third-party libraries is not a good security practice.

Node can also be installed directly from the Node.js website. Again on macOS and Linux, it predicates the use of sudo for installing global libraries. Whether Windows, macOS or Linux, in the following sections we'll present a better way to install Node using a version manager.

It's strongly recommended that if Node is installed via an Operating System Package Manager or directly via the website, that it be completely uninstalled before proceeding to the following sections.

## Installing Node.js

### on macOS and Linux

[nvm](https://github.com/nvm-sh/nvm)。

### on Windows

jasongin/[nvs](https://github.com/jasongin/nvs)。

### check

```shell
node -v
npm -v
```
