---
aside: false
editLink: false
title: tinyhttp
titleTemplate: :title · 0-legacy, tiny & fast web framework as a replacement of Express
description: modern Express-like web framework written in TypeScript and compiled to native ESM with minimal dependencies.
layout: home
---

<script setup lang="ts">
import { VPButton } from 'vitepress/theme'
</script>

<div class="max-w-[1120px] mx-auto vp-doc relative px-[24px] mb-[96px] mt-[32px] md:px-0 md:mb-[64px]">

<div class="pt-[48px] max-sm:pt-0">
  <div class="px-7 max-sm:px-0 flex justify-between z-0 max-md:justify-center">
    <div class="space-y-8 max-w-[400px] flex flex-col items-start max-md:items-center">
      <img class="h-[128px] logo max-sm:h-[60px]" src="/logo.svg" alt="tinyhttp logo">
      <div class="font-medium text-[21px] max-sm:text-[18px] text-[#919193] max-md:text-center">tinyhttp is a <span class="text-black dark:text-white">modern</span>, <span class="text-black dark:text-white">lightweight</span> and <span class="text-black dark:text-white">modular</span> Express-like web framework for Node.js.</div>
      <div class="flex justify-center space-x-2">
        <VPButton tag="a" size="medium" theme="brand" href="/docs/getting-started" text="Get Started" />
        <VPButton tag="a" size="medium" theme="alt" href="https://github.com/tinyhttp/tinyhttp" text="View on GitHub" />
      </div>
    </div>
    <div class="flex flex-col justify-between w-[440px] space-y-10 max-lg:w-[300px] max-md:hidden">
      <div class="h-full">

::: code-group

```bash [npm]
npm i @tinyhttp/app
```

```bash [pnpm]
pnpm i @tinyhttp/app
```

```bash [bun]
bun i @tinyhttp/app
```

:::

  </div>
  <div class="flex justify-between space-x-2">
  <a href="https://github.com/tinyhttp/tinyhttp/stargazers" class="cursor-pointer h-10 max-w-[120px] flex-1 relative rounded-lg overflow-hidden border border-black/10 dark:border-white/20" style="color: inherit;" rel="noreferrer noopener" target="_blank">
    <div class="absolute flex z-0 p-[6px] h-full w-full">
      <div class="flex-1 bg-white/60 dark:bg-black/40 flex items-center w-full h-full rounded-md">
        <span class="font-medium text-[15px] opacity-80 w-full text-center">stars</span>
      </div>
      <div class="flex items-center h-full px-2">
        <span class="font-medium text-[15px] text-center w-full text-black dark:text-white">2.8k</span>
      </div>
    </div>
    <div class="absolute left-0 right-0 top-0 bottom-0 bg-black/5 dark:bg-white/10 z-[-1]" />
    <div class="absolute left-0 right-0 top-0 bottom-0 backdrop-blur-[2px] backdrop-filter z-[-1]" />
  </a>
  <a href="https://coveralls.io/github/tinyhttp/tinyhttp" class="cursor-pointer h-10 max-w-[160px] flex-1 relative rounded-lg overflow-hidden border border-green-400/50" style="color: inherit;" rel="noreferrer noopener" target="_blank">
    <div class="absolute flex z-0 p-[6px] h-full w-full">
      <div class="flex-1 bg-white/60 dark:bg-black/40 flex items-center w-full h-full rounded-md">
        <span class="font-medium text-[15px] opacity-80 w-full text-center">coverage</span>
      </div>
      <div class="flex items-center h-full px-2">
        <span class="font-medium text-[15px] text-center w-full text-green-600">98%</span>
      </div>
    </div>
    <div class="absolute left-0 right-0 top-0 bottom-0 bg-green-600 opacity-10 z-[-1]" />
    <div class="absolute left-0 right-0 top-0 bottom-0 backdrop-blur-[2px] backdrop-filter z-[-1]" />
  </a>
  <a href="https://github.com/tinyhttp/tinyhttp/blob/master/LICENSE" class="cursor-pointer h-10 max-w-[130px] flex-1 relative rounded-lg overflow-hidden border border-black/10 dark:border-white/20 max-lg:hidden" style="color: inherit;" rel="noreferrer noopener" target="_blank">
    <div class="absolute flex z-0 p-[6px] h-full w-full">
      <div class="flex-1 bg-white/60 dark:bg-black/40 flex items-center w-full h-full rounded-md">
        <span class="font-medium text-[15px] opacity-80 w-full text-center">license</span>
      </div>
      <div class="flex items-center h-full px-2">
        <span class="font-medium text-[15px] text-center w-full text-black dark:text-white">MIT</span>
      </div>
    </div>
    <div class="absolute left-0 right-0 top-0 bottom-0 bg-black/5 dark:bg-white/10 z-[-1]" />
    <div class="absolute left-0 right-0 top-0 bottom-0 backdrop-blur-[2px] backdrop-filter z-[-1]" />
  </a>
  </div>
  </div>
  </div>
  <div class="flex justify-between flex-wrap mt-16 max-sm:hidden">
    <div class="pr-2 w-1/4 max-lg:pb-3 max-sm:px-0 max-lg:w-1/2 max-sm:w-full ">
      <div class="relative w-full h-[168px] max-lg:h-[142px] overflow-hidden">
        <div class="border-black dark:border-white border border-solid border-opacity-10 dark:border-opacity-10 rounded-lg h-full px-5 py-6 absolute z-10 flex flex-col justify-between w-full bg-[rgba(245,160,230,0.1)] dark:bg-[rgba(49,49,54,0.25)]">
          <div class="text-xl font-medium text-black dark:text-white">Express compatibility</div>
          <div class="text-[17px] font-medium text-[#919193]">Works with most of the Express middleware out of the box.</div>
        </div>
      </div>
    </div>
    <div class="pl-2 pr-2 max-sm:px-0 max-lg:pb-3 max-lg:pr-0 w-1/4 max-lg:w-1/2 max-sm:w-full ">
      <div class="relative w-full h-[168px] max-lg:h-[142px]">
        <div class="border-black dark:border-white border border-solid border-opacity-10 dark:border-opacity-10 rounded-lg h-full px-5 py-6 absolute z-10 flex flex-col w-full bg-[rgba(245,160,230,0.1)] dark:bg-[rgba(49,49,54,0.25)]">
          <div class="text-xl font-medium text-black dark:text-white">Async support</div>
          <div class="mt-[14px] text-[17px] font-medium text-[#919193]">async / await no longer crashes or hangs your app.</div>
        </div>
      </div>
    </div>
    <div class="pl-2 pr-2 max-sm:px-0 max-lg:pb-3 max-lg:pr-0 w-1/4 max-lg:w-1/2 max-sm:w-full">
      <div class="relative w-full h-[168px] max-lg:h-[142px]">
        <div class="border-black dark:border-white border border-solid border-opacity-10 dark:border-opacity-10 rounded-lg h-full px-5 py-6 absolute z-10 flex flex-col w-full bg-[rgba(245,160,230,0.1)] dark:bg-[rgba(49,49,54,0.25)]">
          <div class="text-xl font-medium text-black dark:text-white">Fast</div>
          <div class="mt-[14px] text-[17px] font-medium text-[#919193]">58% faster than Express</div>
          <a href="https://web-frameworks-benchmark.netlify.app/compare?f=tinyhttp,express" rel="noreferrer noopener" target="_blank" class="text-[17px] font-medium">See more</a>
        </div>
      </div>
    </div>
    <div class="pl-2 w-1/4 max-sm:px-0 max-lg:w-1/2 max-sm:w-full">
      <div class="relative w-full h-[168px] max-lg:h-[142px]">
        <div class="border-black dark:border-white border border-solid border-opacity-10 dark:border-opacity-10 rounded-lg h-full px-5 py-6 absolute z-10 flex flex-col justify-between w-full bg-[rgba(245,160,230,0.1)] dark:bg-[rgba(49,49,54,0.25)]">
          <div class="text-xl font-medium text-black dark:text-white">Prebuilt middleware</div>
          <div class="text-[17px] font-medium text-[#919193]">Re-written with latest ECMAScript and types out of the box.</div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="h-16" />

