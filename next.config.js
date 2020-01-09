import analyzer from '@next/bundle-analyzer'

const config = {
  exportTrailingSlash: true,
  poweredByHeader: false,
  exportPathMap: function() {
    const paths = {
      '/': { page: '/' },
      '/about': { page: '/about' },
    }

    return paths
  },
}

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

const withBundleAnalyzer = analyzer({
  enabled: process.env.ANALYZE === 'true',
})

const analyzedConfig = withBundleAnalyzer(config)

module.exports = { ...analyzedConfig, target: 'serverless' }
