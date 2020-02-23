import { Layout, Breadcrumb } from 'antd'
import Sider from './sider'

const { Header: AntHeader, Footer, Sider: AntSider, Content } = Layout

import { UserContextProvider } from '../components/UserContext'
import Header from './components/Header'

function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <Layout className="layout">
        <AntHeader>
          <div className="logo" />
          <Header active={Component.displayName || Component.name || 'Unnamed'} />
        </AntHeader>
        <Layout>
          <AntSider style={{ backgroundColor: 'rgb(240, 242, 245)' }} breakpoint="lg" collapsedWidth="0">
            <Sider />
          </AntSider>
          <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
              <Component {...pageProps} />
            </div>
          </Content>
        </Layout>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </UserContextProvider>
  )
}

export default MyApp
