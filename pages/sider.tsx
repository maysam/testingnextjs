import React, { useState } from 'react'
import { Menu, Switch } from 'antd'
import { MailOutlined, CalendarOutlined, AppleOutlined, SettingOutlined } from '@ant-design/icons'

const { SubMenu } = Menu

export default function Sider() {
  type ModeTypes = 'inline' | 'vertical' | 'vertical-left' | 'vertical-right' | 'horizontal' | undefined
  const [mode, setMode] = useState<ModeTypes>('inline')

  type ThemeTypes = 'light' | 'dark' | undefined
  const [theme, setTheme] = useState<ThemeTypes>('light')

  const changeMode = value => {
    setMode(value ? 'vertical' : 'inline')
  }

  const changeTheme = value => {
    setTheme(value ? 'dark' : 'light')
  }

  return (
    <div>
      <Switch onChange={changeMode} /> Change Mode
      <span className="ant-divider" style={{ margin: '0 1em' }} />
      <Switch onChange={changeTheme} /> Change Theme
      <br />
      <br />
      <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode={mode} theme={theme}>
        <Menu.Item key="1" icon={<MailOutlined />}>
          Navigation One
        </Menu.Item>
        <Menu.Item key="2" icon={<CalendarOutlined />}>
          Navigation Two
        </Menu.Item>
        <SubMenu
          key="sub1"
          title={
            <span>
              <AppleOutlined />
              <span>Navigation Three</span>
            </span>
          }
        >
          <Menu.Item key="3">Option 3</Menu.Item>
          <Menu.Item key="4">Option 4</Menu.Item>
          <SubMenu key="sub1-2" title="Submenu">
            <Menu.Item key="5">Option 5</Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
          </SubMenu>
        </SubMenu>
        <SubMenu
          key="sub2"
          title={
            <span>
              <SettingOutlined />
              <span>Navigation Four</span>
            </span>
          }
        >
          <Menu.Item key="7">Option 7</Menu.Item>
          <Menu.Item key="8">Option 8</Menu.Item>
          <Menu.Item key="9">Option 9</Menu.Item>
          <Menu.Item key="10">Option 10</Menu.Item>
        </SubMenu>
      </Menu>
    </div>
  )
}
