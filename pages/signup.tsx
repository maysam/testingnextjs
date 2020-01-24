import React, { useState, useContext } from 'react'
import Router from 'next/router'
import fetch from 'isomorphic-unfetch'
import { Formik } from 'formik'
import { Divider, Form, Button, Input, Icon, Alert } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import { UserContext } from '../components/UserContext'

export default function Conditional() {
  const [error, setError] = useState(null)
  const { dispatch } = useContext(UserContext)

  class ConditionalBuildingPage extends React.Component<FormComponentProps> {
    render() {
      const { getFieldDecorator } = this.props.form

      return (
        <Formik
          initialValues={{ name: '', mobile: '', nid: '', email: '', password: '' }}
          validate={values => {
            const errors: { email?: string; mobile?: string; nid?: string; password?: string } = {}
            if (values.email) {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
              }
            } else {
              if (values.mobile) {
                // checking mobile
              } else {
                if (values.nid) {
                  // validate nid
                } else {
                  errors.email = 'Required'
                  errors.mobile = 'Required'
                  errors.nid = 'Required'
                }
              }
            }
            if (values.password) {
              if (values.password.length < 6) {
                errors.password = 'At least 6 characters'
              }
            } else {
              errors.password = 'Required'
            }
            return errors
          }}
          onSubmit={(values, { setSubmitting }) => {
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
                  dispatch({ type: 'dontfetch' })
                  Router.push('/')
                } else {
                  setError(data.message)
                }
              })
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <div>
              <Form layout="vertical" onSubmit={handleSubmit}>
                <h1>New User</h1>
                {error && <Alert message={error} type="error" showIcon closable />}
                <Divider />
                <Form.Item validateStatus={errors.name ? 'error' : ''} help={errors.name}>
                  {getFieldDecorator('name', {
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
                <Form.Item label="Mobile number" validateStatus={errors.mobile ? 'error' : ''} help={errors.mobile}>
                  {getFieldDecorator('mobile', {
                    rules: [{ required: true, message: 'Please input your name!' }],
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
                <Form.Item>
                  <Input
                    prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    name="nid"
                    placeholder="National ID"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.nid}
                  />
                  {errors.nid && touched.nid && errors.nid}
                </Form.Item>
                <Form.Item>
                  <Input
                    prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  {errors.email && touched.email && errors.email}
                </Form.Item>
                <Form.Item>
                  <Input.Password
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  {errors.password && touched.password && errors.password}
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                    Sign Up
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}
        </Formik>
      )
    }
  }
  const Wrapped = Form.create({ name: 'nonconditional' })(ConditionalBuildingPage)
  return <Wrapped />
}
