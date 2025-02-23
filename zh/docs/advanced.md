# 高级

## 数据库集成

与其他任何网络框架一样，tinyhttp 对数据库进行了适配。这里有很多关于数据库集成的[示例](https://github.com/tinyhttp/tinyhttp/tree/master/examples)，包括 MongoDB、Fauna、Postgres 等。

### 示例

您首先需要为您的数据库初始化一个客户端。然后，您可以在中间件中使用它来执行查询。

这是一个与 MongoDB 交互的简单[示例](https://github.com/tinyhttp/tinyhttp/tree/master/examples/mongodb)：

```js
import { App } from '@tinyhttp/app'
import * as dotenv from '@tinyhttp/dotenv'
import { urlencoded as parser } from 'milliparsec'
import mongodb from 'mongodb'
import assert from 'assert'

dotenv.config()

const app = new App()

let db
let coll

// 创建 mongo 客户端
const client = new mongodb.MongoClient(process.env.DB_URI, {
  useUnifiedTopology: true,
})

// 连接到 mongodb
client.connect(async (err) => {
  assert.notStrictEqual(null, err)
  console.log('successfully connected to MongoDB')
  db = client.db('notes')
  coll = db.collection('notes')
})

app
  .get('/notes', async (_, res, next) => {
    const r = await coll.find({}).toArray()
    res.send(r)
    next()
  })
  .use('/notes', parser())
  .post('/notes', async (req, res, next) => {
    const { title, desc } = req.body
    const r = await coll.insertOne({ title, desc })
    assert.strictEqual(1, r.insertedCount)
    res.send(`Note with title of "${title}" has been added`)
  })
  .listen(3000)
```

## 部署

有很多方法可以部署 tinyhttp。您可以使用 Severless 平台、VPS 或任何其他具有 Node.js 运行时的东西。我们将查看最常见的方法并进行详细分析。

### Severless

至于 Severless，您可以选择任何 Severless 平台。以下是一些流行平台的表格：

| **平台**                              | **是否免费**    |
| ------------------------------------- | -------------- |
| [Heroku](https://heroku.com)          | 否             |
| [Vercel (Lambda)](https://vercel.com) | 是             |
| [AWS](https://aws.amazon.com)         | 是（仅限一年）  |
| [Render](https://render.com)          | 是             |
| [Deta](https://deta.space)            | 是             |

您可以查看 tinyhttp 仓库中的 [Vercel](https://github.com/tinyhttp/tinyhttp/tree/master/examples/vercel) 和 [AWS](https://github.com/tinyhttp/tinyhttp/tree/master/examples/aws) 示例。

如果您知道其他适合部署 tinyhttp 的 Serverless 平台，请随时在文档中提交 PR。

### 自托管

有一份自托管 Serverless 部署工具的列表，您可以在您的 VPS 上安装并使用，使其类似于“真实”的 Serverless。

| **工具**                                           |
| -------------------------------------------------- |
| [Exoframe](https://github.com/exoframejs/exoframe) |

### 自定义

如果您更喜欢进行定制部署，可以尝试使用 CI/CD 服务、进程管理器和 Web 服务器（或仅其中之一）的组合。

#### CI/CD

| CI/CD                                                 | 是否免费 |
| ----------------------------------------------------- | ------- |
| [Github Actions](https://github.com/features/actions) | 是      |
| [Travis](https://travis-ci.org)                       | 是      |

任何 CI 都适用于 tinyhttp，因为它没有设置任何限制。

#### 进程管理 / 单元系统

| 进程管理 / 单元系统                              | 是否跨平台      | 是否内置负载均衡器       |
| ----------------------------------------------- | -------------- | ---------------------- |
| [PM2](https://pm2.io)                           | 是             | 是                     |
| [systemd](https://systemd.io)                   | 否             | 否                     |
| [z1](https://github.com/robojones/z1)           | 是             | 是                     |
| [Forever](https://github.com/foreversd/forever) | 是             | 是                     |

通常，目标服务器运行在Linux上。所有主要的发行版都有 [systemd](https://systemd.io)。您可以使用它为您的 tinyhttp 应用创建一个服务。

Node.js 中最流行的进程管理器是 [PM2](https://pm2.io/)。它内置了集群功能，因此很容易使您的应用程序支持多进程。然而，使用 pm2 并不是实现集群的必要条件。您可以使用内置的 [`cluster`](https://nodejs.org/api/cluster.html) 模块做到这一点。有关更多信息，请查看集群 [示例](https://github.com/tinyhttp/tinyhttp/tree/master/examples/cluster)。

#### Web 服务器

通常使用 Web 服务器作为从 3000（或任何其他）端口到 80 HTTP 端口的反向代理。Web 服务器还可以用于负载均衡。

| Web 服务器                       | 是否内置负载均衡器 | 文档                                                                                                                                      |
| -------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [nginx](https://nginx.com)       | 是                    | [使用 nginx 对 Node.js 应用服务器进行负载均衡](https://docs.nginx.com/nginx/deployment-guides/load-balance-third-party/node-js/) |
| [Caddy](https://caddyserver.com) | 是                    | [Caddy 反向代理](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy)                                                    |

**Docker**

Docker 有很多镜像可以在容器中运行 Node.js 应用程序。最受欢迎的镜像之一是 [node](https://hub.docker.com/_/node/)。

有关于使用 Docker 部署 Express / Node.js 应用程序的文章。您可以使用这些教程来部署 tinyhttp。

- [在 Docker 中运行 Express](https://dev.to/tirthaguha/run-express-in-docker-2o44)
- [Docker 化 Node.js 网页应用](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
