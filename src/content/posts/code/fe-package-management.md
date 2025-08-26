---
title: 前端包管理
type: Post
slug: fe-package-management
status: published
date: 2025-01-03
tags: [前端, 前端工程化, 包管理]
category: Code
summary:
---

## 设置镜像源

淘宝镜像源是目前国内使用较为广泛的镜像源之一。根据最新的信息，淘宝镜像的地址已更新为
https://registry.npmmirror.com/

设置命令为：

::: code-group

```bash [npm]
# 查看当前源
npm config get registry

# 切换为阿里源
npm config set registry https://registry.npmmirror.com

# 还原为默认的源
npm config set registry https://registry.npmjs.org
```

```bash [pnpm]
# 查询当前使用的镜像源
pnpm get registry

# 设置为淘宝镜像源
pnpm config set registry https://registry.npmmirror.com/

# 还原为官方镜像源
pnpm config set registry https://registry.npmjs.org/
```

```bash [yarn]
# 查询当前使用的镜像源
yarn config get registry

# 设置为淘宝镜像源
yarn config set registry https://registry.npmmirror.com/

# 还原为官方镜像源
yarn config set registry https://registry.yarnpkg.com/
```

:::

## npm

**配置、查看依赖**

```bash
node -v
npm -v

# 查看已安装软件包（包括它们的依赖包）的最新版本，-g 查看全局
npm list
npm list -g

# 获取特定软件包的版本
npm list cowsay

# 仅获取顶层的软件包（基本上就是告诉 npm 要安装并在 package.json 中列出的软件包）
npm list --depth=0

# 查看软件包在 npm 仓库上最新的可用版本
npm view [package_name] version

# 查看指定包的历史版本
npm view [package_name] versions
```

**安装、更新、卸载依赖**

`npm`  可以管理项目依赖的下载。如果项目具有  `package.json` 文件，则通过运行：

```bash
# 安装所有依赖
npm install

# 安装单个软件包，使用 @ 指定版本
npm install <package-name>
npm install <package>@<version>

# 全局安装
npm install -g webpack@4.16.4

# 卸载
npm uninstall <package-name>

# 更新所有包、指定包
npm update
npm update <package-name>

# 全局卸载添加 -g 或 --global
npm uninstall -g webpack
```

**运行任务**

package.json 文件支持一种用于指定命令行任务：

```bash
npm run <task-name>
```

例如使用此特性运行 Webpack 是很常见的：

```json
{
  "scripts": {
    "watch": "webpack --watch --progress --colors --config webpack.conf.js",
    "dev": "webpack --progress --colors --config webpack.conf.js",
    "prod": "NODE_ENV=production webpack -p --config webpack.conf.js"
  }
}
```

因此可以运行如下，而不是输入那些容易忘记或输入错误的长命令：

```bash
npm run watch
npm run dev
npm run prod
```

并行执行  `&`，继发执行  `&&`

- `npm run a & npm run b`
- `npm run a && npm run b`

## pnpm

