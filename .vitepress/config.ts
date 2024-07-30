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
        content: 'https://tinyhttp.v1rtl.site/cover.jpg',
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
      {
        link: 'https://tinyhttp.zulipchat.com', icon: {
          svg: '<?xml version="1.0" encoding="utf-8"?><svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><title>Zulip icon</title><path d="M24 12a12 12 0 1 1-24 0 12 12 0 0 1 24 0zm-8.03-6H7.02l1 2.03h6.06l-7.06 7.5 1 2.46h8.96l-1-2.02H9.91l7.06-7.5-1-2.46z"/></svg>'
        }
      }
    ],
    search: {
      provider: 'local',
    },
  },
  vite: {
    server: {
      fs: {
        allow: ['../..'],
      },
    },
  },
})
