import Link from 'next/link'
import { Menu, Icon } from 'antd'

const { SubMenu } = Menu

const linkStyle = {
  marginRight: 15,
}

const Header = () => (
  <div>
    <Menu mode="horizontal">
      <Menu.Item key="home">
        <Link href="/">
          <a style={linkStyle}>Home</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="about">
        <Link href="/about">
          <a style={linkStyle}>About</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="agent">
        <Link href="/agent">
          <a style={linkStyle}>Agent</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="mail">
        <Icon type="mail" />
        Navigation One
      </Menu.Item>
      <Menu.Item key="app" disabled>
        <Icon type="appstore" />
        Navigation Two
      </Menu.Item>
      <SubMenu
        title={
          <span className="submenu-title-wrapper">
            <Icon type="setting" />
            Navigation Three - Submenu
          </span>
        }
      >
        <Menu.ItemGroup title="Item 1">
          <Menu.Item key="setting:1">Option 1</Menu.Item>
          <Menu.Item key="setting:2">Option 2</Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup title="Item 2">
          <Menu.Item key="setting:3">Option 3</Menu.Item>
          <Menu.Item key="setting:4">Option 4</Menu.Item>
        </Menu.ItemGroup>
      </SubMenu>
    </Menu>
  </div>
)

export default Header
