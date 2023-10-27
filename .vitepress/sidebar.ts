import { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = {
  '/docs/': [
    {
      text: 'Introduction',
      items: [
        {
          text: 'Getting Started',
          link: '/docs/getting-started',
        },
        {
          text: 'Main Concepts',
          link: '/docs/main-concepts',
        },
        {
          text: 'Middleware',
          link: '/docs/middleware',
        },
        {
          text: 'Advanced',
          link: '/docs/advanced',
        },
      ],
    },
    {
      text: 'API Reference',
      items: [
        {
          text: 'Application',
          link: '/docs/api/application',
        },
        {
          text: 'Request',
          link: '/docs/api/request',
        },
        {
          text: 'Response',
          link: '/docs/api/response',
        },
      ],
    },
  ],
}
