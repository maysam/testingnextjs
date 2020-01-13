import { IncomingMessage } from 'http'
// import { IncomingMessage } from 'next'
import Document, { Html, Head, DocumentContext, Main, NextScript } from 'next/document'

import cookie from 'cookie'
// import cookies from 'js-cookie'
const defaultLocale = 'fa'
const getStoredLocale = (req: IncomingMessage | undefined) => {
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
let locale = 'fa'
class MyDocument extends Document<{ locale: string }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    locale = getStoredLocale(ctx.req)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang={locale}>
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
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="apple-touch-icon" sizes="57x57" href="../static/favicon/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="../static/favicon/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="../static/favicon/apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="../static/favicon/apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="../static/favicon/apple-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="../static/favicon/apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="../static/favicon/apple-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="../static/favicon/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="../static/favicon/apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="../static/favicon/android-icon-192x192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="../static/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="../static/favicon/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="../static/favicon/favicon-16x16.png" />
          <link rel="manifest" href="../static/favicon/manifest.json" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="../static/favicon/ms-icon-144x144.png" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="Description" content="Abhishek Mehandiratta Portfolio" />
          <link type="stylesheet" href="../node_modules/font-awesome/css/font-awesome.css" />
        </Head>
        <body>
          <div>abc</div>
          <Main />
          <NextScript />
          {/* to remove preloader */}
          <script
            dangerouslySetInnerHTML={{
              __html: `

        //        if ("serviceWorker" in navigator) {
        //     navigator.serviceWorker.register("/serviceWorker.js")
        //         .catch(err => console.error("Service worker registration failed", err);
        // } else {
        //     console.log("Service worker not supported");
        // }

                      // // This is the "Offline copy of pages" service worker

                      // // Add this below content to your HTML page, or add the js file to your page at the very top to register service worker

                      // // Check compatibility for the browser we're running this in
                      // if ('serviceWorker' in navigator) {
                      //   if (navigator.serviceWorker.controller) {
                      //       console.log('[PWA Builder] active service worker found, no need to register')
                      //   } else {
                      //       // Register the service worker
                      //       navigator.serviceWorker
                      //       .register('service-worker.js', {
                      //           scope: './'
                      //       })
                      //       .then(function (reg) {
                      //           console.log('[PWA Builder] Service worker has been registered for scope: ' + reg.scope)
                      //       })
                      //   }
                      // }
                      // function loaded() {
                      //     document.body.classList.add('loaded');
                      // }
                      // setTimeout(loaded, 5000);
                      // window.addEventListener('load', loaded);
                  `,
            }}
          ></script>
        </body>
      </Html>
    )
  }
}

export default MyDocument
