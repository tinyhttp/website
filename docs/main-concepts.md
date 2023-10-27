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

# Main Concepts

## Application

A tinyhttp app is an instance of `App` class containing middleware and router methods.

```js
import { App } from '@tinyhttp/app'

const app = new App()

app.use((req, res) => void res.send('Hello World'))

app.listen(3000)
```

App options can be set inside a constructor.

```js
const app = new App({
  noMatchHandler: (req, res) => void res.send('Oopsie, page cannot be found'),
})
```

## Middleware

Middleware is a an object containing a handler function and a path (optionally), just like in Express.

```js
app
  .use((req, _res, next) => {
    console.log(`Made a request from ${req.url}!`)
    next()
  })
  .use((_req, res) => void res.send('Hello World'))
```

### Handler

Handler is a function that accepts `Request` and `Response` object as arguments. These objects are extended versions of built-in `http`'s `IncomingMessage` and `ServerResponse`.

```js
app.use((req, res) => {
  res.send({ query: req.query })
})
```

### Async handlers

tinyhttp, unlike Express, supports asynchronous functions as handlers. Any error thrown by a promise will be caught by a top-level `try...catch`, meaning that you don't have to wrap it in your own `try...catch` unless you need it.

```js
import { App } from '@tinyhttp/app'
import { readFile } from 'node:fs/promises'

app.use('/', async (req, res, next) => {
  const file = await readFile('file.txt') // in case of error it will send 500 with error message
  res.send(file)
})
```

### Path

