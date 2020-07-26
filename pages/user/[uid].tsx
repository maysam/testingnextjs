import React, { useState, useEffect, useContext } from 'react'
import Router from 'next/router'
import { Typography, Divider, Form, Button, Input, Alert } from 'antd'
import {
  SmileOutlined,
  UserOutlined,
  MobileOutlined,
  IdcardOutlined,
  MailOutlined,
  LockOutlined,
} from '@ant-design/icons'
import { UserContext } from '../../components/UserContext'
import { isValidIranianNationalCode } from '../../lib/validations'

const { Title } = Typography

const User = ({ user }) => {
  if (!user || user.name === undefined) {
    return <div>Cannot find user corresponding to id {user._id}</div>
  }
  const uid = user._id
  const {
    dispatch,
    state: { isLoggedIn },
  } = useContext(UserContext)

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setSubmitting] = useState(false)
  const [needOne, setOne] = useState<boolean>(true)
  const [form] = Form.useForm()

  const values = form.getFieldsValue()
  const AllIsEmpty = !values.email && !values.nid && !values.mobile
  if (AllIsEmpty != needOne) {
    setOne(AllIsEmpty)
  }

  useEffect(() => {
    if (form.isFieldsTouched()) {
      // don't validate on startup
      form.validateFields(['name', 'email', 'mobile', 'nid', 'password'])
    }
  }, [needOne])

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

  return (
    <Form
      form={form}
      initialValues={user}
      onFinishFailed={({ values, errorFields }) => {
        console.log(errorFields, values)
        errorFields.forEach(errorField => {
          if (errorField.name[0] === values.method) {
            setError(errorField.errors[0])
          }
          if (errorField.name[0] === 'password') {
            setError(errorField.errors[0])
          }
        })
        setSubmitting(false)
      }}
      onFinish={values => {
        setSubmitting(true)
        values.uid = uid
        return fetch('/api/users', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        })
          .then(data => (data.statusText == 'Internal Server Error' ? data.statusText : data.json()))
          .then(data => {
            if (data.status === 'ok') {
              dispatch({ type: 'fetch' })
              Router.push(isLoggedIn ? '/users' : '/')
            } else {
              const error = typeof data == 'string' ? data : data.message
              // .toString()
              // .split(/[a-zA-Z]\:/)
              // // .split(': ')
              // .reverse()[0]
              setSubmitting(false)
              setError(error)
            }
          })
          .catch(err => {
            console.warn({ err })
            setSubmitting(false)
          })
      }}
      {...formItemLayout}
    >
      <Title level={4}>Edit User</Title>
      {error && <Alert message={error} type="error" showIcon closable />}
      <Divider />
      <Form.Item
        label="Full Name"
        hasFeedback
        name="name"
        validateFirst
        rules={[{ whitespace: true }, { required: true, message: 'Please input your name!' }]}
      >
        <Input
          prefix={
            <>
              <SmileOutlined />
              <SmileOutlined spin />
              <UserOutlined />
            </>
          }
          placeholder="Name"
        />
      </Form.Item>
      <Form.Item
        label={'Mobile Number'}
        hasFeedback
        name="mobile"
        // normalize: normalizeIranianMobileNumbers
        validateFirst
        rules={[
          { whitespace: true },
          { required: needOne, message: 'Please input your mobile number!' },
          { pattern: /^(\+98|0)?9\d{9}$/, message: 'Invalid Mobile Number Format' },
        ]}
      >
        <Input prefix={<MobileOutlined />} placeholder="Mobile Number" />
      </Form.Item>
      <Form.Item
        label="National ID"
        hasFeedback
        name="nid"
        validateFirst
        rules={[
          { whitespace: true },
          { required: needOne, message: 'Please input your national ID number!' },
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
                  reject('Invalid National ID number') // can reject with error message
                }
              })
            },
          },
        ]}
      >
        <Input prefix={<IdcardOutlined />} placeholder="National ID" />
      </Form.Item>
      <Form.Item
        label="Email Address"
        hasFeedback
        name="email"
        validateFirst
        rules={[
          { whitespace: true },
          { required: needOne, message: 'Please enter your email address' },
          {
            type: 'email',
            message: 'Invalid Email Format',
          },
          // {
          //   pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          //   message: 'Invalid Email format 2',
          // },
        ]}
      >
        <Input prefix={<MailOutlined />} type="email" name="email" placeholder="Email" />
      </Form.Item>

      <span>Leave empty if you don&#39;t want to change it.</span>
      <Form.Item
        label="Password"
        hasFeedback
        name="password"
        validateFirst
        rules={[
          { whitespace: true },
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
          prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          allowClear
          type="password"
          autoComplete="new-password"
          placeholder="password"
        />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" disabled={isSubmitting}>
          Save
        </Button>
      </Form.Item>
    </Form>
  )
}

export function getServerSideProps({ query, req }) {
  const { uid } = query
  const path = `/api/user/${uid}`
  const url = req == undefined ? path : 'http://' + req.headers['host'] + path

  return fetch(url)
    .then(res => res.json())
    .then(props => {
      return { props }
    })
    .catch(error => {
      console.log({ error })
      return { props: { user: { _id: uid } } }
    })
}

export default User
