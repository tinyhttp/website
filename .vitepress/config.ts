import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'

const title = 'tinyhttp'
const description =
  'modern Express-like web framework written in TypeScript and compiled to native ESM with minimal dependencies.'

export default defineConfig({
  lang: 'en-US',

  title: title,
  titleTemplate: `:title · ${title}`,
  description,

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    [
      'meta',
      {
        property: 'og:title',
        content: `${title} · 0-legacy, tiny & fast web framework as a replacement of Express`,
      },
    ],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://tinyhttp.v1rtl.site/cover.png',
      },
    ],
    ['meta', { property: 'og:url', content: 'https://tinyhttp.v1rtl.site' }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'theme-color', content: '#1E1E20' }],
  ],

  themeConfig: {
    editLink: {
      pattern: 'https://github.com/tinyhttp/website/edit/master/:path',
      text: 'Edit this page on GitHub',
    },

    externalLinkIcon: true,

    footer: {
      message:
        'Released under the MIT License. Forked from <a href="https://github.com/wagmi-dev/viem/tree/main/site">viem docs</a>',
    },

    logo: { src: '/logo.svg', alt: 'tinyhttp' },

    nav: [
      { text: 'Docs', link: '/docs/getting-started', activeMatch: '/docs' },
      {
        text: 'Examples',
        link: 'https://github.com/tinyhttp/tinyhttp/tree/master/examples',
      },
      {
        text: 'Contributing',
        link: 'https://github.com/tinyhttp/tinyhttp/blob/master/CONTRIBUTING.md',
      },
    ],

    outline: [2, 3],

    sidebar,

    siteTitle: false,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tinyhttp/tinyhttp' },
    ],
  },

  vite: {
    server: {
      fs: {
        allow: ['../..'],
      },
    },
  },
})

function toPatchVersionRange(version: string) {
  const [major, minor] = version.split('.').slice(0, 2)
  return `${major}.${minor}.x`
}
