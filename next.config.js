require('dotenv').config()

const fs = require('fs')
const path = require('path')

const cssLoaderConfig = require('@zeit/next-css/css-loader-config')
const lessToJS = require('less-vars-to-js')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')

const withOffline = require('next-offline')
const analyzer = require('@next/bundle-analyzer')

const withBundleAnalyzer = analyzer({
  enabled: process.env.ANALYZE === 'true',
})

// Where your antd-custom.less file lives
const themeVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8'))
// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  require.extensions['.less'] = file => {}
}

const nextConfig = {
  webpack(config, options) {
    if (!options.defaultLoaders) {
      throw new Error(
        'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
      )
    }

    const { dev, isServer } = options

    if (isServer) {
      const antStyles = /antd\/.*?\/style\/css.*?/
      const origExternals = [...config.externals]
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback()
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback)
          } else {
            callback()
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ]

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader',
      })
    }

    const { cssModules, cssLoaderOptions, postcssLoaderOptions, lessLoaderOptions = {} } = nextConfig

    // for all less in clint
    const baseLessConfig = {
      extensions: ['less'],
      cssModules,
      cssLoaderOptions,
      postcssLoaderOptions,
      dev,
      isServer,
      loaders: [
        {
          loader: 'less-loader',
          options: lessLoaderOptions,
        },
      ],
    }

    config.module.rules.push({
      test: /\.less$/,
      exclude: /node_modules/,
      use: cssLoaderConfig(config, baseLessConfig),
    })

    // for antd less in client
    const antdLessConfig = {
      ...baseLessConfig,
      ...{ cssModules: false, cssLoaderOptions: {}, postcssLoaderOptions: {} },
    }

    config.module.rules.push({
      test: /\.less$/,
      include: /node_modules/,
      use: cssLoaderConfig(config, antdLessConfig),
    })

    config.plugins.push(
      new FilterWarningsPlugin({
        // ignore ANTD chunk styles [mini-css-extract-plugin] warning
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
      })
    )

    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: 'worker-loader',
      // options: { inline: true }, // also works
      options: {
        name: 'static/[hash].worker.js',
        publicPath: '/_next/',
      },
    })
    return config
  },

  poweredByHeader: false,
  exportTrailingSlash: true,
  exportPathMap: () => {
    const paths = {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/agent': { page: '/agent' },
    }

    return paths
  },
  target: 'serverless',
  // antd config
  cssModules: true,
  cssLoaderOptions: {
    sourceMap: false,
    importLoaders: 1,
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables, // make your antd custom effective
  },
  // offlineConfig,
  generateInDevMode: false,
  workboxOpts: {
    swDest: process.env.NEXT_EXPORT ? 'service-worker.js' : 'static/service-worker.js',
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true,
    maximumFileSizeToCacheInBytes: 500000000,

    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com/,
        handler: 'StaleWhileRevalidate',
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com/,
        handler: 'CacheFirst',
      },
      {
        urlPattern: /(\.js$|\.css$|static\/)/,
        handler: 'StaleWhileRevalidate',
      },
      {
        urlPattern: /^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
        },
      },
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
            headers: {
              'x-test': 'true',
            },
          },
        },
      },
    ],
  },
  experimental: {
    async rewrites() {
      return [
        {
          source: '/service-worker.js',
          destination: '/_next/static/service-worker.js',
        },
      ]
    },
  },
  env: {
    TEST_VAR1: process.env.TEST_VAR1,
    TEST_VAR2: process.env.TEST_VAR2,
    MONGODB_URI: process.env.MONGODB_URI,
  },
}

module.exports = withOffline(withBundleAnalyzer(nextConfig))