the request URL starts with the specified path, the handler will process request and response objects. Middleware only can handle URLs that start with a specified path. For advanced paths (with params and exact match), go to the [Routing](#routing) section.

```js
app.use('/', (_req, _res, next) => void next()) // Will handle all routes
app.use('/path', (_req, _res, next) => void next()) // Will handle routes starting with /path
```

`path` argument is optional (and defaults to `/`), so you can put your handler function as the first argument of `app.use`.

### Chaining

tinyhttp app returns itself on any `app.use` call which allows us to do chaining:

```js
app.use((_) => {}).use((_) => {})
```

Routing functions like `app.get` support chaining as well.

### Execution order

All middleware executes in a loop. Once a middleware handler calls `next()` tinyhttp goes to the next middleware until the loop finishes.

```js
app
  .use((_, res) => res.end('Hello World'))
  .use((_, res) => res.end('I am the unreachable middleware'))
```

Remember to call `next()` in your middleware chains because otherwise it will stick to a current handler and won't switch to next one.

## Routing

_**Routing**_ is defining how your application handles requests using with specific paths (e.g. `/` or `/test`) and methods (`GET`, `POST` etc).

Each route can have one or many middlewares in it, which handle when the path matches the request URL.

Routes usually have the following structure:

```js
app.METHOD(path, handler, ...handlers)
```

Where `app` is tinyhttp `App` instance, `path` is the path that should match the request URL and `handler` (+ `handlers`) is a function that is executed when the specified paths match the request URL.

```js
import { App } from '@tinyhttp/app'

const app = new App()

app.get('/', (_req, res) => void res.send('Hello World'))
```

### Router functions

Most popular methods (e.g. `GET`, `POST`, `PUT`, `OPTIONS`) have pre-defined functions for routing. In the future releases of tinyhttp all methods will have their functions.

```js
app
  .get('/', (_req, res) => void res.send('Hello World'))
  .post('/a/b', (req, res) => void res.send('Sent a POST request'))
```

To handle all HTTP methods, use `app.all`:

```js
app.all('*', (req, res) =>
  res.send(`Made a request on ${req.url} via ${req.method}`)
)
```

### Route paths

Route paths, in combination with a request method, define the endpoints at which requests can be made. Route paths can be strings, string patterns, or regular expressions (not yet).

> tinyhttp uses a [regexparam](https://github.com/lukeed/regexparam) module to do route matching. For more information about routing patterns, check its README.

Note that query strings (symbols after last `?` in request URL) are stripped from the path.

Here are some examples of route paths based on strings.

This route path will match requests to the root route, /.

```js
app.get('/', function (req, res) {
  res.send('root')
})
```

This route path will match requests to /about.

```js
app.get('/about', function (req, res) {
  res.send('about')
})
```

This route path will match requests to /random.text.

```js
app.get('/random.text', (req, res) => void res.send('random.text'))
```

This route path will match acd and abcd.

```js
app.get('/ab?cd', (req, res) => void res.send('ab?cd'))
```

#### Route parameters

Route parameters are named URL segments that are used to capture the values specified at their position in the URL. The captured values are populated in the `req.params` object, with the name of the route parameter specified in the path as their keys.

```
Route path: /users/:userId/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
req.params: { "userId": "34", "bookId": "8989" }
```

To define routes with route parameters, simply specify the route parameters in the path of the route:

```js
app.get('/users/:userId/books/:bookId', (req, res) => void res.send(req.params))
```

### Route handlers

You can provide multiple callback functions that behave like [middleware](#middleware) to handle a request. The only exception is that these callbacks might invoke `next()` to bypass the remaining route callbacks. You can use this technique to conditionally switch or skip middleware when it's not required anymore to stay in the current middleware.

Route handlers can be in the form of a function or a list of functions, as shown in the following examples.

A single callback function can handle a route. For example:

```js
app.get('/example/a', (req, res) => void res.send('Hello from A!'))
```

More than one callback function can handle a route (make sure you specify the `next` function). For example:

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

A list of callback functions can handle a route. For example:

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

## Subapps

You can use tinyhttp's `App` to create a modular group of handlers and then bind them to another "main" App.

Each app has its own pack of middleware, settings, and locales in it. Currently, the support is experimental and probably will not work as expected (not all cases are tested yet), but you still could try it:

```js
import { App } from '@tinyhttp/app'

const app = new App()

const subApp = new App()

subApp.get(
  '/route',
  (req, res) => void res.send(`Hello from ${subApp.mountpath}`)
)

app.use('/subapp', subApp).listen(3000)

// localhost:3000/subapp/route will send "Hello from /subapp"
```

## Error handling

Errors in async middlewares are handled by tinyhttp but you can add your own `try...catch` to handle a specific error. Although, it's recommended to use a centralized `onError` handler instead.

```js
import { App } from '@tinyhttp/app'
import { readFile } from 'fs/promises'

const app = new App({
  // Custom error handler
  onError: (err, _req, res) => {
    console.log(err)
    res.status(500).send(`Something bad happened`)
  },
})

app
  .get('/', async (_, res, next) => {
    const file = await readFile(`non_existent_file`)
    res.send(file.toString())
  })
  .listen(3000, () => console.log('Started on http://localhost:3000'))
```

## Template engines

> Starting from v0.2.70, tinyhttp had basic support for template engines. Since v2.2, the view engine has been revamped for better compatibility with express.

In order to use an engine, you should first register it for a specific extension.

```js
import { App } from '@tinyhttp/app'
import eta from 'eta'

const app = new App()

app.engine('eta', eta.renderFile) // maps app.engines['eta'] to eta.renderFile function
```

Additionally, you can set a default engine (which will be used for all templates by default):

```js
app.set('view engine', 'eta')
```

And now it's possible to render any template file using the `res.render` method:

```ts
import { App } from '@tinyhttp/app'
import eta from 'eta'
import type { PartialConfig } from 'eta/dist/types/config' // make `res.render` inherit the template engine settings type

const app = new App()

app.engine('eta', eta.renderFile)

app.use(
  (_, res) => void res.render<PartialConfig>('index.eta', { name: 'Eta' })
)

app.listen(3000, () => console.log(`Listening on http://localhost:3000`))
```

For advanced configuration, refer to [custom view](https://github.com/tinyhttp/tinyhttp/tree/master/examples/custom-view) and [eta](https://github.com/tinyhttp/tinyhttp/tree/master/examples/eta) examples.
