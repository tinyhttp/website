import { App, renderTemplate } from '@tinyhttp/app'
import serve from 'sirv'
import { enableCaching, send, sendFile, sendStatus } from '@tinyhttp/send'
import { getQueryParams, getURLParams } from '@tinyhttp/url'
import * as eta from 'eta'
import { EtaConfig } from 'eta/dist/types/config'
import { marked } from 'marked'
import shiki from 'shiki'
import { lruSend } from 'lru-send'
import { fetchBuilder, FileSystemCache } from 'node-fetch-cache'

const fetch = fetchBuilder.withCache(
  new FileSystemCache({
    cacheDirectory: './.cache',
    ttl: 1000 * 60 * 60
  })
)

const mwList = [
  '@tinyhttp/cors',
  '@tinyhttp/favicon',
  '@tinyhttp/ip-filter',
  '@tinyhttp/jsonp',
  '@tinyhttp/logger',
  '@tinyhttp/markdown',
  '@tinyhttp/ping',
  '@tinyhttp/rate-limit',
  '@tinyhttp/unless',
  '@tinyhttp/cookie-parser',
  '@tinyhttp/jwt',
  '@tinyhttp/bot-detector',
  '@tinyhttp/swagger',
  'lru-send',
  'malibu',
  'tinyws'
]

const app = new App<EtaConfig>({
  noMatchHandler: (_, res) => {
    res.format({
      text: (_, res) => res.sendStatus(404),
      html: (_, res) => res.sendFile(`${process.cwd()}/static/404.html`)
    })
  },
  applyExtensions: (req, res, next) => {
    req.query = getQueryParams(req.url)

    res.send = send(req, res)
    res.sendFile = sendFile(req, res)
    res.sendStatus = sendStatus(req, res)
    res.render = renderTemplate(req, res, app)

    next()
  }
})

const PORT = parseInt(process.env.PORT, 10) || 3000

const isDev = process.env.NODE_ENV !== 'production'

const title = (url: string) => {
  if (url.startsWith('/docs'))
    return {
      title: 'Docs 📖 | tinyhttp — 0-legacy, tiny & fast web framework as a replacement of Express'
    }
  else if (url.startsWith('/learn'))
    return {
      title: 'Learn 📚 | tinyhttp — 0-legacy, tiny & fast web framework as a replacement of Express'
    }
}

async function startApp() {
  const theme = await shiki.loadTheme(`${process.cwd()}/static/theme.json`)

  const hl = await shiki.getHighlighter({ theme })

  app
    .use(lruSend())
    .engine('eta', eta.renderFile)
    .use(
      serve('static', {
        dev: isDev,
        immutable: !isDev,
        maxAge: 31536000
      })
    )
    .get('/mw', async (req, res, next) => {
      try {
        let pkgs = mwList

        if (req.query.q) {
          pkgs = mwList.filter((el: any) => {
            const query = req.query.q as string

            return el.indexOf(query.toLowerCase()) > -1
          })
        }

        res.render(
          'pages/search.eta',
          {
            title: 'Middleware',
            pkgTemplates: pkgs
              .map(
                (mw) => `
<a class="mw_preview" href="/mw/${mw}">
  <div>
    <h3>${mw.replace('@tinyhttp/', '')}</h3>
  </div>
</a>
`,
                pkgs
              )
              .join('<br />'),
            head: `<link rel="stylesheet" href="/css/search.css" />`
          },
          { renderOptions: { autoEscape: false, cache: !isDev }, cache: !isDev }
        )
      } catch (e) {
        next(e)
      }
    })
    .get('/mw/*', async (req, res, next) => {
      let json: any, status: number

      enableCaching(res, { maxAge: 31536000, immutable: !isDev })

      try {
        const res = await fetch(`https://registry.npmjs.org/${req.params.wild}`)

        status = res.status
        json = await res.json()
      } catch (e) {
        next(e)
      }

      if (status === 404) res.sendStatus(status)
      else {
        const name = json.name
        const version = json['dist-tags'].latest

        const pkgBody = json.versions[version]

        const readme = marked(json.readme || '', {
          highlight(code, lang) {
            if (!lang) lang = 'txt'

            return hl.codeToHtml(code, lang)
          }
        })

        const repo = pkgBody.repository

        const dir = repo.directory

        const link = repo.url.replace(repo.type + '+', '').replace('.git', '')

        res.render(
          `pages/mw.eta`,
          {
            link,
            dir,
            readme,
            pkg: name,
            version,
            title: `${name} | tinyhttp`,
            head: `<link rel="stylesheet" href="/css/mw.css" />`
          },
          { renderOptions: { autoEscape: false } }
        )
      }
    })
    .use(async (req, res, next) => {
      if (req.url === '/docs' || req.url === '/learn') {
        const result = await eta.renderFileAsync(`/${req.url}.eta`, title(req.url), {
          views: 'views/pages',
          cache: !isDev
        })

        if (result) {
          enableCaching(res, { maxAge: 3600 * 24 * 365, immutable: !isDev })
          res.send(
            marked(result, {
              highlight(code, lang) {
                if (!lang) lang = 'txt'

                return hl.codeToHtml(code, lang)
              }
            })
          )
        } else next()
      } else next()
    })

    .listen(3000, () =>
      console.log(`Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`)
    )
}

startApp()
