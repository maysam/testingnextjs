import React, { useState, useEffect, useContext } from 'react'
import Router from 'next/router'
import fetch from 'node-fetch'
import { Formik } from 'formik'
import { Typography, Divider, Form, Button, Input, Icon, Alert } from 'antd'
import { UserContext } from '../../components/UserContext'
import { isValidIranianNationalCode } from '../../lib/validations'

const { Title } = Typography

const User = ({ uid, user }) => {
  if (!user || user.name === undefined) {
    return <div>reouter query id = {uid}</div>
  }

  const {
    dispatch,
    state: { isLoggedIn },
  } = useContext(UserContext)

  function EditUserForm({ form: { getFieldDecorator, validateFields, getFieldsValue, isFieldsTouched } }) {
    const [error, setError] = useState<string | null>(null)
    const [needOne, setOne] = useState<boolean>(true)

    const values = getFieldsValue()
    const AllIsEmpty = !values.email && !values.nid && !values.mobile
    if (AllIsEmpty != needOne) {
      setOne(AllIsEmpty)
    }

    useEffect(() => {
      if (isFieldsTouched()) {
        // don't validate on startup
        validateFields(['name', 'email', 'mobile', 'nid', 'password'], { force: true })
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
      <Formik
        initialValues={user}
        onSubmit={(_, { setSubmitting }) => {
          console.log('onsubmit')
          return validateFields((err, values) => {
            console.log({ err, values })
            if (err) {
              console.log('there is error')
              if (err[values.method]) {
                setError(err[values.method].errors[0].message)
              } else if (err['password']) {
                setError(err['password'].errors[0].message)
              }
              setSubmitting(false)
            } else {
              console.log('patching')
              const x = fetch('/api/users', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(values.merge({ uid })),
              })
                .then(data => (data.statusText == 'Internal Server Error' ? data.statusText : data.json()))
                .then(data => {
                  setSubmitting(false)
                  if (data.status === 'ok') {
                    dispatch({ type: 'fetch' })
                    Router.push(isLoggedIn ? '/users' : '/')
                  } else {
                    const error = typeof data == 'string' ? data : data.message
                    // .toString()
                    // .split(/[a-zA-Z]\:/)
                    // // .split(': ')
                    // .reverse()[0]
                    setError(error)
                  }
                })
                .catch(err => {
                  console.warn({ err })
                  setSubmitting(false)
                })
              console.log('after patching')
              console.log({ x })
            }
          })
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, isSubmitting, values }) => (
          <Form onSubmit={handleSubmit} {...formItemLayout}>
            <Title level={4}>Edit User</Title>
            {error && <Alert message={error} type="error" showIcon closable />}
            <Divider />
            <Form.Item label="Full Name" hasFeedback>
              {getFieldDecorator('name', {
                validateFirst: true,
                whitespace: true,
                initialValue: values.name,
                rules: [{ required: true, message: 'Please input your name!' }],
              })(
                <Input
                  prefix={<Icon type="smile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  name="name"
                  placeholder="Name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              )}
            </Form.Item>
            <Form.Item label={'Mobile Number'} hasFeedback>
              {getFieldDecorator('mobile', {
                // normalize: normalizeIranianMobileNumbers
                validateFirst: true,
                whitespace: true,
                initialValue: values.mobile,
                rules: [{ pattern: /^(\+98|0)?9\d{9}$/, message: 'Invalid Mobile Number Format' }],
              })(
                <Input
                  prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  name="mobile"
                  placeholder="Mobile Number"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              )}
            </Form.Item>
            <Form.Item label="National ID" hasFeedback>
              {getFieldDecorator('nid', {
                validateFirst: true,
                whitespace: true,
                initialValue: values.nid,
                rules: [
                  {
                    len: 10,
                    message: 'National ID number should be 10 digits long',
                  },
                  {
                    validator: (_, value, callback) => {
                      if (!value || isValidIranianNationalCode(value)) {
                        callback()
                      } else {
                        callback('error message') // can reject with error message
                      }
                    },
                    message: 'Invalid National ID number',
                  },
                ],
              })(
                <Input
                  prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  name="nid"
                  placeholder="National ID"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              )}
            </Form.Item>
            <Form.Item label="Email Address" hasFeedback>
              {getFieldDecorator('email', {
                validateFirst: true,
                whitespace: true,
                initialValue: values.email,
                rules: [
                  {
                    type: 'email',
                    message: 'Invalid Email Format',
                  },
                  // {
                  //   pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  //   message: 'Invalid Email format 2',
                  // },
                ],
              })(
                <Input
                  prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              )}
            </Form.Item>

            <span>Leave empty if you don't want to change it.</span>
            <Form.Item label="Password" hasFeedback>
              {getFieldDecorator('password', {
                validateFirst: true,
                whitespace: true,
                rules: [
                  {
                    min: 6,
                    message: 'Minimum 6 characters',
                  },
                  // {
                  //   pattern: /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
                  //   message: 'Weak password',
                  // },
                ],
              })(
                <Input.Password
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  name="password"
                  placeholder="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              )}
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                Save
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    )
  }
  const Wrapped = Form.create({ name: 'nonconditional' })(EditUserForm)

  return <Wrapped />
}

User.getInitialProps = context => {
  const { query, req } = context
  const { uid } = query

  const path = `/api/user/${uid}`
  const url = req == undefined ? path : 'http://' + req.headers['host'] + path

  return fetch(url)
    .then(res => res.json())
    .catch(error => {
      console.log({ error })
      return { uid, user: { _id: '1', name: 'none' } }
    })
}

export default User
