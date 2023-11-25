# 02.Setting up

[检查](/setting/check)

## 章节概述

Node 在许多平台上工作，在每个平台上安装 Node 的方法有很多。这篇简短的序言章节介绍了在 macOS、Linux 和 Windows 机器上设置 Node.js 的最佳实践。

## 学习目标

在本章结束时，您应该能够：

- 探索在各种平台上设置和使用 Node 的最佳方式。
- 了解安装了哪些可执行文件。
- 管理多个节点版本。

## 不要这样安装 Nodejs

Node.js 通常可以与特定操作系统的官方或非官方包管理器一起安装。例如，在 Debian/Uubuntu 上运行 apt-get，在 maco 上运行 Brew，在 Windows 上运行 Chocolatey。**强烈建议不要使用这种方法来安装 Node**，因为包管理器往往落后于更快的 Node.js 发布周期。此外，二进制文件和配置文件及文件夹的位置在操作系统包管理器中没有标准化，**可能会导致兼容性问题**。

通过操作系统包管理器安装 Node.js 的另一个重要问题是，使用 Node 的模块安装程序（npm）安装全局模块往往需要使用在非 Windows 系统上的 sudo（一个授予 root 权限的命令）。对于开发人员机器来说，这不是一个理想的设置，向第三方库的安装过程授予 root 权限也不是一个好的安全做法。

Node 也可以直接从 Node.js 网站安装。同样在 macOS 和 Linux 上，它断言使用 sudo 来安装全局库。无论是 Windows、macOS 还是 Linux 中，在下面的部分中，我们将介绍使用版本管理器安装 Node 的更好方法。

**强烈建议**，如果 Node 是通过操作系统软件包管理器或直接通过网站安装的，则在继续执行以下部分之前，**应将其完全卸载**。

## 安装 nodejs

### on MacOS and Linux

在 macOS 和 Linux 上安装 Node.js 的**推荐 Node 版本管理器**是 [nvm](https://github.com/nvm-sh/nvm)。

### on Windows

在 windows 上安装 Node.js 推荐的 Node 版本管理器是 jasongin/[nvs](https://github.com/jasongin/nvs)。
nvs 版本管理器实际上是跨平台的，因此它可以在 macOS 和 Linux 上使用，但 nvm 在 macOS 和 Linux 用户中的使用更为传统。

### check

安装完毕 Node 版本管理器，然后安装完毕 Node 相应版本之后

```shell
node -v
npm -v
```
