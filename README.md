# Vite Font Optimization

Vite Font Optimization will automatically inline font CSS to improvement [First Contentful Paint (FCP)](https://web.dev/fcp/) and [Largest Contentful Paint (LCP)](https://vercel.com/blog/core-web-vitals#largest-contentful-paint). For example:

```js
// Before
<link
  href="https://fonts.googleapis.com/css2?family=Inter&display=optional"
  rel="stylesheet"
/>

// After
<style data-href="https://fonts.googleapis.com/css2?family=Inter&display=optional">
  @font-face{font-family:'Inter';font-style:normal...
</style>
```

### Installation


Install the plugin with `npm install vite-plugin-font-optimization` or `yarn add vite-plugin-font-optimization`

## Usage

Add the plugin to `vite.config.ts` or `vite.config.js`.

```js
import fontOptimizationPlugin from 'vite-plugin-font-optimization'

export default {
  plugins: [fontOptimizationPlugin()]
}
```

Vite Font Optimization currently supports Google Fonts and Typekit. If you want to support additional fonts, you can set up `providers` like this below:

```js
import fontOptimizationPlugin from 'vite-plugin-font-optimization'

export default {
  plugins: [fontOptimizationPlugin({
    providers: ['https://fontlibrary.org//face/']
  })]
}
```

## Tests

Tests are using jest, to run the tests use:

```bash
$ npm run test
```