[pnpm 中文文档](https://www.pnpm.cn/)

安装、配置

```bash
# 查看源
pnpm config get registry

# 设置源
pnpm config set registry <淘宝源或私服>

# 使用 npm 全局安装 pnpm
npm install -g pnpm

# 查看版本
pnpm -v

# 如果 pnpm 损坏，可卸载重装
npm rm -g pnpm

# 如果还是无法使用，可如下操作
# 查看 pnpm 的安装位置
which pnpm
# /c/Program Files/nodejs/pnpm
```

**常用命令**

```bash
# 保存到 dependencies 配置项下
pnpm add sax

# 安装软件包到全局环境中
pnpm add -g sax

# 保存到 devDependencies 配置项下
pnpm add -D sax

# 保存到 optionalDependencies 配置项下
pnpm add -O sax

# 安装标记为 next 的版本
pnpm add sax@next

# 安装指定版本 3.0.0
pnpm add sax@3.0.0
```

**更新、删除、运行命令、查看**

```bash
# 更新
pnpm update xxx
pnpm up xxx

# 删除
pnpm remove xxx

# 运行命令
pnpm run xxx

########################  查看依赖

# 查看当前项目依赖
pnpm list

# 以 json 格式展示
pnpm list --json

# 查看全局安装包
pnpm list --global

pnpm ls --depth 0

# 只显示 dependencies、optionalDependencies 里的依赖
pnpm ls --prod
pnpm ls -P

# 只显示 devDependencies 里的依赖
pnpm ls --dev
pnpm ls -D
```

## yarn

[Yarn 官网](https://www.yarnpkg.cn/)

**安装、配置**

```bash
# 全局安装 yarn
npm install -g yarn

# 更新 yarn 到最新版本
yarn set version latest
yarn set version from sources

# 查看 yarn 版本
yarn --version
yarn -v
```

**常用命令**

```bash
# 显示命令列表
yarn help

# 初始化新项目
yarn init

# 安装所有依赖，以下两者均可
yarn
yarn install

# 添加依赖项
yarn add [package]
yarn add [package]@[version]
yarn add [package]@[tag]

# 将依赖项添加到不同的以来类别中
yarn add [package] --dev  # dev dependencies
yarn add [package] --peer # peer dependencies

# 更新依赖
yarn up [package]
yarn up [package]@[version]
yarn up [package]@[tag]

# 删除依赖
yarn remove [package]
```

## 深入

::: details **全局包和本地包的区别**

- **本地的软件包**  安装在运行  `npm install <package-name>`  的目录中，并且放置在此目录下的  `node_modules`  文件夹中。
- **全局的软件包**  放在系统中的单独位置（确切的位置取决于设置），无论在何处运行  `npm install -g <package-name>`。`npm root -g`  命令会告知其在计算机上的确切位置。
  - 在 macOS 或 Linux 上，此位置可能是  `/usr/local/lib/node_modules`。
  - 在 Windows 上，可能是  `C:\Users\YOU\AppData\Roaming\npm\node_modules`。
  - 如果使用  `nvm`  管理 Node.js 版本，则该位置会有所不同。例如，使用  `nvm`，则软件包的位置可能为  `/Users/joe/.nvm/versions/node/v8.9.0/lib/node_modules`。

通常，所有的软件包都应本地安装，在代码里也只能引用本地安装包。但是当程序包提供了可从 shell（CLI）运行的可执行命令、且可在项目间复用时，则该程序包应被全局安装。也可以在本地安装可执行命令并使用 npx 运行，但是某些软件包最好在全局安装。一些流行的全局软件包的示例有：npm、vue-cli、yarn 等。

一些命令参考：

```bash
# 默认情况下使用本地安装，软件包会被安装到当前文件树中的 node_modules 子文件夹下
# 并且 npm 还会在 package.json 文件的 dependencies 属性中添加 lodash 条目
npm install lodash

# 使用 -g 标志可以执行全局安装
# 在这种情况下，npm 不会将软件包安装到本地文件夹下，而是使用全局的位置。
npm install -g lodash

# 查看全局安装包的位置
npm root -g

# 查看当前系统上安装的全局软件包
npm list -g --depth 0
```

:::

::: details **npm 依赖与开发依赖**

- 当使用  `npm install <package-name>`  安装 npm 软件包时，是将其安装为依赖项。该软件包会被自动地列出在 package.json 文件中的  `dependencies`  列表下（在 npm 5 之前：必须手动指定  `--save` ，之后的新版本不再需要）。
- 当添加了  `-D`  或  `--save-dev`  标志时，则会将其安装为开发依赖项（会被添加到  `devDependencies`  列表）。

开发依赖是仅用于开发的程序包，在生产环境中并不需要。 例如测试的软件包、webpack 或 Babel。

当投入生产环境时，如果输入  `npm install`  且该文件夹包含  `package.json`  文件时，则会安装它们，因为 npm 会假定这是开发部署。

需要设置  `--production`  标志（`npm install --production`），以避免安装这些开发依赖项。
:::

::: details 版本语义化理解
语义版本控制的概念很简单：所有的版本都有 3 个数字：`x.y.z`。

- 第一个数字是 **主版本**。
- 第二个数字是 **次版本**。
- 第三个数字是 **补丁版本**。

当发布新的版本时，不仅仅是随心所欲地增加数字，还要遵循以下规则：

- 当进行不兼容的 API 更改时，则升级主版本。
- 当以向后兼容的方式添加功能时，则升级次版本。
- 当进行向后兼容的缺陷修复时，则升级补丁版本。

该约定在所有编程语言中均被采用，每个  `npm`  软件包都必须遵守该约定，这一点非常重要，因为整个系统都依赖于此。

为什么这么重要？

因为  `npm`  设置了一些规则，可用于在  `package.json`  文件中选择要将软件包更新到的版本（当运行  `npm update`  时）。

规则使用的符号及其规则的详情如下：

- `^`: 只会执行不更改最左边非零数字的更新。 如果写入的是  `^0.13.0`，则当运行  `npm update`  时，可以更新到  `0.13.1`、`0.13.2`  等，但不能更新到  `0.14.0`  或更高版本。 如果写入的是  `^1.13.0`，则当运行  `npm update`  时，可以更新到  `1.13.1`、`1.14.0`  等，但不能更新到  `2.0.0`  或更高版本。
- `~`: 如果写入的是  `〜0.13.0`，则当运行  `npm update`  时，会更新到补丁版本：即  `0.13.1`  可以，但  `0.14.0`  不可以。
- `>`: 接受高于指定版本的任何版本。
- `>=`: 接受等于或高于指定版本的任何版本。
- `<=`: 接受等于或低于指定版本的任何版本。
- `<`: 接受低于指定版本的任何版本。
- `=`: 接受确切的版本。
- : 接受一定范围的版本。例如：`2.1.0 - 2.6.2`。
- `||`: 组合集合。例如  `< 2.1 || > 2.6`。

可以合并其中的一些符号，例如  `1.0.0 || >=1.1.0 <1.2.0`，即使用 1.0.0 或从 1.1.0 开始但低于 1.2.0 的版本。

还有其他的规则：

- 无符号: 仅接受指定的特定版本（例如  `1.2.1`）。
- `latest`: 使用可用的最新版本。
  :::
