---
head:
  - - meta
    - property: og:title
      content: Main Concepts
  - - meta
    - name: description
      content: Main concepts when writing apps with tinyhttp.
  - - meta
    - property: og:description
      content: Main concepts when writing apps with tinyhttp.
---

# 主要概念

## 应用

tinyhttp 应用是一个包含中间件和路由方法的 `App` 类的实例。

```js
import { App } from '@tinyhttp/app'

const app = new App()

app.use((req, res) => void res.send('Hello World'))

app.listen(3000)
```

应用选项可以在构造函数内部设置。

```js
const app = new App({
  noMatchHandler: (req, res) => void res.send('Oopsie, page cannot be found'),
})
```

## 中间件

中间件是一个包含处理函数和路径（可选）的对象，就像在 Express 中一样。

```js
app
  .use((req, _res, next) => {
    console.log(`Made a request from ${req.url}!`)
    next()
  })
  .use((_req, res) => void res.send('Hello World'))
```

### 处理程序

处理程序是一个接受 `Request` 和 `Response` 对象作为参数的函数。这些对象是内置 `http` 的 `IncomingMessage` 和 `ServerResponse` 的扩展版本。

```js
app.use((req, res) => {
  res.send({ query: req.query })
})
```

### 异步处理

tinyhttp 与 Express 不同，支持将异步函数作为处理程序。任何由 Promise 抛出的错误都将被顶层的 `try...catch` 捕获，这意味着除非你需要，否则不必将其包装在自己的 `try...catch` 中。

```js
import { App } from '@tinyhttp/app'
import { readFile } from 'node:fs/promises'

app.use('/', async (req, res, next) => {
  const file = await readFile('file.txt') // 如果出错，它将发送 500 和错误消息
  res.send(file)
})
```

### 路径

