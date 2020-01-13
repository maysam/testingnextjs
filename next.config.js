// const withPlugins = require('next-compose-plugins')
// const withLess = require('@zeit/next-less')
const lessToJS = require('less-vars-to-js')
const fs = require('fs')
const path = require('path')
const analyzer = require('@next/bundle-analyzer')
const withOffline = require('next-offline')

const withAntd = require('./next-antd.config')

const withBundleAnalyzer = analyzer({
  enabled: process.env.ANALYZE === 'true',
})

// Where your antd-custom.less file lives
const themeVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8'))
// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  require.extensions['.less'] = file => {}
}

const antdConfig = {
  cssModules: true,
  cssLoaderOptions: {
    sourceMap: false,
    importLoaders: 1,
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables, // make your antd custom effective
  },
}

const nextConfig = {
  ...antdConfig,
  // ...offlineConfig,
  exportTrailingSlash: true,
  exportPathMap: () => {
    const paths = {
      '/': { page: '/' },
      '/about': { page: '/about' },
    }

    return paths
  },
  target: 'serverless',
  generateInDevMode: true,
  generateSw: true,
  workboxOpts: {
    maximumFileSizeToCacheInBytes: 500000000,
    swDest: 'static/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'https-calls',
          networkTimeoutSeconds: 15,
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
  poweredByHeader: false,
}

module.exports = withOffline(withBundleAnalyzer(withAntd(nextConfig)))

// module.exports = withPlugins(
//   [
//     [withAntd, antdConfig],
//     ,
//     // withCSS,
//     // withProgressBar,
//     // withSourceMaps,
//     [withOffline, offlineConfig],
//   ],
//   nextConfig
// )
