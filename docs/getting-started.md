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

# Getting Started

## Introduction

_**tinyhttp**_ is a modern Express-like web framework for Node.js written in TypeScript. It uses a bare minimum amount of dependencies in order to stay minimal and reduce the supply chain. Additionally, tinyhttp also offers native ESM (`import` / `export`) support, async middleware handlers support, and proper types out of the box.

## Differences with Express

Although tinyhttp tries to be as close to Express as possible, there are some key differences between these two frameworks:

- **tinyhttp doesn't have the same settings**. All `App` settings are initialized in the constructor. You can see a list of them [here](/docs/api/application#settings).
- **tinyhttp doesn't put the `err` object in middleware if the previous one passed an error**. Instead, it uses a [generic error handler](/docs/api/application#onerror-err-req-res).
- **tinyhttp doesn't include a static server and a body parser**. To keep the framework small, you should use external middlewares, such as [`milliparsec`](https://github.com/tinyhttp/milliparsec) and [`sirv`](https://github.com/lukeed/sirv).

Note that maximum compatibility is in progress so some of the points might change.

## Install

tinyhttp supports Node.js 14.21.3 or newer or [Bun](https://bun.sh).

You can quickly setup a working app with [tinyhttp CLI](https://github.com/tinyhttp/cli):

::: code-group

```bash [node]
# Install tinyhttp CLI
pnpm i -g @tinyhttp/cli

# Create a new project
tinyhttp new basic my-app

# Go to project directory
cd my-app

# Run your app
node app.js
```

```bash [bun]
# Install tinyhttp CLI
bun i -g @tinyhttp/cli

# Create a new project
tinyhttp new basic my-app

# Go to project directory
cd my-app

# Run your app
bun app.js
```

:::

## Hello World

Here is a very basic example of a tinyhttp app:

```js
import { App } from '@tinyhttp/app'

const app = new App()

app.use((req, res) => void res.send('Hello world!'))

app.listen(3000, () => console.log('Started on http://localhost:3000'))
```

For more examples check [examples folder](https://github.com/tinyhttp/tinyhttp/blob/master/examples) in tinyhttp repo.
