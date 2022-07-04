import fontOptimizationPlugin from '../src'

describe('font optimization', () => {
  test('should return google font style', async () => {
    const plugin = fontOptimizationPlugin()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const style = await plugin.transformIndexHtml(
      '<link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">'
    )
    expect(style).toContain(
      '<style data-href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap">'
    )
    expect(style).toContain("font-family: 'Public Sans'")
  })

  test('should return original html', async () => {
    const plugin = fontOptimizationPlugin()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const style = await plugin.transformIndexHtml(
      '<link href="https://fonts.gstatic.com" rel="dns-prefetch"><link href="https://example.com" rel="stylesheet">'
    )
    expect(style).toBe(
      '<link href="https://fonts.gstatic.com" rel="dns-prefetch"><link href="https://example.com" rel="stylesheet">'
    )
  })

  test('should return custom provider font', async () => {
    const plugin = fontOptimizationPlugin({
      providers: ['https://fontlibrary.org//face/']
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const style = await plugin.transformIndexHtml(
      `<link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
       <link rel="stylesheet" media="screen" href="https://fontlibrary.org//face/courier-prime-code" type="text/css"/>
       <link rel="stylesheet" media="screen" href="https://fonts.bunny.net/css?family=abel:400" type="text/css"/>
      `
    )
    expect(style).toContain('<style data-href="https://fontlibrary.org//face/courier-prime-code">')
    expect(style).toContain('<style data-href="https://fonts.bunny.net/css?family=abel:400">')
    expect(style).toContain(
      '<style data-href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap">'
    )
    expect(style).toContain("font-family: 'Public Sans'")
    expect(style).toContain("font-family: 'Abel'")
    expect(style).toContain("font-family: 'CourierPrimeCodeRegular'")
  })
})
