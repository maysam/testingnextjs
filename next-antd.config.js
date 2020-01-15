const webpack = require('webpack')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')
const cssLoaderConfig = require('@zeit/next-css/css-loader-config')

module.exports = (nextConfig = {}) => ({
  ...nextConfig,
  ...{
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
        )
      }

      const { dev, isServer } = options
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
        test: /\.worker\.js$/,
        loader: 'worker-loader',
        // options: { inline: true }, // also works
        options: {
          name: 'static/[hash].worker.js',
          publicPath: '/_next/',
        },
      })
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

      // for antd less in server (yarn build)
      if (isServer) {
        const antdStyles = /antd\/.*?\/style.*?/
        const rawExternals = [...config.externals]

        config.externals = [
          (context, request, callback) => {
            if (request.match(antdStyles)) {
              return callback()
            }

            if (typeof rawExternals[0] === 'function') {
              rawExternals[0](context, request, callback)
            } else {
              callback()
            }
          },
          ...(typeof rawExternals[0] === 'function' ? [] : rawExternals),
        ]

        config.module.rules.unshift({
          test: antdStyles,
          use: 'null-loader',
        })
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      // config.plugins.push(new webpack.IgnorePlugin(/\/iconv-loader$/))
      config.plugins.push(
        new FilterWarningsPlugin({
          // ignore ANTD chunk styles [mini-css-extract-plugin] warning
          exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
        })
      )

      return config
    },
  },
})