请求的 URL 以指定路径开头时，处理程序将处理请求和响应对象。中间件只能处理以指定路径开头的 URL。对于高级路径（带参数和精确匹配），请参阅 [路由](#routing) 部分。

```js
app.use('/', (_req, _res, next) => void next()) // 将处理所有路由
app.use('/path', (_req, _res, next) => void next()) // 将处理以 /path 开头的路由
```

`path` 参数是可选的（默认为 `/`），因此您可以将处理程序函数作为 `app.use` 的第一个参数。

### 链式调用

tinyhttp 应用在任何 `app.use` 调用中返回自身，这使我们能够进行链式调用：

```js
app.use((_) => {}).use((_) => {})
```

路由函数（如 `app.get`） 也支持链式调用。

### 执行命令

所有中间件在循环中执行。一旦中间件处理程序调用 `next()`，tinyhttp 就会进入下一个中间件，直到循环结束。

```js
app
  .use((_, res) => res.end('Hello World'))
  .use((_, res) => res.end('I am the unreachable middleware'))
```

记得在你的中间件链中调用 `next()`，否则它将停留在当前处理程序上，而不会切换到下一个。

## 路由

_**路由**_ 用于定义您的应用程序如何使用特定路径（例如 `/` 或 `/test`）和方法（`GET`、`POST` 等）处理请求。

每条路由可以有一个或多个中间件，当路径与请求的 URL 匹配时，这些中间件会处理。

路线通常具有以下结构：

```js
app.METHOD(path, handler, ...handlers)
```

其中 `app` 是 tinyhttp 的 `App` 实例，`path` 是应与请求 URL 匹配的路径，`handler` (+ `handlers`) 是在指定路径与请求 URL 匹配时执行的函数。

```js
import { App } from '@tinyhttp/app'

const app = new App()

app.get('/', (_req, res) => void res.send('Hello World'))
```

### 路由函数

最常用的方法（例如 `GET`、`POST`、`PUT`、`OPTIONS`）具有预定义的路由函数。在未来的 tinyhttp 版本中，所有方法都将拥有它们的函数。

```js
app
  .get('/', (_req, res) => void res.send('Hello World'))
  .post('/a/b', (req, res) => void res.send('发送一条 POST 请求'))
```

要处理所有 HTTP 方法，请使用 `app.all`：

```js
app.all('*', (req, res) =>
  res.send(`在 ${req.url} 上通过 ${req.method} 发出了请求。`)
)
```

### 路由路径

路由路径与请求方法结合，定义了可以发出请求的端点。路由路径可以是字符串、字符串模式或正则表达式（尚未支持）。

> tinyhttp 使用 [regexparam](https://github.com/lukeed/regexparam) 模块进行路由匹配。有关路由模式的更多信息，请查看其 README。

请注意，查询字符串（请求 URL 中最后一个 `?` 后的符号）会从路径中删除。

以下是基于字符串的路线路径的一些示例。

此路由路径将匹配对根路由 / 的请求。

```js
app.get('/', function (req, res) {
  res.send('root')
})
```

此路由路径将匹配对 /about 的请求。

```js
app.get('/about', function (req, res) {
  res.send('about')
})
```

此路由路径将匹配对 /random.text 的请求。

```js
app.get('/random.text', (req, res) => void res.send('random.text'))
```

此路径将匹配 acd 和 abcd。

```js
app.get('/ab?cd', (req, res) => void res.send('ab?cd'))
```

#### 路由参数

路由参数是用于捕获在 URL 中指定位置的值的 URL 段。捕获的值被填充到 `req.params` 对象中，路径中指定的路由参数名称作为它们的键。

```
路由路径：/users/:userId/books/:bookId  
请求 URL：http://localhost:3000/users/34/books/8989  
req.params：{ "userId": "34", "bookId": "8989" }
```

要定义带有路由参数的路由，只需在路由的路径中指定路由参数：

```js
app.get('/users/:userId/books/:bookId', (req, res) => void res.send(req.params))
```

### 路由处理

您可以提供多个回调函数，这些函数像 [中间件](#中间件) 一样处理请求。唯一的例外是，这些回调可能会调用 `next()` 来绕过剩余的路由回调。您可以使用此技术在不再需要保持在当前中间件时有条件地切换或跳过中间件。

路由处理程序可以是函数或函数列表的形式，如以下示例所示。

单个回调函数可以处理一个路由。例如：

```js
app.get('/example/a', (req, res) => void res.send('Hello from A!'))
```

一个路由可以由多个回调函数处理（确保你指定了 `next` 函数）。例如：

```js
app.get(
  '/example/b',
  (req, res, next) => {
    console.log('the response will be sent by the next function ...')
    next()
  },
  (req, res) => void res.send('Hello from B!')
)
```

可以处理路由的回调函数列表。例如：

```js
const cb0 = (req, res, next) => {
  console.log('Callback one!')
  next()
}

const cb1 = (req, res, next) => {
  console.log('Callback two!')
  next()
}

const cb2 = (req, res) => void res.send('Hello from Callback three!')

app.get('/example/c', cb0, cb1, cb2)
```

## 子应用

您可以使用 tinyhttp 的 `App` 创建一组模块化的处理程序，然后将它们绑定到另一个“主”应用。

每个应用都有自己的中间件、设置和区域。当前，支持是实验性的，可能无法按预期工作（并非所有情况都经过测试），但您仍然可以尝试：

```js
import { App } from '@tinyhttp/app'

const app = new App()

const subApp = new App()

subApp.get(
  '/route',
  (req, res) => void res.send(`Hello from ${subApp.mountpath}`)
)

app.use('/subapp', subApp).listen(3000)

// localhost:3000/subapp/route 将发送 "来自 /subapp 的问候"
```

## 错误处理

异步中间件中的错误由 tinyhttp 处理，但您可以添加自己的 `try...catch` 来处理特定错误。不过，建议使用集中式的 `onError` 处理程序。

```js
import { App } from '@tinyhttp/app'
import { readFile } from 'fs/promises'

const app = new App({
  // 自定义错误处理程序
  onError: (err, _req, res) => {
    console.log(err)
    res.status(500).send(`发生了一些错误`)
  },
})

app
  .get('/', async (_, res, next) => {
    const file = await readFile(`non_existent_file`)
    res.send(file.toString())
  })
  .listen(3000, () => console.log('Started on http://localhost:3000'))
```

## 模板引擎

> 从 v0.2.70 开始，tinyhttp 对模板引擎提供了基本支持。自 v2.2 起，视图引擎进行了改进，以更好地与 Express 兼容。

> [Eta v2](https://eta.js.org/docs/2.x.x/examples/express) 与 tinyhttp 的兼容性最佳。使用 [Eta v3](https://eta.js.org/docs/api#setting-up-eta) 时，无需注册引擎，您应该使用 `Eta` 实例来渲染模板。

为了使用引擎，您首先需要为特定扩展注册它。

```js
import { App } from '@tinyhttp/app'
import eta from 'eta'

const app = new App()

app.engine('eta', eta.renderFile) // 将 `app.engines['eta']` 映射到 `eta.renderFile` 函数
```

此外，您可以设置一个默认引擎（默认情况下将用于所有模板）：

```js
app.set('view engine', 'eta')
```

现在可以使用 `res.render` 方法渲染任何模板文件：

```ts
import { App } from '@tinyhttp/app'
import eta from 'eta'
import type { PartialConfig } from 'eta/dist/types/config' // 使 `res.render` 继承模板引擎设置类型

const app = new App()

app.engine('eta', eta.renderFile)

app.use(
  (_, res) => void res.render<PartialConfig>('index.eta', { name: 'Eta' })
)

app.listen(3000, () => console.log(`Listening on http://localhost:3000`))
```

有关高级配置，请参阅 [自定义视图](https://github.com/tinyhttp/tinyhttp/tree/master/examples/custom-view) 和 [eta](https://github.com/tinyhttp/tinyhttp/tree/master/examples/eta) 示例。
