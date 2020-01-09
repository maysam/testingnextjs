import React from 'react'
import App from 'next/app'
import Header from './components/Header'

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD',
}

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <div style={layoutStyle}>
        <Header active={Component.displayName} />
        <Component {...pageProps} />
      </div>
    )
  }
}

export default MyApp
