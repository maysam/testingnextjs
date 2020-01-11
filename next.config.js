const withLess = require('@zeit/next-less')
const lessToJS = require('less-vars-to-js')
const fs = require('fs')
const path = require('path')
const analyzer = require('@next/bundle-analyzer')

const config = {
  exportTrailingSlash: true,
  exportPathMap: () => {
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

// Where your antd-custom.less file lives
const themeVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8'))
// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  require.extensions['.less'] = file => {}
}
module.exports = withLess({
  ...withBundleAnalyzer(config),
  target: 'serverless',
  poweredByHeader: false,
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables, // make your antd custom effective
  },
})
