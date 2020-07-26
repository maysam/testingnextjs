import React, { useState, useContext } from 'react'
import Router from 'next/router'
import { Radio, Form, Button, Input, Alert } from 'antd'
import { MobileOutlined, IdcardOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'

import { UserContext } from '../components/UserContext'
import { isValidIranianNationalCode } from '../lib/validations'

export default function Login() {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setSubmitting] = useState(false)
  const { dispatch } = useContext(UserContext)
  const [method, setMethod] = useState('email')
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  }
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  }

  const onFormLayoutChange = values => {
    if (values.method) {
      setMethod(values.method)
    }
  }
  return (
    <Form
      onValuesChange={onFormLayoutChange}
      initialValues={{ method }}
      // validate={() => {
      //   setError(null)
      //   if you want to remove server error once user starts editing login information
      // }}
      onFinishFailed={({ errorFields }) => {
        console.log(errorFields)
        errorFields.forEach(errorField => {
          if (errorField.name[0] === method) {
            setError(errorField.errors[0])
          }
          if (errorField.name[0] === 'password') {
            setError(errorField.errors[0])
          }
        })
        setSubmitting(false)
      }}
      onFinish={values => {
        return fetch('/api/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        })
          .then(data => data.json())
          .then(data => {
            setSubmitting(false)
            if (data.status === 'ok') {
              setError(null)
              dispatch({ type: 'fetch' })
              Router.push('/')
            } else {
              setError(data.message)
            }
          })
      }}
      {...formItemLayout}
    >
      {error && <Alert message={error} type="error" style={{ marginBottom: 10 }} showIcon closable />}
      <Form.Item label="Login with" name="method">
        <Radio.Group name="method">
          <Radio.Button value="email">Email</Radio.Button>
          <Radio.Button value="mobile">Mobile Number</Radio.Button>
          <Radio.Button value="nid">National ID</Radio.Button>
        </Radio.Group>
      </Form.Item>
      {method == 'email' && (
        <Form.Item
          label="Email Address"
          hasFeedback
          name="email"
          validateFirst
          rules={[
            { required: true, message: 'Please enter your Email address!' },
            {
              type: 'email',
              message: 'Invalid Email Format',
            },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Email"
            autoComplete="email"
          />
        </Form.Item>
      )}
      {method == 'mobile' && (
        <Form.Item
          label="Mobile Number"
          hasFeedback
          name="mobile"
          validateFirst
          rules={[
            { required: true, message: 'Please enter your Mobile number!' },
            { pattern: /^(\+98|0)?9\d{9}$/, message: 'Invalid Mobile Number Format' },
          ]}
        >
          <Input prefix={<MobileOutlined />} autoComplete="mobile" placeholder="Mobile Number" />
        </Form.Item>
      )}
      {method == 'nid' && (
        <Form.Item
          label="National ID"
          hasFeedback
          name="nid"
          validateFirst
          rules={[
            { required: true, message: 'Please enter your National ID number!' },
            {
              len: 10,
              message: 'National ID number should be 10 digits long',
            },
            {
              validator: (_, value) => {
                return new Promise((resolve, reject) => {
                  if (!value || isValidIranianNationalCode(value)) {
                    resolve()
                  } else {
                    reject('Invalid National ID format') // can reject with error message
                  }
                })
              },
              // message: 'Invalid National ID number',
            },
          ]}
        >
          <Input prefix={<IdcardOutlined />} placeholder="National ID" />
        </Form.Item>
      )}
      <Form.Item
        label="Password"
        hasFeedback
        name="password"
        validateFirst
        rules={[
          { required: true, message: 'Please enter your password!' },
          {
            min: 6,
            message: 'Minimum 6 characters',
          },
          // {
          //   pattern: /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
          //   message: 'Weak password',
          // },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          autoComplete="current-password"
          placeholder="password"
        />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" disabled={isSubmitting}>
          Login
        </Button>
      </Form.Item>
    </Form>
  )
}
