import React, { useState } from 'react'
import { Formik } from 'formik'
import { Form, Button, Input, Icon } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'

interface Props {
  text?: string
}

export default function wrapper() {
  const [count, setCount] = useState(0)

  class ConditionalBuildingPage extends React.Component<Props & FormComponentProps> {
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

    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      this.props.form.validateFields((err, values) => {
        if (!err) {
          setCount(count + 10)
          console.log('Received values of form: ', values)
        }
      })
    }

    render() {
      function hasErrors(fieldsError: Record<string, string[] | undefined>): boolean {
        return Object.keys(fieldsError).some(field => fieldsError[field])
      }

      const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
      const usernameError = isFieldTouched('username') && getFieldError('username')
      const passwordError = isFieldTouched('password') && getFieldError('password')

      const form = (
        <div>
          from {this.props.text}
          <br />
          count={count}
          <br />
          <div>{process.env.TEST_VAR1}</div>
          <br />
          <div>{process.env.TEST_VAR2}</div>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />)}
            </Form.Item>
            <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input.Password
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  name="password"
                  placeholder="Password"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                Log in
              </Button>
            </Form.Item>
          </Form>
          <Formik
            initialValues={{ email: '', password: '' }}
            validate={values => {
              const errors: { email?: string } = {}
              if (!values.email) {
                errors.email = 'Required'
              } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
              }
              return errors
            }}
            onSubmit={(values, { setSubmitting }) => {
              setCount(count + 1)
              console.log('Received values of form: ', values)
              // setTimeout(() => {
              //   alert(JSON.stringify(values, null, 2))
              setSubmitting(false)
              // }, 400)
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
                <Form layout="inline" onSubmit={handleSubmit}>
                  <Form.Item>
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="email"
                      name="email"
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
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    {errors.password && touched.password && errors.password}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}
          </Formik>
        </div>
      )
      return form
    }
  }
  const Wrapped = Form.create({ name: 'nonconditional' })(ConditionalBuildingPage)
  return <Wrapped />
}
