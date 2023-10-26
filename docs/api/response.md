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

## Response

The `res` object represents the HTTP response that a tinyhttp app sends when it gets an HTTP request.

## Properties

### `res.app`

> This property can be enabled via `bindAppToReqRes` setting

Points to a reference of the currently used app.

```js
app.use((req, res) => {
  res.json(res.app.settings)
})
```

## Methods

### `res.append`

Appends the specified `value` to the HTTP response `header` field. If the header is not already set, it creates the header with the specified value. The value parameter can be a string or an array.

> calling [`res.set()`](#resset) after [`res.append()`](#resappend) will reset the previously-set header value.

```js
res.append('Link', ['<http://localhost/>', '<http://localhost:3000/>'])
res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly')
res.append('Warning', '199 Miscellaneous warning')
```

### `res.cookie`

Sets cookie `name` to `value`. The `value` parameter may be a string or object converted to JSON.

The `options` parameter is an object that can have the following properties.

| Property   | Type                | Description                                                                                                                                  |
| ---------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`   | `string`            | Domain name for the cookie. Defaults to the domain name of the app.                                                                          |
| `encode`   | `Function`          | A synchronous function used for cookie value encoding. Defaults to `encodeURIComponent`.                                                     |
| `expires`  | `Date`              | Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie.                                                    |
| `httpOnly` | `boolean`           | Flags the cookie to be accessible only by the web server.                                                                                    |
| `maxAge`   | `number`            | Convenient option for setting the expiry time relative to the current time in milliseconds.                                                  |
| `path`     | `string`            | Path for the cookie. Defaults to “/”.                                                                                                        |
| `secure`   | `boolean`           | Marks the cookie to be used with HTTPS only.                                                                                                 |
| `signed`   | `boolean`           | Indicates if the cookie should be signed.                                                                                                    |
| `sameSite` | `boolean \| string` | Value of the “SameSite” Set-Cookie attribute. [More info](https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1). |

> All `res.cookie()` does is set the HTTP Set-Cookie header with the options provided. Any option not specified defaults to the value stated in RFC 6265.

```ts
res.cookie('name', 'tobi', {
  domain: '.example.com',
  path: '/admin',
  secure: true,
})

// Enable "httpOnly" and "expires" parameters
res.cookie('rememberme', '1', {
  expires: new Date(Date.now() + 900000),
  httpOnly: true,
})
```

### `res.clearCookie`

Clears the cookie specified by `name`. For details about the `options` object, see [`res.cookie()`](#rescookie).

> Web browsers and other compliant clients will only clear the cookie if the given options is identical to those given to [`res.cookie()`](#rescookie), excluding expires and maxAge.

```ts
res.cookie('name', 'tobi', { path: '/admin' })
res.clearCookie('name', { path: '/admin' })
```

### `res.end`

Ends the response process. The method comes from [response.end() of http.ServerResponse.](https://nodejs.org/api/http.html#http_response_end_data_encoding_callback).

Can be used to send raw data or end the response without any data at all. If you need to respond with data with proper content type headers set and so on, instead use methods such as [`res.send()`](#ressend) and [`res.json()`](#resjson).

```ts
res.end()
res.status(404).end()
```

### `res.json`

Sends a JSON response. This method sends a response (with the correct `Content-Type` header) that is the parameter converted to a JSON string using [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

The body can be any kind of JSON, including object, array, `string`, `boolean`, `number`, or `null`.

```ts
res.json(null)
res.json({ user: 'tobi' })
res.status(500).json({ error: 'message' })
```

### `res.send`

Sends the HTTP response.

The body can be a `Buffer` object, a string, an object, or an array.

```ts
res.send(Buffer.from('whoop'))
res.send({ some: 'json' })
res.send('<p>some html</p>')
res.status(404).send('Sorry, we cannot find that!')
res.status(500).send({ error: 'something blew up' })
```

This method performs many useful tasks for simple non-streaming responses: For example, it automatically set the proper `Content-Length` header value and provides automatic HEAD and HTTP cache freshness support.

When the parameter is a `Buffer` object, the method sets the `Content-Type` response header field to `"application/octet-stream"`, unless previously defined as shown below:

```ts
res.set('Content-Type', 'text/html')
res.send(Buffer.from('<p>some html</p>'))
```

When the parameter is a string, the method sets the `Content-Type` to `"text/html"`:

```ts
res.send('<p>some html</p>')
```

When the parameter is an Array or Object, Express responds with the JSON representation (same as [`res.json`](#resjson)):

```ts
res.send({ user: 'tobi' })
res.send([1, 2, 3])
```

### `res.status`

Sets the HTTP status for the response. It is a chainable alias of Node’s `response.statusCode`.

```ts
res.status(403).end()
res.status(400).send('Bad Request')
```

### `res.sendStatus`

Sets the response HTTP status code to statusCode and send its string representation as the response body.

```ts
res.sendStatus(200) // equivalent to res.status(200).send('OK')
res.sendStatus(403) // equivalent to res.status(403).send('Forbidden')
res.sendStatus(404) // equivalent to res.status(404).send('Not Found')
res.sendStatus(500) // equivalent to res.status(500).send('Internal Server Error')
```

If an unsupported status code is specified, the HTTP status is still set to statusCode and the string version of the code is sent as the response body.

```ts
res.sendStatus(9999) // equivalent to res.status(9999).send('9999')
```

[More about HTTP Status Codes](http://en.wikipedia.org/wiki/List_of_HTTP_status_codes)

### `res.sendFile`

Sends a file by piping a stream to response. It also checks for extension to set a proper `Content-Type` header field.

> Path argument must be absolute. To use a relative path, specify the `root` option first.

```js
res.sendFile('song.mp3', { root: process.cwd() }, (err) => console.log(err))
```

### `res.set`

Sets the response’s HTTP header `field` to `value`. To set multiple fields at once, pass an object as the parameter.

```ts
res.set('Content-Type', 'text/plain')

res.set({
  'Content-Type': 'text/plain',
  'Content-Length': '123',
  ETag: '12345',
})
```

Alias to `res.header`.

### `res.links`

Joins the `links` provided as properties of the parameter to populate the response’s `Link` HTTP header field.

For example, the following call:

```ts
res.links({
  next: 'http://api.example.com/users?page=2',
  last: 'http://api.example.com/users?page=5',
})
```

Yields the following results:

```txt
Link: <http://api.example.com/users?page=2>; rel="next",
      <http://api.example.com/users?page=5>; rel="last"
```

### `res.location`

Sets the response Location HTTP header to the specified path parameter.

```ts
res.location('/foo/bar')
res.location('http://example.com')
res.location('back')
```

A `path` value of `"back"` has a special meaning, it refers to the URL specified in the `Referer` header of the request. If the Referer header was not specified, it refers to `"/"`.

> After encoding the URL, if not encoded already, tinyhttp passes the specified URL to the browser in the `Location` header, without any validation. Browsers take the responsibility of deriving the intended URL from the current URL or the referring URL, and the URL specified in the Location header; and redirect the user accordingly.

### `res.render`

Render a template using a pre-defined engine and respond with the result.

```js
import { App } from '@tinyhttp/app'
import ejs from 'ejs'

const app = new App()

app.engine('ejs', ejs.renderFile)

app.use((_, res) => void res.render('index.ejs', { name: 'EJS' }))

app.listen(3000, () => console.log(`Listening on http://localhost:3000`))
```

### `res.vary`

Adds the field to the Vary response header, if it is not there already.

```js
res.vary('User-Agent').render('docs')
```

### `res.format`

Sends a conditional response based on the value in `Accept` header. For example, if `Accept` contains `html`, the HTML option will be sent.

```js
res.format({
  html: (req, res) => void res.send('<h1>Hello World for HTML</h1>')
  text: (req, res) => void res.send('Hello World for text')
})
```

and depending on the `Accept` header, it will send different responses:

```sh
curl -H "Accept: text/html" localhost:3000
# <h1>Hello World for HTML</h1>

curl localhost:3000
# Hello World for text
```

### `res.redirect`

Redirect to a URL by sending a 302 (or any other) status code and `Location` header with the specified URL.

```js
res.redirect('/another-page')

// custom status
res.redirect('/some-other-page', 300)
```

### `res.type`

Sets the `Content-Type` HTTP header to the MIME type as determined by [mime.lookup()](https://github.com/talentlessguy/es-mime-types/blob/master/src/index.ts#L123) for the specified type. If type contains the `/` character, then it sets the `Content-Type` to type.

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

Send JSON response with JSONP callback support. `res.jsonp` isn't used that often so it's located in a separate package - [`@tinyhttp/jsonp`](https://github.com/tinyhttp/tinyhttp/blob/master/packages/jsonp)

Here's how to enable it:

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