<div class="max-w-2xl mx-auto">

```ts
import { App } from '@tinyhttp/app'
import { logger } from '@tinyhttp/logger'

const app = new App()

app
  .use(logger())
  .get('/', (_, res) => void res.send('<h1>Hello World</h1>'))
  .get('/page/:page/', (req, res) => {
    res.status(200).send(req.params)
  })
  .listen(3000)
```

## Features

- **ESM-only**. Embraces the standard modules.
- **No polyfills**. [75% smaller](https://arve0.github.io/npm-download-size/#@tinyhttp%2fapp) install size, faster CI builds.
- **Strongly typed**. Works well with TypeScript.

## Support

Help support future development and make tinyhttp a sustainable open-source project:

- [GitHub Sponsors](https://github.com/sponsors/tinyhttp?metadata_campaign=docs_support)
- [Donate personally or become a contributor](https://github.com/tinyhttp/#help-the-project)

## Used by

- [json-server](https://github.com/typicode/json-server)
- [@vercel/toolbar](https://www.npmjs.com/package/@vercel/toolbar)
- [catai](https://github.com/withcatai/catai)
- [hyperschedule](https://github.com/hyperschedule/hyperschedule)
- [add your own](https://github.com/tinyhttp/tinyhttp/discussions/418)

</div>

<style scoped>
  html:not(.dark) img.dark {
    display: none;
  }
  .dark img.light {
    display: none;
  }

  .card {
    background-color: var(--vp-c-bg-soft);
  }

  .language-bash {
    overflow-y: hidden;
  }

  .vp-code-group, .vp-code-group .language-bash {
    height: 100%;
  }

  .vp-code-group .language-bash {
    height: 100%;
    margin-bottom: 0px;
  }

  .vp-code-group {
    margin-top: 0px;
  }

  .vp-code-group .blocks {
    height: calc(100% - 37px);
  }

  .vp-code-group .tabs label {
    font-size: 16px;
  }

  .vp-code-group .tabs {
    justify-content: left;
  }

  .vp-code-group .shiki {
    padding-top: 16px;
  }

  .vp-code-group code {
    font-size: 22px;
  }

  .tabs {
    display: flex;
    justify-content: center;
  }
</style>

</div>
