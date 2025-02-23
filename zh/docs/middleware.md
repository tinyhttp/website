---
head:
  - - meta
    - property: og:title
      content: Middleware
  - - meta
    - name: description
      content: A list of modern modules and middleware for building backend apps.
  - - meta
    - property: og:description
      content: A list of modern modules and middleware for building backend apps.
---

# 中间件

作为规则，当您开发 Web 应用程序时，单靠 Web 框架是不够的。以下是用于构建后端应用程序的现代模块和中间件列表。

## 静态服务器

- [sirv](https://github.com/lukeed/sirv) - 用于服务静态文件的优化中间件和 CLI 应用程序

## 模板引擎

- [Eta](https://eta.js.org/) - 用于 Node、Deno 和浏览器的嵌入式 JS 模板引擎。轻量级、快速且可插拔。用 TypeScript 编写
- [Edge.js](https://github.com/edge-js/edge) - 带来新鲜空气的 Node.js 模板引擎
- [micromustache](https://github.com/userpixel/micromustache) - JavaScript 的 {{mustache}} 模板引擎的极快且小型的子实现
- [Squirelly](https://github.com/squirrellyjs/squirrelly) - 半嵌入式 JS 模板引擎，支持助手、过滤器、部分和模板继承。4KB 压缩，使用 TypeScript 编写
- [sprightly](https://github.com/obadakhalili/sprightly) - 非常轻量级的 JS 模板引擎

## 日志记录

- [@tinyhttp/logger](https://github.com/tinyhttp/logger) - tinyhttp 的简单 HTTP 日志记录器
- [Pino HTTP](https://github.com/pinojs/pino-http) - Node.js 的高速 HTTP 日志记录器
- [chrona](https://github.com/xambassador/chrona) - 受 koa-logger 启发的 express.js 的简单 HTTP 请求日志记录中间件，使用 TypeScript 编写。

## 会话

- [micro-session](https://github.com/meyer9/micro-session) - micro 的会话中间件
- [next-session](https://github.com/hoangvvo/next-session) - 用于 Next.js、micro、Express 等的简单基于 Promise 的会话中间件
- [iron-session](https://github.com/vvo/iron-session) - 使用签名和加密的 cookie 存储数据的 Next.js 无状态会话工具。也适用于 Express 和 Node.js HTTP 服务器。

## CSRF

- [malibu](https://github.com/tinyhttp/malibu) - 现代 Node.js 的框架无关 CSRF 中间件。

## 请求体解析器

- [milliparsec](https://github.com/tinyhttp/milliparsec) - 宇宙中最小的请求体解析器。为现代 Node.js 构建。

## Cookies

- [cookie-parser](https://github.com/tinyhttp/cookie-parser) - Node.js 的 Cookie 解析中间件。

## 指标

- [ping](https://github.com/tinyhttp/ping) - 响应时间检查中间件。

## CORS

- [cors](https://github.com/tinyhttp/cors) - 现代 Node.js 的 CORS 中间件。

## Swagger

- [swagger](https://github.com/tinyhttp/swagger) - tinyhttp 的 Swagger 集成。

## 其他

- [unless](https://github.com/tinyhttp/unless) - tinyhttp 的 unless 中间件。
