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
      ],
    },
  ],
}
