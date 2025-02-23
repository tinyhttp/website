# Advanced

## Database integration

As any other web framework, tinyhttp works well with databases. There is plenty of [examples](https://github.com/tinyhttp/tinyhttp/tree/master/examples) for database integration, including MongoDB, Fauna, Postgres, and others.

### Example

You first need to initialize a client for your database. Then you can use it inside middleware to execute queries.

Here's a simple [example](https://github.com/tinyhttp/tinyhttp/tree/master/examples/mongodb) with MongoDB:

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

// create mongo client
const client = new mongodb.MongoClient(process.env.DB_URI, {
  useUnifiedTopology: true,
})

// connect to mongodb
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

## Deployment

There are a lot of ways to deploy tinyhttp. You can use a serverless platform, a VPS, or anything else that has Node.js runtime. We'll look into the most common ways and break them down.

### Serverless

As for Serverless, you can pick any of the serverless platforms. Here is a table of some popular ones:

| **Platform**                          | **Free**       |
| ------------------------------------- | -------------- |
| [Heroku](https://heroku.com)          | No             |
| [Vercel (Lambda)](https://vercel.com) | Yes            |
| [AWS](https://aws.amazon.com)         | Yes (one year) |
| [Render](https://render.com)          | Yes            |
| [Deta](https://deta.space)            | Yes            |

You can check out the [Vercel](https://github.com/tinyhttp/tinyhttp/tree/master/examples/vercel) and [AWS](https://github.com/tinyhttp/tinyhttp/tree/master/examples/aws) examples in the tinyhttp repo.

If you know any other good serverless platforms to deploy tinyhttp on, feel free to PR on the docs.

### Self-hosted

There is a list of self-hosted serverless deployments tools that you can install on your VPS and use, making it similar to "real" serverless.

| **Tool**                                           |
| -------------------------------------------------- |
| [Exoframe](https://github.com/exoframejs/exoframe) |

### Custom

If you prefer doing customized deployments you can try to use a combination of a CI/CD service, process manager, and a web server (or only of them).

#### CI/CD

| CI/CD                                                 | Free |
| ----------------------------------------------------- | ---- |
| [Github Actions](https://github.com/features/actions) | Yes  |
| [Travis](https://travis-ci.org)                       | Yes  |

Any CI will work for tinyhttp because it doesn't set any limits.

#### Process managers / unit systems

| PM / Unit system                                | Cross-platform | Load balancer built-in |
| ----------------------------------------------- | -------------- | ---------------------- |
| [PM2](https://pm2.io)                           | Yes            | Yes                    |
| [systemd](https://systemd.io)                   | No             | No                     |
| [z1](https://github.com/robojones/z1)           | Yes            | Yes                    |
| [Forever](https://github.com/foreversd/forever) | Yes            | Yes                    |

As a rule, the target server runs on Linux. All of the major distros have [systemd](https://systemd.io). You can use it to create a service for your tinyhttp app.

The most popular process manager for Node.js is [PM2](https://pm2.io/). It has a clustering feature built-in so it's very easy to make your app multi-process. However, using pm2 is not required to have clustering. You can do the same using the built-in [`cluster`](https://nodejs.org/api/cluster.html) module. Check the cluster [example](https://github.com/tinyhttp/tinyhttp/tree/master/examples/cluster) for more info.

#### Web servers

It is common to use a web server as a reverse proxy from the 3000 (or any other) port to an 80 HTTP port. A web server also could be used for load balancing.

| Web server                       | Load balancer built-in | Docs                                                                                                                                      |
| -------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [nginx](https://nginx.com)       | Yes                    | [Load Balancing Node.js Application Servers with NGINX](https://docs.nginx.com/nginx/deployment-guides/load-balance-third-party/node-js/) |
| [Caddy](https://caddyserver.com) | Yes                    | [Caddy Reverse Proxy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy)                                                    |

**Docker**

Docker has a lot of images to run a Node.js app in a container. One of the most popular images is [node](https://hub.docker.com/_/node/).

There are articles on deploying an Express / Node.js app with Docker. You can use these tutorials to deploy tinyhttp.

- [Run Express in Docker](https://dev.to/tirthaguha/run-express-in-docker-2o44)
- [Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
