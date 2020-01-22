import React, { useContext } from 'react'
import Link from 'next/link'
import { Menu, Icon } from 'antd'
import fetch from 'isomorphic-unfetch'
import { UserContext } from '../../components/UserContext'

const { SubMenu } = Menu

const linkStyle = {
  marginRight: 15,
}

export default function Header({ active }) {
  // const handleLogout = ({ key, keyPath, item, domEvent: event }) => {
  const {
    dispatch,
    state: {
      isLoggedIn,
      user: { name },
    },
  } = useContext(UserContext)
  const welcome = isLoggedIn ? 'Hello ' + name : 'Home'
  const handleLogout = ({ domEvent: event }) => {
    event.preventDefault()
    fetch('/api/session', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(data => data.json())
      .then(data => {
        console.log(data)
        if (data.status === 'ok') {
          dispatch({ type: 'clear' })
        }
      })
  }
  return (
    <Menu mode="horizontal" selectedKeys={[active]}>
      <Menu.Item key="Index">
        <Link href="/">
          <a style={linkStyle}>{welcome}</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="About">
        <Link href="/about">
          <a style={linkStyle}>About</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="Agent">
        <Link href="/agent">
          <a style={linkStyle}>Agent</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="Conditional">
        <Link href="/conditional">
          <a>Conditional</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="mail" disabled>
        <Icon type="mail" />
        Navigation One
      </Menu.Item>
      <SubMenu
        title={
          <span className="submenu-title-wrapper">
            <Icon type="setting" />
            Has Submenu
          </span>
        }
      >
        <Menu.ItemGroup title="Examples">
          <Menu.Item key="Conditional">
            <Link href="/conditional">
              <a>Conditional</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="Hook">
            <Link href="/hook">
              <a>Hook</a>
            </Link>
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup title="Item 2">
          <Menu.Item key="setting:3">Option 3</Menu.Item>
          <Menu.Item key="setting:4">Option 4</Menu.Item>
        </Menu.ItemGroup>
      </SubMenu>
      {isLoggedIn && (
        <Menu.Item key="logout" onClick={handleLogout}>
          <Icon type="out" />
          Logout
        </Menu.Item>
      )}
    </Menu>
  )
}
