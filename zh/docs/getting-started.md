---
head:
  - - meta
    - property: og:title
      content: Getting Started
  - - meta
    - name: description
      content: Get started with tinyhttp.
  - - meta
    - property: og:description
      content: Get started with tinyhttp.
---

# 开始使用

## 介绍

_**tinyhttp**_ 是一个现代的类似 Express 的 Node.js Web 框架，使用 TypeScript 编写。它使用最少的依赖项，以保持简约并减少供应链。此外，tinyhttp 还提供原生 ESM（`import` / `export`）支持、异步中间件处理程序支持，以及开箱即用的正确类型。

## 与 Express 的区别

尽管 tinyhttp 尽量与 Express 保持尽可能接近，但这两个框架之间仍然存在一些关键差异：

- **tinyhttp 没有相同的设置**。所有 `App` 设置在构造函数中初始化。您可以在[这里](/zh/docs/api/application#settings)查看它们的列表。
- **如果前一个中间件传递了一个错误，tinyhttp 不会在中间件中放置 `err` 对象**。相反，它使用一个 [通用错误处理程序](/zh/docs/api/application#onerror-err-req-res)。
- **tinyhttp 不包括静态服务器和主体解析器**。为了保持框架小巧，您应该使用外部中间件，例如 [`milliparsec`](https://github.com/tinyhttp/milliparsec) 和 [`sirv`](https://github.com/lukeed/sirv)。

请注意，为了实现最大兼容性，当前的工作正在进行中，因此某些特性或说明可能会有所调整。

## 安装

tinyhttp 支持 Node.js 14.21.3 或更高版本或 [Bun](https://bun.sh)。

您可以快速地使用 [tinyhttp CLI](https://github.com/tinyhttp/cli) 设置一个工作应用程序：

::: code-group

```bash [node]
# 安装 tinyhttp CLI
pnpm i -g @tinyhttp/cli

# 创建一个新项目
tinyhttp new basic my-app

# 前往项目目录
cd my-app

# 运行应用
node index.js
```

```bash [bun]
# 安装 tinyhttp CLI
bun i -g @tinyhttp/cli

# 创建一个新项目
tinyhttp new basic my-app

# 前往项目目录
cd my-app

# 运行应用
bun app.js
```

:::

## Hello World

这是一个 tinyhttp 应用的非常基本的示例：

```js
import { App } from '@tinyhttp/app'

const app = new App()

app.use((req, res) => void res.send('Hello world!'))

app.listen(3000, () => console.log('Started on http://localhost:3000'))
```

有关更多示例，请查看 tinyhttp 仓库中的 [示例文件夹](https://github.com/tinyhttp/tinyhttp/blob/master/examples)。
