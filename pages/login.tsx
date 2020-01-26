import React, { useState, useContext } from 'react'
import Router from 'next/router'
import fetch from 'isomorphic-unfetch'
import { Formik } from 'formik'
import { Radio, Form, Button, Input, Icon, Alert } from 'antd'
import { UserContext } from '../components/UserContext'
import { isValidIranianNationalCode } from '../lib/validations'

export default function Login() {
  function LoginForm({ form: { getFieldDecorator, validateFields } }) {
    const [error, setError] = useState<string | null>(null)
    const { dispatch } = useContext(UserContext)
    return (
      <Formik
        initialValues={{ method: 'email', mobile: '', nid: '', email: '', password: '' }}
        validate={() => {
          setError(null)
        }}
        onSubmit={(_, { setSubmitting }) => {
          validateFields((err, values) => {
            if (err) {
              if (err[values.method]) {
                setError(err[values.method].errors[0].message)
              } else if (err['password']) {
                setError(err['password'].errors[0].message)
              }
              setSubmitting(false)
            } else {
              fetch('/api/authenticate', {
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
            }
          })
        }}
      >
        {({
          values,
          // errors,
          // touched,
          handleChange,
          handleSubmit,
          isSubmitting,
          isValid,
          // isValidating,
          /* and other goodies */
        }) => (
          <Form onSubmit={handleSubmit}>
            {error && <Alert message={error} type="error" style={{ marginBottom: 10 }} showIcon closable />}
            <Form.Item label="Login with" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
              {getFieldDecorator('method', {
                initialValue: values.method,
              })(
                <Radio.Group name="method" onChange={handleChange}>
                  <Radio.Button value="email">Email</Radio.Button>
                  <Radio.Button value="mobile">Mobile Number</Radio.Button>
                  <Radio.Button value="nid">National ID</Radio.Button>
                </Radio.Group>
              )}
            </Form.Item>
            {values.method == 'email' && (
              <Form.Item hasFeedback>
                {getFieldDecorator('email', {
                  validateFirst: true,
                  rules: [
                    { required: true, message: 'Please enter your Email address!' },
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
                    autoComplete="email"
                    onChange={handleChange}
                  />
                )}
              </Form.Item>
            )}
            {values.method == 'mobile' && (
              <Form.Item hasFeedback>
                {getFieldDecorator('mobile', {
                  validateFirst: true,
                  rules: [
                    { required: true, message: 'Please enter your Mobile number!' },
                    { pattern: /^(\+98|0)?9\d{9}$/, message: 'Invalid Mobile Number Format' },
                  ],
                })(
                  <Input
                    prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    name="mobile"
                    autoComplete="mobile"
                    placeholder="Mobile Number"
                    onChange={handleChange}
                  />
                )}
              </Form.Item>
            )}
            {values.method == 'nid' && (
              <Form.Item hasFeedback>
                {getFieldDecorator('nid', {
                  validateFirst: true,
                  rules: [
                    { required: true, message: 'Please enter your National ID number!' },
                    {
                      len: 10,
                      message: 'National ID number should be 10 digits long',
                    },
                    {
                      len: 10,
                      asyncValidator: (_, value) => {
                        return new Promise((resolve, reject) => {
                          if (isValidIranianNationalCode(value)) {
                            resolve()
                          } else {
                            reject('error message') // can reject with error message
                          }
                        })
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
                  />
                )}
              </Form.Item>
            )}
            <Form.Item hasFeedback>
              {getFieldDecorator('password', {
                validateFirst: true,
                rules: [
                  { required: true, message: 'Please enter your password!' },
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
                  autoComplete="current-password"
                  placeholder="password"
                  onChange={handleChange}
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={isSubmitting || !isValid}>
                Login
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    )
  }
  const Wrapped = Form.create({ name: 'LoginForm' })(LoginForm)
  return <Wrapped />
}
