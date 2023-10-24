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

app.use((req, res) => res.send('Hello World'))

app.listen(3000)
```

App options can be set inside a constructor.

```js
const app = new App({
  noMatchHandler: (req, res) => res.send('Oopsie, page cannot be found'),
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
  .use((_req, res) => res.send('Hello World'))
```
