---
head:
  - - meta
    - property: og:title
      content: Request
  - - meta
    - name: description
      content: tinyhttp Request object documentation.
  - - meta
    - property: og:description
      content: tinyhttp Request object documentation.
---

## 请求体

`req` 对象表示 HTTP 请求，并具有请求查询字符串、参数、主体、HTTP 头等属性。

```ts
app.get('/user/:id', (req, res) => void res.send(`user ${req.params.id}`))
```

req 对象是 Node.js 内置的 [IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) 对象的增强版本。

## 属性

### `req.hostname`

包含从 `Host` 或 `X-Forwarded-Host` HTTP 头派生的主机名。

```ts
// Host: "example.com:3000"
console.dir(req.hostname)
// => 'example.com'
```

### `req.query`

该属性是一个对象，包含路由中每个查询字符串参数的属性。

```ts
// GET /search?q=tobi+ferret
console.dir(req.query.q)
// => "tobi ferret"

// GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
console.dir(req.query.order)
// => "desc"

console.dir(req.query.shoe.color)
// => "blue"

console.dir(req.query.shoe.type)
// => "converse"

// GET /shoes?color[]=blue&color[]=black&color[]=red
console.dir(req.query.color)
// => [blue, black, red]
```

### `req.route`

> 此属性可以通过 `enableReqRoute` 设置启用

包含当前匹配的路由，为一个字符串。例如：

```ts
app.get('/user/:id?', function userIdHandler(req, res) {
  console.log(req.route)
  res.send('GET')
})
```

可能的示例输出：

```txt
{
  path: '/user/:id?',
  method: 'GET',
  handler: [Function: userIdHandler],
  type: 'route'
}
```

### `req.params`

该属性是一个对象，包含映射到命名路由“parameters”的属性。例如，如果您有路由 `/user/:name`，则“name”属性可作为 `req.params.name` 使用。该对象默认为 `{}`。

```ts
// GET /user/v1rtl

app.get('/user/:name', (req, res) => {
  res.end(`Hello ${req.params.name}!`)
})
// => v1rtl
```

### `req.protocol`

包含请求协议字符串：http 或（对于 TLS 请求）https。如果存在，此属性将使用 `X-Forwarded-Proto` 头字段的值。此头可以由客户端或代理设置。

```ts
console.dir(req.protocol)
```

### `req.secure`

一个 Boolean 属性，如果建立了 TLS 连接，则为 true。等同于以下内容：

```ts
req.protocol === 'https'
```

### `req.xhr`

一个 Boolean 属性，如果请求的 `X-Requested-With` 头字段为 “XMLHttpRequest”，则为 true，这表明请求是由像 `fetch` 这样的客户端库发出的。

```ts
console.dir(req.xhr)
// => true
```

### `req.fresh`

当响应在客户端缓存中仍然“新鲜”时，返回 true；否则返回 false，以指示客户端缓存现在已过期，应该发送完整响应。

当客户端发送 `Cache-Control: no-cache` 请求头以指示端到端重新加载请求时，该模块将返回 false，以使处理这些请求变得透明。

有关缓存验证工作原理的更多详细信息，请参见 [HTTP/1.1 缓存规范](https://tools.ietf.org/html/rfc7234)。

```ts
console.dir(req.fresh)
// => true
```

### `req.stale`

指示请求是否“过时”，并且与 `req.fresh` 相反。有关更多信息，请参见 [`req.fresh`](#req-fresh)。

```ts
console.dir(req.stale)
// => true
```

### `req.ip`

包含请求的远程IP地址。

```ts
console.log(req.ip)
// => '127.0.0.1'
```

### `req.ips`

包含请求的远程IP地址数组。

```ts
console.log(req.ips)
// => [127.0.0.1']
```

### `req.subdomains`

> 此属性可以通过 `networkExtensions` 设置启用

包含一个子域数组。子域偏移量可以通过 `subdomainOffset` 设置

```ts
console.log(req.hostname)
// dev.node0.example.com

console.log(req.subdomains)
// ['node0', 'dev']
```

### `req.app`

> 此属性可以通过 `bindAppToReqRes` 设置启用

指向当前使用的应用程序的引用。

```ts
app.use((req, res) => void res.json(req.app.settings))
```

### `req.path`

包含请求 URL 的路径部分。

```js
// example.com/users?sort=desc
console.dir(req.path)
// => '/users'
```

## 方法

### `req.accepts`

检查指定的内容类型是否可接受，基于请求的 `Accept` HTTP 头字段。该方法返回最佳匹配，如果没有指定的内容类型可接受，则返回 `false`（在这种情况下，应用程序应响应 `406 "Not Acceptable"`）。

类型值可以是单个 MIME 类型字符串（例如 `"application/json"`）、扩展名（例如 `"json"`）、以逗号分隔的列表或数组。对于列表或数组，该方法返回 _**最佳**_ 匹配（如果有的话）。

```ts
// Accept: text/html
req.accepts('html')
// => "html"

// Accept: text/*, application/json
req.accepts('html')
// => "html"
req.accepts('text/html')
// => "text/html"
req.accepts(['json', 'text'])
// => "json"
req.accepts('application/json')
// => "application/json"

// Accept: text/*, application/json
req.accepts('image/png')
req.accepts('png')
// => false

// Accept: text/*;q=.5, application/json
req.accepts(['html', 'json'])
// => "json"
```

有关更多信息，或如果您有问题或疑虑，请参见 [accepts](https://github.com/jshttp/accepts)。

### `req.acceptsEncodings`

根据请求的 `Accept-Encoding` HTTP 头字段，返回指定编码中第一个被接受的编码。如果没有接受指定的编码，则返回 `false`。

### `req.acceptsCharsets`

根据请求的 `Accept-Charset` HTTP 头字段，返回指定字符集中的第一个被接受的字符集。如果没有接受指定的字符集，则返回 `false`。

### `req.get`

返回指定的 HTTP 请求头字段（不区分大小写匹配）。

```ts
req.get('Content-Type')
// => "text/plain"

req.get('content-type')
// => "text/plain"

req.get('Something')
// => undefined
```

### `req.range`

解析 `Range` 头。

```js
app.use((req, res) => {
  const ranges = req.range(1000)

  if (range.type === 'bytes') {
  // the ranges
  range.forEach((r) => {
    // do something with r.start and r.end
  })
})
```
