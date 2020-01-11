import Header from './components/Header'

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD',
}

function MyApp({ Component, pageProps }) {
  return (
    <div style={layoutStyle}>
      <Header active={Component.displayName} />
      <Component {...pageProps} />
    </div>
  )
}
export default MyApp
