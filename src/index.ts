import got from 'got'
import { parse } from 'node-html-parser'
import type { HTMLElement } from 'node-html-parser'
import type { Plugin } from 'vite'

export interface FontOptimizationOptions {
  providers?: string[]
  apply?: Plugin['apply']
}

const GOOGLE_FONT_PROVIDER = 'https://fonts.googleapis.com/css'
const TYPEKIT_FONT_PROVIDER = 'https://use.typekit.net/'

async function getFont(link: HTMLElement, providers: string[]): Promise<void> {
  const rel = link.getAttribute('rel')
  const href = link.getAttribute('href')

  if (rel !== 'stylesheet' || !href || !providers.some(provider => href!.startsWith(provider))) {
    return
  }

  const style = await got(href!).text()
  link.replaceWith(`<style data-href="${href}">${style}</style>`)
}

export default function fontOptimizationPlugin(options?: FontOptimizationOptions): Plugin {
  const providers = [GOOGLE_FONT_PROVIDER, TYPEKIT_FONT_PROVIDER, ...(options?.providers || [])]

  return {
    name: 'font-optimization-plugin',

    // see https://vitejs.dev/guide/api-plugin.html#conditional-application
    apply: options?.apply,

    async transformIndexHtml(html: string) {
      const root = parse(html)
      const links = root.querySelectorAll('link')
      const promises = links.map(link => getFont(link, providers))

      // Download multiple fonts in parallel
      await Promise.all(promises)

      return root.toString()
    }
  }
}
