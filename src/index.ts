import got, { Agents } from 'got'
import { HttpProxyAgent, HttpsProxyAgent } from 'hpagent'
import type { HTMLElement } from 'node-html-parser'
import { parse } from 'node-html-parser'
import type { Plugin } from 'vite'

export interface FontOptimizationOptions {
  providers?: string[]
  apply?: Plugin['apply']
  proxy?: string
}

const GOOGLE_FONT_PROVIDER = 'https://fonts.googleapis.com/css'
const TYPEKIT_FONT_PROVIDER = 'https://use.typekit.net/'
const BUNNY_FONT_PROVIDER = 'https://fonts.bunny.net/css'

async function getFont(link: HTMLElement, providers: string[], proxy?: string): Promise<void> {
  const rel = link.getAttribute('rel')
  const href = link.getAttribute('href')

  if (rel !== 'stylesheet' || !href || !providers.some(provider => href!.startsWith(provider))) {
    return
  }

  let agent: Agents | undefined = undefined

  if (proxy?.startsWith('https://')) {
    agent = {
      https: new HttpsProxyAgent({
        proxy
      })
    }
  } else if (proxy?.startsWith('http://')) {
    agent = {
      http: new HttpProxyAgent({
        proxy
      })
    }
  }

  const style = await got(href!, { agent }).text()
  link.replaceWith(`<style data-href="${href}">${style}</style>`)
}

export default function fontOptimizationPlugin(options?: FontOptimizationOptions): Plugin {
  const providers = [
    GOOGLE_FONT_PROVIDER,
    TYPEKIT_FONT_PROVIDER,
    BUNNY_FONT_PROVIDER,
    ...(options?.providers || [])
  ]

  return {
    name: 'font-optimization-plugin',

    // see https://vitejs.dev/guide/api-plugin.html#conditional-application
    apply: options?.apply,

    async transformIndexHtml(html: string) {
      const root = parse(html)
      const links = root.querySelectorAll('link')
      const promises = links.map(link => getFont(link, providers, options?.proxy))

      // Download multiple fonts in parallel
      await Promise.all(promises)

      return root.toString()
    }
  }
}
