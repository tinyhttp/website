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

# Request

The `req` object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.

```ts
app.get('/user/:id', (req, res) => void res.send(`user ${req.params.id}`))
```

The req object is an enhanced version of Node.js built-in [IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) object.

## Properties

### `req.hostname`

Contains the hostname derived from either `Host` or `X-Forwarded-Host` HTTP header.

```ts
// Host: "example.com:3000"
console.dir(req.hostname)
// => 'example.com'
```

### `req.query`

This property is an object containing a property for each query string parameter in the route.

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

> This property can be enabled via `enableReqRoute` setting

Contains the currently-matched route, a string. For example:

```ts
app.get('/user/:id?', function userIdHandler(req, res) {
  console.log(req.route)
  res.send('GET')
})
```

Example output would be something like this:

```txt
{
  path: '/user/:id?',
  method: 'GET',
  handler: [Function: userIdHandler],
  type: 'route'
}
```

### `req.params`

This property is an object containing properties mapped to the named route “parameters”. For example, if you have the route `/user/:name`, then the “name” property is available as `req.params.name`. This object defaults to `{}`.

```ts
// GET /user/v1rtl

app.get('/user/:name', (req, res) => {
  res.end(`Hello ${req.params.name}!`)
})
// => v1rtl
```

### `req.protocol`

Contains the request protocol string: either http or (for TLS requests) https. This property will use the value of the `X-Forwarded-Proto` header field if present. This header can be set by the client or by the proxy.

```ts
console.dir(req.protocol)
```

### `req.secure`

A Boolean property that is true if a TLS connection is established. Equivalent to the following:

```ts
req.protocol === 'https'
```

### `req.xhr`

A Boolean property that is true if the request’s `X-Requested-With` header field is “XMLHttpRequest”, indicating that the request was issued by a client library such as `fetch`.

```ts
console.dir(req.xhr)
// => true
```

### `req.fresh`

When the response is still “fresh” in the client’s cache true is returned, otherwise false is returned to indicate that the client cache is now stale and the full response should be sent.

When a client sends the `Cache-Control: no-cache` request header to indicate an end-to-end reload request, this module will return false to make handling these requests transparent.

Further details for how cache validation works can be found in the [HTTP/1.1 Caching Specification](https://tools.ietf.org/html/rfc7234).

```ts
console.dir(req.fresh)
// => true
```

### `req.stale`

Indicates whether the request is “stale,” and is the opposite of `req.fresh`. For more information, see [`req.fresh`](#req-fresh).

```ts
console.dir(req.stale)
// => true
```

### `req.ip`

Contains the remote IP address of the request.

```ts
console.log(req.ip)
// => '127.0.0.1'
```

### `req.ips`

Contains an array of remote IP addresses of the request.

```ts
console.log(req.ips)
// => [127.0.0.1']
```

### `req.subdomains`

> This property can be enabled via `networkExtensions` setting

Contains an array of subdomains. Subdomain offset can be set via `subdomainOffset`

```ts
console.log(req.hostname)
// dev.node0.example.com

console.log(req.subdomains)
// ['node0', 'dev']
```

### `req.app`

> This property can be enabled via `bindAppToReqRes` setting

Points to a reference of the currently used app.

```ts
app.use((req, res) => void res.json(req.app.settings))
```

### `req.path`

Contains the path part of the request URL.

```js
// example.com/users?sort=desc
console.dir(req.path)
// => '/users'
```

## Methods

### `req.accepts`

Checks if the specified content types are acceptable, based on the request’s `Accept` HTTP header field. The method returns the best match, or if none of the specified content types is acceptable, returns `false` (in which case, the application should respond with `406 "Not Acceptable"`).

The type value may be a single MIME type string (such as `"application/json"`), an extension name such as `"json"`, a comma-delimited list, or an array. For a list or array, the method returns the _**best**_ match (if any).

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

For more information, or if you have issues or concerns, see [accepts](https://github.com/jshttp/accepts).

### `req.acceptsEncodings`

Returns the first accepted encoding of the specified encodings, based on the request’s `Accept-Encoding` HTTP header field. If none of the specified encodings is accepted, returns `false`.

### `req.acceptsCharsets`

Returns the first accepted charset of the specified character sets, based on the request’s `Accept-Charset` HTTP header field. If none of the specified charsets is accepted, returns .`false`

### `req.get`

Returns the specified HTTP request header field (case-insensitive match).

```ts
req.get('Content-Type')
// => "text/plain"

req.get('content-type')
// => "text/plain"

req.get('Something')
// => undefined
```

### `req.range`

Parse `Range` header.

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
