import React, { useState, useContext } from 'react'
import Router from 'next/router'
import { Divider, Form, Button, Input, Alert } from 'antd'
import {
  SmileOutlined,
  UserOutlined,
  MobileOutlined,
  IdcardOutlined,
  MailOutlined,
  LockOutlined,
} from '@ant-design/icons'
// import { FormComponentProps } from 'antd/es/form'
// import { FormComponentProps } from 'antd/lib/form'
// import { WrappedFormUtils } from 'antd/lib/form/Form'

import { UserContext } from '../components/UserContext'

interface Props {
  text?: string
}

export default function Conditional() {
  const [count, setCount] = useState(0)
  const [error, setError] = useState(null)
  const [isSubmitting, setSubmitting] = useState(false)
  const { dispatch } = useContext(UserContext)
  const [form] = Form.useForm()

  class ConditionalBuildingPage extends React.Component<Props> {
    static async getInitialProps() {
      let resultText = ''

      if (process.browser) {
        resultText = 'This is text for CLIENT'
      } else {
        resultText = 'This is text for SERVER'
      }
      console.log(resultText)

      return { text: resultText }
    }

    // errors = {}
    // this needs to be changed
    // handleError = ({errorFields}) => {

    // }
    handleSubmit = values => {
      setCount(count + 10)
      console.log('Received values of form: ', values)
      fetch('/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
        .then(data => data.json())
        .then(data => {
          if (data.status === 'ok') {
            dispatch({ type: 'fetch' })
            Router.push('/')
          } else {
            setError(data.message)
          }
        })
    }

    render() {
      // function hasErrors(fieldsError: Record<string, string[] | undefined>): boolean {
      //   return Object.keys(fieldsError).some(field => fieldsError[field])
      // }

      // const usernameError = form.isFieldTouched('email') && form.getFieldError('email')
      // const passwordError = form.isFieldTouched('password') && form.getFieldError('password')

      return (
        <>
          {error && <Alert message={error} type="error" showIcon closable />}
          from {this.props.text}
          <br />
          count={count}
          <br />
          <div>{process.env.TEST_VAR1}</div>
          <br />
          <div>{process.env.TEST_VAR2}</div>
          <Divider />
          <Form form={form} layout="inline" onFinish={this.handleSubmit}>
            <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
              <Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Log in
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <h1>New User</h1>
          <Form
            initialValues={{ name: '', mobile: '', nid: '', email: '', password: '' }}
            // validate={values => {
            //   const errors: { email?: string; mobile?: string; nid?: string; password?: string } = {}
            //   if (values.email) {
            //     if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            //       this.errors.email = 'Invalid email address'
            //     }
            //   } else {
            //     if (values.mobile) {
            //       // checking mobile
            //     } else {
            //       if (values.nid) {
            //         // validate nid
            //       } else {
            //         this.errors.email = 'Required'
            //         this.errors.mobile = 'Required'
            //         this.errors.nid = 'Required'
            //       }
            //     }
            //   }
            //   if (values.password) {
            //     if (values.password.length < 6) {
            //       this.errors.password = 'At least 6 characters'
            //     }
            //   } else {
            //     this.errors.password = 'Required'
            //   }
            //   return errors
            // }}
            onFinish={values => {
              setCount(count + 1)
              console.log('Received values of form: ', values)
              fetch('/api/users', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
              })
                .then(data => data.json())
                .then(data => {
                  console.log({ users: data })
                  setSubmitting(false)
                  if (data.status === 'ok') {
                    Router.push('/')
                  } else {
                    setError(data.message)
                  }
                })
            }}
            layout="vertical"
          >
            <Form.Item name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
              <Input
                prefix={
                  <>
                    <UserOutlined />
                    <SmileOutlined />
                  </>
                }
                name="name"
                placeholder="Name"
              />
            </Form.Item>
            <Form.Item name="mobile" rules={[{ required: true, message: 'Please input your name!' }]}>
              <Input prefix={<MobileOutlined />} placeholder="Mobile Number" />
            </Form.Item>
            <Form.Item name="nid">
              <Input
                prefix={<IdcardOutlined />}
                placeholder="National ID"
                // value={values.nid}
              />
              {/* {this.errors.nid && touched.nid && this.errors.nid} */}
            </Form.Item>
            <Form.Item name="email">
              <Input
                prefix={<MailOutlined />}
                type="email"
                placeholder="Email"
                // value={values.email}
              />
              {/* {this.errors.email && touched.email && this.errors.email} */}
            </Form.Item>
            <Form.Item name="password">
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="password"
                // value={values.password}
              />
              {/* {this.errors.password && touched.password && this.errors.password} */}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                Sign Up
              </Button>
            </Form.Item>
          </Form>
        </>
      )
    }
  }
  const Wrapped = ConditionalBuildingPage
  return <Wrapped />
}
