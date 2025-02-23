---
head:
  - - meta
    - property: og:title
      content: Response
  - - meta
    - name: description
      content: tinyhttp Response object documentation.
  - - meta
    - property: og:description
      content: tinyhttp Response object documentation.
---

## 响应体

`res` 对象表示 tinyhttp 应用在收到 HTTP 请求时发送的 HTTP 响应。

## 属性

### `res.app`

> 此属性可以通过 `bindAppToReqRes` 设置启用

指向当前使用的应用程序的引用。

```js
app.use((req, res) => {
  res.json(res.app.settings)
})
```

## 方法

### `res.append`

将指定的 `value` 附加到 HTTP 响应 `header` 字段。如果该头部尚未设置，则使用指定的值创建该头部。值参数可以是字符串或数组。

> 在 [`res.append()`](#res-append) 之后调用 [`res.set()`](#res-set) 将重置先前设置的头部值。

```js
res.append('Link', ['<http://localhost/>', '<http://localhost:3000/>'])
res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly')
res.append('Warning', '199 Miscellaneous warning')
```

### `res.cookie`

将 cookie 的 `name` 设置为 `value`。`value` 参数可以是字符串或转换为 JSON 的对象。

`options` 参数是一个对象，可以具有以下属性。

| 属性       | 类型                 | 描述                                                                                                                          |
| ---------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `domain`   | `string`            | cookie 的域名。默认为应用的域名。                                                                                               |
| `encode`   | `Function`          | 用于 cookie 值编码的同步函数。默认为 `encodeURIComponent`。                                                                     |
| `expires`  | `Date`              | cookie 的过期日期（GMT）。如果未指定或设置为 0，则创建会话 cookie。                                                               |
| `httpOnly` | `boolean`           | 标记该 cookie 仅可由 web 服务器访问。                                                                                           |
| `maxAge`   | `number`            | 相对于当前时间以毫秒为单位设置到期时间的便捷选项。                                                                                |
| `path`     | `string`            |  cookie 的路径。默认为“/”。                                                                                                    |
| `secure`   | `boolean`           | 标记该 cookie 仅用于 HTTPS。                                                                                                   |
| `signed`   | `boolean`           | 指示 cookie 是否应被签名。                                                                                                     |
| `sameSite` | `boolean \| string` | “SameSite” Set-Cookie 属性的值。[更多信息](https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1)。 |

> `res.cookie()` 所做的只是根据提供的选项设置 HTTP Set-Cookie 响应头。任何未指定的选项将默认采用 RFC 6265 中规定的值。

```ts
res.cookie('name', 'tobi', {
  domain: '.example.com',
  path: '/admin',
  secure: true,
})

// 启用 "httpOnly" 和 "expires" 参数
res.cookie('rememberme', '1', {
  expires: new Date(Date.now() + 900000),
  httpOnly: true,
})
```

### `res.clearCookie`

清除指定名称为 `name` 的 cookie。有关 `options` 对象的详细信息，请参见 [`res.cookie()`](#res-cookie)。

> Web 浏览器和其他合规客户端仅在给定的选项与提供给 [`res.cookie()`](#res-cookie) 的选项完全相同（不包括 expires 和 maxAge）时才会清除 cookie。

```ts
res.cookie('name', 'tobi', { path: '/admin' })
res.clearCookie('name', { path: '/admin' })
```

### `res.end`

结束响应过程。该方法来自 [http.ServerResponse 的 response.end()](https://nodejs.org/api/http.html#http_response_end_data_encoding_callback)。

可以用来发送原始数据或在没有任何数据的情况下结束响应。如果您需要以适当的内容类型头等进行响应，请使用 [`res.send()`](#res-send) 和 [`res.json()`](#res-json) 等方法。

```ts
res.end()
res.status(404).end()
```

### `res.json`

发送 JSON 响应。此方法发送一个响应（带有正确的 `Content-Type` 头），该响应是将参数转换为 JSON 字符串，使用 [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)。

主体可以是任何类型的 JSON，包括对象、数组、`string`、`boolean`、`number` 或 `null`。

```ts
res.json(null)
res.json({ user: 'tobi' })
res.status(500).json({ error: 'message' })
```

### `res.send`

发送 HTTP 响应。

主体可以是 `Buffer` 对象、字符串、对象或数组。

```ts
res.send(Buffer.from('whoop'))
res.send({ some: 'json' })
res.send('<p>some html</p>')
res.status(404).send('Sorry, we cannot find that!')
res.status(500).send({ error: 'something blew up' })
```

此方法为简单的非流式响应执行许多有用的任务：例如，它自动设置适当的 `Content-Length` 头部值，并提供自动的 HEAD 和 HTTP 缓存新鲜度支持。

当参数是 `Buffer` 对象时，该方法将 `Content-Type` 响应头字段设置为 `"application/octet-stream"`，除非之前已定义，如下所示：

```ts
res.set('Content-Type', 'text/html')
res.send(Buffer.from('<p>some html</p>'))
```

当参数是字符串时，该方法将 `Content-Type` 设置为 `"text/html"`：

```ts
res.send('<p>some html</p>')
```

当参数是数组或对象时，Express 会以 JSON 表示形式响应（与 [`res.json`](#res-json) 相同）：

```ts
res.send({ user: 'tobi' })
res.send([1, 2, 3])
```

### `res.status`

设置响应的 HTTP 状态。它是 Node 的 `response.statusCode` 的可链式别名。

```ts
res.status(403).end()
res.status(400).send('Bad Request')
```

### `res.sendStatus`

将响应 HTTP 状态代码设置为 statusCode，并将其字符串表示作为响应主体发送。

```ts
res.sendStatus(200) // 相当于 res.status(200).send('OK')  
res.sendStatus(403) // 相当于 res.status(403).send('Forbidden')  
res.sendStatus(404) // 相当于 res.status(404).send('Not Found')  
res.sendStatus(500) // 相当于 res.status(500).send('Internal Server Error')
```

如果指定了不受支持的状态代码，则 HTTP 状态仍设置为 statusCode，并将代码的字符串版本作为响应主体发送。

```ts
res.sendStatus(9999) // 相当于 res.status(9999).send('9999')
```

[更多关于 HTTP 状态码](http://en.wikipedia.org/wiki/List_of_HTTP_status_codes)

### `res.sendFile`

通过将流传输到响应来发送文件。它还会检查扩展名以设置适当的 `Content-Type` 头字段。

> 路径参数必须是绝对的。要使用相对路径，请先指定 `root` 选项。

```js
res.sendFile('song.mp3', { root: process.cwd() }, (err) => console.log(err))
```

### `res.set`

将响应的 HTTP 头 `field` 设置为 `value`。要一次设置多个字段，请将对象作为参数传递。

```ts
res.set('Content-Type', 'text/plain')

res.set({
  'Content-Type': 'text/plain',
  'Content-Length': '123',
  ETag: '12345',
})
```

`res.header` 的别名。

### `res.links`

将作为参数属性提供的 `links` 连接起来，以填充响应的 `Link` HTTP 头字段。

例如，以下调用：

```ts
res.links({
  next: 'http://api.example.com/users?page=2',
  last: 'http://api.example.com/users?page=5',
})
```

产生以下结果：

```txt
Link: <http://api.example.com/users?page=2>; rel="next",
      <http://api.example.com/users?page=5>; rel="last"
```

### `res.location`

将响应的 Location HTTP 头设置为指定的路径参数。

```ts
res.location('/foo/bar')
res.location('http://example.com')
res.location('back')
```

`path` 值为 `"back"` 时有特殊含义，它指的是请求的 `Referer` 头中指定的 URL。如果未指定 Referer 头，则指向 `"/"`。

> 在对 URL 进行编码后（如果尚未编码），tinyhttp 会将指定的 URL 传递给浏览器的 `Location` 头，而不进行任何验证。浏览器负责从当前 URL 或引用 URL 以及 `Location` 头中指定的 URL 推导出预期的 URL，并相应地重定向用户。

### `res.render`

使用预定义的引擎渲染模板，并返回结果。

```js
import { App } from '@tinyhttp/app'
import ejs from 'ejs'

const app = new App()

app.engine('ejs', ejs.renderFile)

app.use((_, res) => void res.render('index.ejs', { name: 'EJS' }))

app.listen(3000, () => console.log(`Listening on http://localhost:3000`))
```

### `res.vary`

如果该字段尚不存在，则将其添加到 Vary 响应头中。

```js
res.vary('User-Agent').render('docs')
```

### `res.format`

根据 `Accept` 头中的值发送条件响应。例如，如果 `Accept` 包含 `html`，则将发送 HTML 选项。

```js
res.format({
  html: (req, res) => void res.send('<h1>Hello World for HTML</h1>')
  text: (req, res) => void res.send('Hello World for text')
})
```

根据 `Accept` 头，它将发送不同的响应：

```sh
curl -H "Accept: text/html" localhost:3000
# <h1>Hello World for HTML</h1>

curl localhost:3000
# Hello World for text
```

### `res.redirect`

通过发送 302（或其他）状态码和带有指定 URL 的 `Location` 头来重定向到 URL。

```js
res.redirect('/another-page')

// custom status
res.redirect('/some-other-page', 300)
```

### `res.type`

将 `Content-Type` HTTP 标头设置为由 [mime.lookup()](https://github.com/talentlessguy/es-mime-types/blob/master/src/index.ts#L123) 确定的指定类型的 MIME 类型。如果类型包含 `/` 字符，则将 `Content-Type` 设置为该类型。

```js
res.type('.html')
// => 'text/html'
res.type('html')
// => 'text/html'
res.type('json')
// => 'application/json'
res.type('application/json')
// => 'application/json'
res.type('png')
// => 'image/png'
```

### `res.jsonp`

发送带有 JSONP 回调支持的 JSON 响应。`res.jsonp` 使用得不太频繁，因此它位于一个单独的包中 - [`@tinyhttp/jsonp`](https://github.com/tinyhttp/tinyhttp/blob/master/packages/jsonp)

以下是如何启用它的步骤：

```js
import { jsonp } from '@tinyhttp/jsonp'

app.use((req, res, next) => {
  res.jsonp = jsonp(req, res, app)
  next()
})

app.get('/', (req, res) => {
  res.jsonp({ some: 'jsonp' })
})
```
