import { App } from '@tinyhttp/app'
import serve from 'sirv'
import { enableCaching } from '@tinyhttp/send'
import { logger } from '@tinyhttp/logger'
import fetchCache from 'node-fetch-cache'
import * as eta from 'eta'
import { EtaConfig } from 'eta/dist/types/config'
import marked from 'marked'
import shiki from 'shiki'
import { existsSync } from 'fs'

const fetch = fetchCache(`${process.cwd()}/.cache`)

const app = new App<EtaConfig>({
  settings: {
    networkExtensions: true
  },
  noMatchHandler: (_, res) => {
    res.format({
      text: (_, res) => res.sendStatus(404),
      html: (_, res) => res.sendFile(`${process.cwd()}/static/404.html`)
    })
  }
})

const PORT = parseInt(process.env.PORT, 10) || 3000

const NON_MW_PKGS: string[] = [
  'app',
  'etag',
  'cookie',
  'cookie-signature',
  'dotenv',
  'send',
  'router',
  'req',
  'res',
  'type-is',
  'content-disposition',
  'forwarded',
  'proxy-addr',
  'accepts',
  'cli'
]

const theme = await shiki.loadTheme(`${process.cwd()}/theme.json`)

const hl = await shiki.getHighlighter({ theme })

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
  else return { title: 'tinyhttp — 0-legacy, tiny & fast web framework as a replacement of Express' }
}

app
  .engine('eta', eta.renderFile)
  .use(
    logger({
      ip: true,
      timestamp: true,
      output: {
        callback: console.log,
        color: false
      }
    })
  )
  .use(
    serve('static', {
      dev: isDev,
      immutable: !isDev
    })
  )
  .get('/mw', async (req, res, next) => {
    try {
      const request = await fetch('https://api.github.com/repos/talentlessguy/tinyhttp/contents/packages')

      const json = await request.json()

      let pkgs = json.filter((e) => !NON_MW_PKGS.includes(e.name))

      if (req.query.q) {
        pkgs = json.filter((el: any) => {
          const query = req.query.q as string

          return el.name.indexOf(query.toLowerCase()) > -1
        })
      }

      res.render(
        'pages/search.eta',
        {
          title: 'Middleware',
          pkgTemplates: pkgs
            .map(
              (mw) => `
<a class="mw_preview" href="/mw/${mw.name}">
  <div>
    <h3>${mw.name}</h3>
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
  .get('/mw/:mw', async (req, res, next) => {
    if (NON_MW_PKGS.includes(req.params.mw)) next()
    else {
      let json: any, status: number

      try {
        const res = await fetch(`https://registry.npmjs.org/@tinyhttp/${req.params.mw}`)

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
    }
  })
  .use(async (req, res, next) => {
    if (existsSync(`${process.cwd()}/views/pages/${req.url}.eta`)) {
      const result = await eta.renderFileAsync(`/pages/${req.url}.eta`, title(req.url), {
        views: 'views',
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
