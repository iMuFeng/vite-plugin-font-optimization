import got from 'got'
import { parse } from 'node-html-parser'
import type { Plugin } from 'vite'

export interface FontOptimizationOptions {
  providers?: string[]
}

const GOOGLE_FONT_PROVIDER = 'https://fonts.googleapis.com/css'
const TYPEKIT_FONT_PROVIDER = 'https://use.typekit.net/'

export default function fontOptimizationPlugin(options?: FontOptimizationOptions): Plugin {
  const providers = [GOOGLE_FONT_PROVIDER, TYPEKIT_FONT_PROVIDER, ...(options?.providers || [])]

  return {
    name: 'font-optimization-plugin',

    async transformIndexHtml(html: string) {
      const root = parse(html)
      const links = root.querySelectorAll('link')

      for (const link of links) {
        const rel = link.getAttribute('rel')
        const href = link.getAttribute('href')

        if (
          rel !== 'stylesheet' ||
          !href ||
          !providers.some(provider => href?.startsWith(provider))
        ) {
          continue
        }

        const style = await got(href!).text()
        link.replaceWith(`<style data-href="${href}">${style}</style>`)
      }

      return root.toString()
    }
  }
}
