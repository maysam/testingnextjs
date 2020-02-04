import React, { useContext } from 'react'
import Link from 'next/link'
import { Menu, Icon } from 'antd'

import { UserContext } from '../../components/UserContext'

const { SubMenu } = Menu

export default function Header({ active }) {
  const {
    dispatch,
    state: {
      isLoggedIn,
      user: { name },
    },
  } = useContext(UserContext)

  return (
    <Menu mode="horizontal" selectedKeys={[active]}>
      <Menu.Item key="Index">
        <Link href="/">
          <a>
            <Icon type="home" />
            {isLoggedIn ? 'Hello ' + name : 'Home'}
          </a>
        </Link>
      </Menu.Item>
      {isLoggedIn && (
        <Menu.Item key="AddUser">
          <Link href="/adduser">
            <a>
              <Icon type="user-add" />
              Add User
            </a>
          </Link>
        </Menu.Item>
      )}
      {isLoggedIn && (
        <Menu.Item key="AllUsers">
          <Link href="/users">
            <a>
              <Icon type="user" />
              All Users
            </a>
          </Link>
        </Menu.Item>
      )}
      {!isLoggedIn && (
        <Menu.Item key="Login">
          <Link href="/login">
            <a>
              <Icon type="login" />
              Login
            </a>
          </Link>
        </Menu.Item>
      )}
      {!isLoggedIn && (
        <Menu.Item key="SignUp">
          <Link href="/signup">
            <a>
              <Icon type="plus-square" />
              Sign Up
            </a>
          </Link>
        </Menu.Item>
      )}
      <Menu.Item key="About">
        <Link href="/about">
          <a>
            <Icon type="info-circle" />
            About
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item key="/Compass" disabled>
        <Icon type="compass" />
        Coming Soon
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
        <Menu.Item key="logout" onClick={() => dispatch({ type: 'logout' })}>
          <Icon type="logout" />
          Logout
        </Menu.Item>
      )}
    </Menu>
  )
}
