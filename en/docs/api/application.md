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

# Application

The `app` object is the whole tinyhttp application with all the middleware, handlers and settings.

```ts
import { App } from '@tinyhttp/app'

const app = new App()

app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(3000)
```

The app object has methods for

- Routing HTTP requests; see for example, [`app.METHOD`](#app-method).
- Configuring middleware; see [`app.route`](#app-route).
- Rendering HTML views; see [`app.render`](#app-render).
- Registering a template engine; see [`app.engine`](#app-engine).

The tinyhttp application object can be referred from the request object and the response object as `req.app`, and `res.app`, respectively.

## Constructor

### `noMatchHandler(req, res)`

Handler if none of the routes match. Should return 404 Not found.

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

A middleware to catch server errors. Error can be anything. Should return 500 Internal Server Error.

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

A handler-like function that adds request and response extensions to handlers.
By default, the `extendMiddleware` function is used, which contains all tinyhttp's `req` / `res` extensions.

```js
import { App, extendMiddleware } from '@tinyhttp/app'

const app = new App({
  applyExtensions: (req, res, next) => {
    extendMiddleware(req, res, next)

    res.someExt = someExt(req, res, next)
  },
})
```

When an empty function is passed, all extensions from `extendMiddleware` aren't included anymore:

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

You can also disable all of the extensions by passing an empty function:

```js
import { App } from '@tinyhttp/app'

const app = new App({
  applyExtensions: (req, res, next) => {
    next()
  },
})
```

### `settings`

tinyhttp application has a list of settings to toggle various application parts. All of them are opted out by default to achieve the best performance (less extensions, better performance).

```ts
import { App } from '@tinyhttp/app'

const app = new App({
  settings: {
    networkExtensions: true,
  },
})

app.use((req, res) => void res.send(`Hostname: ${req.hostname}`)).listen(3000)
```

Here's a list of all of the settings:

- `networkExtensions` - network `req` extensions
- `subdomainOffset` - subdomain offset for `req.subdomains`
- `bindAppToReqRes` - bind current `App` to `req.app` and `res.app`
- `xPoweredBy` - set `X-Powered-By: "tinyhttp"` header
- `enableReqRoute` - enable `req.route` property
- `views` - views directory where templates are located
- `view` - custom View object to handle template engine rendering logic
- `view cache` - toggle caching of views
- `view engine` - the default engine extension (e.g. `eta`)

#### `networkExtensions`

Enabled a list of Request object extensions related to network.

- [`req.protocol`](#req-protocol)
- [`req.secure`](#req-secure)
- [`req.hostname`](#req-hostname)
- [`req.ip`](#req-ip)
- [`req.ips`](#req-ips)
- [`req.subdomains`](#req-subdomains)

#### `subdomainOffset`

Subdomain offset for `req.subdomains`. Defaults to `2`.

#### `bindAppToReqRes`

Bind the app as a reference to the actual app to `req.app` and `res.app`. Disabled by default.

#### `enableReqRoute`

Enables `req.route` property. Disabled by default.

## Properties

### `app.locals`

The `app.locals` object has properties that are local variables within the application.

```ts
console.dir(app.locals.title)
// => 'My App'

console.dir(app.locals.email)
// => 'me@myapp.com'
```

Once set, the value of app.locals properties persist throughout the life of the application, in contrast with res.locals properties that are valid only for the lifetime of the request.

You can access local variables in templates rendered within the application. This is useful for providing helper functions to templates, as well as application-level data.

```ts
app.locals.title = 'My App'
app.locals.strftime = require('strftime')
app.locals.email = 'me@myapp.com'
```

### `app.parent`

`app.parent` points to a parent `App` object, e.g. the app that was mounted to.

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

## Methods

### `app.METHOD`

Routes an HTTP request, where METHOD is the HTTP method of the request, such as GET, PUT, POST, and so on, in lowercase. Thus, the actual methods are app.get(), app.post(), app.put(), and so on.

### `app.all`

This method is like the standard [`app.METHOD()`](#app-method) methods, except it matches all HTTP verbs.

The following callback is executed for requests to `/secret` whether using GET, POST, PUT, DELETE, or any other HTTP request method:

```ts
app.all('/secret', (req, res, next) => {
  console.log('Accessing the secret section ...')
  next() // pass control to the next handler
})
```

The `app.all()` method is useful for mapping “global” logic for specific path prefixes or arbitrary matches. For example, if you put the following at the top of all other route definitions, it requires that all routes from that point on require authentication, and automatically load a user. Keep in mind that these callbacks do not have to act as end-points: loadUser can perform a task, then call `next()` to continue matching subsequent routes.

```ts
app.all('*', requireAuthentication, loadUser)
```

### `app.get`

Routes HTTP GET requests to the specified path with the specified handler functions.

```ts
app.get('/', (req, res) => {
  res.send(`${req.method || 'GET'} request to homepage`)
})
```

### `app.post`

Routes HTTP POST requests to the specified path with the specified handler functions.

```ts
app.post('/', (req, res) => {
  res.send(`${req.method || 'POST'} request to homepage`)
})
```

### `app.put`

Routes HTTP PUT requests to the specified path with the specified handler functions.

```ts
app.put('/', (req, res) => {
  res.send(`${req.method || 'PUT'} request to homepage`)
})
```

### `app.delete`

Routes HTTP DELETE requests to the specified path with the specified handler functions.

```ts
app.delete('/', (req, res) => {
  res.send(`${req.method || 'DELETE'} request to homepage`)
})
```

### `app.use`

Mounts the specified middleware function or functions at the specified path: the middleware function is executed when the base of the requested path matches path.

A route will match any path that follows its path immediately with a `/`. For example: `app.use('/apple', ...)` will match `/apple`, `/apple/images`, `/apple/images/news`, and so on.

Since path defaults to `/,` middleware mounted without a path will be executed for every request to the app.
For example, this middleware function will be executed for every request to the app:

```ts
app.use((req, res, next) => {
  console.log('Time: %d', Date.now())
  next()
})
```

Middleware functions are executed sequentially, therefore the order of middleware inclusion is important.

```ts
// this middleware will not allow the request to go beyond it
app.use((req, res, next) => void res.send('Hello World'))

// requests will never reach this route
app.get('/', (req, res) => void res.send('Welcome'))
```

### `app.engine`

Register a template engine. Works with any Express template engines that contain a `renderFile` function.

```js
import { App } from '@tinyhttp/app'
import { renderFile } from 'eta'

const app = new App()

app.engine('eta', renderFile) // map app.engines['eta'] to `renderFile`
```

### `app.render`

> [Eta v2](https://eta.js.org/docs/2.x.x/examples/express) works best with tinyhttp. With [Eta v3](https://eta.js.org/docs/api#setting-up-eta) there's no need to register the engine, you should render templates using an `Eta` instance.

Render a file with the engine that was set previously via [`app.engine`](#app-engine). To render and respond with the result, use [`res.render`](#res-render)

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

tinyhttp doesn't support `app.render` overloading yet. Because of that, some engines (Pug, for example) may require additional wrapping.

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

Returns the mountpath of the app.

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

Returns an instance of a single route, which you can then use to handle HTTP verbs with optional middleware. Use `app.route()` to avoid duplicate route names.

```js
new App()
  .route('/events')
  .all((req, res, next) => {
    // runs for all HTTP verbs first
    // think of it as route specific middleware!
  })
  .get((req, res, next) => res.json({ hello: 'world' }))
  .post((req, res, next) => {
    // maybe add a new event...
  })
```

### `app.enable`

Sets the `Boolean` setting name to `true`, where name is one of the properties from the app settings.

```js
app.enable('networkExtensions')
```

### `app.disable`

Sets the `Boolean` setting name to `false`, where name is one of the properties from the app settings.

```js
app.disable('networkExtensions')
```

### `app.set`

Sets the setting name to value, where is one of the properties from the app settings.

```js
app.set('subdomainOffset', 2)
```

### `app.handler`

Extends `req` / `res` objects, pushes 404 and 500 handlers, dispatches middleware and matches paths.

In some cases where you don't need to start a server but pass the `req` / `res` handler instead.

For example you want to start an HTTP/2 server instead of HTTP one:

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

It's also common to pass the handler in serverless functions (e.g. Vercel), like this:

```js
const { App } = require('@tinyhttp/app')

app.use((req, res) => void res.send(`You're on ${req.url}`))

module.exports = async (req, res) => await app.handler(req, res)
```

### `app.listen`

Starts an HTTP server and listens on a specified port and host.

```js
import { App } from '@tinyhttp/app'

const app = new App()

app
  .use((_, res) => void res.send('Hello World'))
  .listen(3000, () => console.log(`Started on :3000`))
```
