import Document, { Html, Head, DocumentContext, Main, NextScript } from 'next/document'

import cookie from 'cookie'

const defaultLocale = 'fa'

const getStoredLocale = req => {
  if (req) {
    const { headers } = req
    // Attempt to get locale saved cookie
    const parsedCookies = cookie.parse(headers.cookie || '')
    if (parsedCookies.locale) {
      return parsedCookies.locale
    }
    // Attempt to retrieve local from Accept-Language headers
    if (headers && headers['accept-language']) {
      const parsedLocale = headers['accept-language'].split(',')[0]
      if (parsedLocale) {
        return parsedLocale
      }
    }
  }

  return defaultLocale
}

class MyDocument extends Document<{ locale: string }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    const locale = getStoredLocale(ctx.req)
    return { ...initialProps, locale }
  }

  render() {
    return (
      <Html lang={this.props.locale}>
        <Head>
          <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
          <meta name="theme-color" content="#ffffff" />

          <meta charSet="utf-8" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="../static/favicon/ms-icon-144x144.png" />
          <meta name="theme-color" content="#ffffff" />
          <link type="stylesheet" href="../node_modules/font-awesome/css/font-awesome.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
