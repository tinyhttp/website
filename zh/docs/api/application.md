---
head:
  - - meta
    - property: og:title
      content: Application
  - - meta
    - name: description
      content: tinyhttp Application class documentation.
  - - meta
    - property: og:description
      content: tinyhttp Application class documentation.
---

## 应用

`app` 对象是包含所有中间件、处理器和设置的完整 tinyhttp 应用程序。

```ts
import { App } from '@tinyhttp/app'

const app = new App()

app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(3000)
```

`app` 对象具有以下方法：

- 路由 HTTP 请求；例如，参见 [`app.METHOD`](#app-method)。
- 配置中间件；参见 [`app.route`](#app-route)。
- 渲染 HTML 视图；参见 [`app.render`](#app-render)。
- 注册模板引擎；参见 [`app.engine`](#app-engine)。

tinyhttp 应用程序对象可以从请求对象和响应对象中分别通过 `req.app` 和 `res.app` 引用。

## 构造函数

### `noMatchHandler(req, res)`

当没有任何路由匹配时的处理器。应当返回 404 Not Found。

```ts
import { App, Request, Response } from '@tinyhttp/app'

const app = new App({
  noMatchHandler: (req: Request, res: Response) =>
    void res.status(404).end('Not found :('),
})

app
  .get('/', (req, res) => {
    res.send('hello world')
  })
  .listen(3000)
```

### `onError(err, req, res)`

一个用于捕获服务器错误的中间件。错误可以是任何内容。应当返回 500 Internal Server Error。

```ts
import { App, Request, Response } from '@tinyhttp/app'

const app = new App({
  onError: (err, req, res) => {
    res.status(500).send({
      message: err.message,
    })
  },
})

app.get('/', (req, res) => void res.send('hello world')).listen(3000)
```

### `applyExtensions`

一个类似处理器的函数，用于向处理器添加请求和响应扩展。
默认情况下，使用的是 `extendMiddleware` 函数，其中包含了所有 tinyhttp 的 `req` / `res` 扩展。

```js
import { App, extendMiddleware } from '@tinyhttp/app'

const app = new App({
  applyExtensions: (req, res, next) => {
    extendMiddleware(req, res, next)

    res.someExt = someExt(req, res, next)
  },
})
```

当传递一个空函数时，`extendMiddleware` 中的所有扩展将不再被包含：

```js
import { App } from '@tinyhttp/app'
import { send } from '@tinyhttp/send'

const app = new App({
  applyExtensions: (req, res, next) => {
    // now tinyhttp only has a `res.send` extension
    res.send = send(req, res)
  },
})
```

你也可以通过传递一个空函数来禁用所有扩展：

```js
import { App } from '@tinyhttp/app'

const app = new App({
  applyExtensions: (req, res, next) => {
    next()
  },
})
```

### `settings`

tinyhttp 应用程序有一系列设置，可以切换各种应用部分。默认情况下，所有这些设置都是关闭的，以实现最佳性能（更少的扩展，更好的性能）。

```ts
import { App } from '@tinyhttp/app'

const app = new App({
  settings: {
    networkExtensions: true,
  },
})

app.use((req, res) => void res.send(`Hostname: ${req.hostname}`)).listen(3000)
```

以下是所有设置的列表：

- `networkExtensions` - 网络 `req` 扩展
- `subdomainOffset` - `req.subdomains` 的子域偏移
- `bindAppToReqRes` - 将当前 `App` 绑定到 `req.app` 和 `res.app`
- `xPoweredBy` - 设置 `X-Powered-By: "tinyhttp"` 头
- `enableReqRoute` - 启用 `req.route` 属性
- `views` - 模板所在的视图目录
- `view` - 自定义视图对象以处理模板引擎渲染逻辑
- `view cache` - 切换视图缓存
- `view engine` - 默认引擎扩展（例如 `eta`）

#### `networkExtensions`

启用了一组与网络相关的请求对象 (`Request object`) 扩展。

- [`req.protocol`](#req-protocol)
- [`req.secure`](#req-secure)
- [`req.hostname`](#req-hostname)
- [`req.ip`](#req-ip)
- [`req.ips`](#req-ips)
- [`req.subdomains`](#req-subdomains)

#### `subdomainOffset`

`req.subdomains` 的子域偏移量。默认为 `2`。

#### `bindAppToReqRes`

将应用程序绑定为对实际应用程序的引用到 `req.app` 和 `res.app`。默认情况下禁用。

#### `enableReqRoute`

启用 `req.route` 属性。默认情况下禁用。

## 属性

### `app.locals`

`app.locals` 对象具有在应用程序内的局部变量属性。

```ts
console.dir(app.locals.title)
// => 'My App'

console.dir(app.locals.email)
// => 'me@myapp.com'
```

一旦设置，app.locals 属性的值将在应用程序的整个生命周期内持续存在，这与 res.locals 属性仅在请求的生命周期内有效形成对比。

您可以在应用程序中渲染的模板中访问局部变量。这对于向模板提供辅助函数以及应用程序级数据非常有用。

```ts
app.locals.title = 'My App'
app.locals.strftime = require('strftime')
app.locals.email = 'me@myapp.com'
```

### `app.parent`

`app.parent` 指向一个父 `App` 对象，例如挂载到的应用。

```js
const app = new App()

const subapp = new App()

app.use(subapp)

console.log(app.parent)

/*
<ref *1> App {
  middleware: [],
  mountpath: '/',
  apps: {
    '/': App {
      middleware: [],
      mountpath: '/',
      apps: {},
      parent: [Circular *1]
    }
  }
}
*/
```

## 方法

### `app.METHOD`

路由一个 HTTP 请求，其中 METHOD 是请求的 HTTP 方法，例如 GET、PUT、POST 等，均为小写。因此，实际的方法是 app.get()、app.post()、app.put() 等。

### `app.all`

此方法类似于标准的 [`app.METHOD()`](#app-method) 方法，但它匹配所有 HTTP 动词。

无论使用 GET、POST、PUT、DELETE 还是任何其他 HTTP 请求方法，以下回调将在对 `/secret` 的请求中执行：

```ts
app.all('/secret', (req, res, next) => {
  console.log('Accessing the secret section ...')
  next() // 将控制权传递给下一个处理程序
})
```

`app.all()` 方法对于映射特定路径前缀或任意匹配的“全局”逻辑非常有用。例如，如果您将以下内容放在所有其他路由定义的顶部，它要求从那时起的所有路由都需要身份验证，并自动加载用户。请记住，这些回调不必作为端点：loadUser 可以执行一个任务，然后调用 `next()` 继续匹配后续路由。

```ts
app.all('*', requireAuthentication, loadUser)
```

### `app.get`

将 HTTP GET 请求路由到指定路径，并使用指定的处理函数。

```ts
app.get('/', (req, res) => {
  res.send(`对主页的 ${req.method || 'GET'} 请求`)
})
```

### `app.post`

将 HTTP POST 请求路由到指定路径，并使用指定的处理函数。

```ts
app.post('/', (req, res) => {
  res.send(`对主页的 ${req.method || 'POST'} 请求`)
})
```

### `app.put`

将 HTTP PUT 请求路由到指定路径，并使用指定的处理函数。

```ts
app.put('/', (req, res) => {
  res.send(`对主页的 ${req.method || 'PUT'} 请求`)
})
```

### `app.delete`

将 HTTP DELETE 请求路由到指定路径，并使用指定的处理函数。

```ts
app.delete('/', (req, res) => {
  res.send(`对主页的 ${req.method || 'DELETE'} 请求`)
})
```

### `app.use`

在指定路径上挂载指定的中间件函数或函数：当请求路径的基础与路径匹配时，将执行中间件函数。

路由将匹配任何紧接其路径后面带有 `/` 的路径。例如：`app.use('/apple', ...)` 将匹配 `/apple`、`/apple/images`、`/apple/images/news` 等等。

由于路径默认为 `/,` 没有路径的中间件将对应用程序的每个请求执行。
例如，这个中间件函数将对应用程序的每个请求执行：

```ts
app.use((req, res, next) => {
  console.log('Time: %d', Date.now())
  next()
})
```

中间件函数是按顺序执行的，因此中间件的包含顺序很重要。

```ts
// 此中间件将不会允许请求继续向下传递
app.use((req, res, next) => void res.send('Hello World'))

// 请求将永远不会到达此路由
app.get('/', (req, res) => void res.send('Welcome'))
```

### `app.engine`

注册一个模板引擎。适用于任何包含 `renderFile` 函数的 Express 模板引擎。

```js
import { App } from '@tinyhttp/app'
import { renderFile } from 'eta'

const app = new App()

app.engine('eta', renderFile) // 将 `app.engines['eta']` 映射到 `renderFile`
```

### `app.render`

> [Eta v2](https://eta.js.org/docs/2.x.x/examples/express) 最适合与 tinyhttp 一起使用。使用 [Eta v3](https://eta.js.org/docs/api#setting-up-eta) 时，无需注册引擎，您应该使用 `Eta` 实例来渲染模板。

使用之前通过 [`app.engine`](#app-engine) 设置的引擎渲染文件。要渲染并响应结果，请使用 [`res.render`](#res-render)。

```js
import { App } from '@tinyhttp/app'
import { renderFile } from 'eta'

const app = new App()

app.engine('eta', renderFile)

app.render(
  'index',
  { name: 'Eta' },
  {
    /* some options */
  },
  (err, html) => {
    if (err) throw err
    doSomethingWithHTML(html)
  }
)
```

tinyhttp 还不支持 `app.render` 重载。因此，一些引擎（例如 Pug）可能需要额外的包装。

```js
import { App } from '@tinyhttp/app'
import pug from 'pug'

const app = new App()

const renderPug = (path, _, options, cb) => pug.renderFile(path, options, cb)

app.engine('pug', renderPug)

app.use((_, res) => void res.render('index.pug'))

app.listen(3000, () => console.log(`Listening on http://localhost:3000`))
```

### `app.path`

返回应用的挂载路径。

```js
const app = new App()
const blog = new App()
const blogAdmin = new App()

app.use('/blog', blog)
blog.use('/admin', blogAdmin)

console.dir(app.path()) // ''
console.dir(blog.path()) // '/blog'
console.dir(blogAdmin.path()) // '/blog/admin'
```

### `app.route`

返回单个路由的实例，您可以使用它来处理带有可选中间件的 HTTP 方法（动词）。使用 `app.route()` 来避免重复的路由名称。

```js
new App()
  .route('/events')
  .all((req, res, next) => {
    // 首先为所有 HTTP 方法（动词）运行
    // 可以将其视为路由特定的中间件！
  })
  .get((req, res, next) => res.json({ hello: 'world' }))
  .post((req, res, next) => {
    // maybe add a new event...
  })
```

### `app.enable`

将 `Boolean` 设置名称设置为 `true`，其中名称是应用程序设置中的属性之一。

```js
app.enable('networkExtensions')
```

### `app.disable`

将 `Boolean` 设置名称设置为 `false`，其中名称是应用程序设置中的属性之一。

```js
app.disable('networkExtensions')
```

### `app.set`

将设置名称设置为值，其中是应用程序设置中的属性之一。

```js
app.set('subdomainOffset', 2)
```

### `app.handler`

扩展 `req` / `res` 对象，推送 404 和 500 处理程序，调度中间件并匹配路径。

在某些情况下，您不需要启动服务器，而是传递 `req` / `res` 处理程序。

例如，您想启动一个 HTTP/2 服务器而不是 HTTP 服务器：

```ts
import { App } from '@tinyhttp/app'
import type { Request, Response } from '@tinyhttp/app'
import fs from 'fs'
import { createSecureServer } from 'http2'

const app = new App()

const options = {
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
}

app.get(
  '/',
  (req, res) => void res.send(`Hello from HTTP ${req.httpVersion} server!`)
)

createSecureServer(options, async (req: Request, res: Response) => {
  await app.handler(req, res)
}).listen(3000)
```

在 Serverless 函数（例如 Vercel）中传递处理程序也是很常见的，像这样：

```js
const { App } = require('@tinyhttp/app')

app.use((req, res) => void res.send(`You're on ${req.url}`))

module.exports = async (req, res) => await app.handler(req, res)
```

### `app.listen`

启动一个 HTTP 服务器，并在指定的端口和主机上监听。

```js
import { App } from '@tinyhttp/app'

const app = new App()

app
  .use((_, res) => void res.send('Hello World'))
  .listen(3000, () => console.log(`Started on :3000`))
```
