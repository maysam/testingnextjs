import React, { useContext } from 'react'
import Link from 'next/link'
import { Menu } from 'antd'
import {
  HomeOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  LoginOutlined,
  FormOutlined,
  InfoCircleOutlined,
  CompassOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'

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
          <a href="/">
            <HomeOutlined />
            {isLoggedIn ? 'Hello ' + name : 'Home'}
          </a>
        </Link>
      </Menu.Item>
      {isLoggedIn && (
        <Menu.Item key="AddUser">
          <Link href="/adduser">
            <a href="/adduser">
              <UserAddOutlined />
              Add User
            </a>
          </Link>
        </Menu.Item>
      )}
      {isLoggedIn && (
        <Menu.Item key="AllUsers">
          <Link href="/users">
            <a href="/users">
              <UsergroupAddOutlined />
              All Users
            </a>
          </Link>
        </Menu.Item>
      )}
      {!isLoggedIn && (
        <Menu.Item key="Login">
          <Link href="/login">
            <a href="/login">
              <LoginOutlined />
              Login
            </a>
          </Link>
        </Menu.Item>
      )}
      {!isLoggedIn && (
        <Menu.Item key="SignUp">
          <Link href="/signup">
            <a href="/signup">
              <FormOutlined />
              Sign Up
            </a>
          </Link>
        </Menu.Item>
      )}
      <Menu.Item key="About">
        <Link href="/about">
          <a>
            <InfoCircleOutlined />
            About
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item key="/Compass" disabled>
        <CompassOutlined />
        Coming Soon
      </Menu.Item>
      <SubMenu
        title={
          <span className="submenu-title-wrapper">
            <SettingOutlined />
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
              <a href="/hook">Hook</a>
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
          <LogoutOutlined />
          Logout
        </Menu.Item>
      )}
    </Menu>
  )
}
