import React from 'react'
// import { shallow } from 'enzyme'
import { render } from '@testing-library/react'
import Login from '../pages/login'

describe('SomeComponent', () => {
  // const wrapper = shallow(<Login />) // Rendering
  // expect(wrapper.find('Result').length).toBe(1) // Has Result component
  // expect(wrapper.find('Result').prop('type')).toBe('success') // The type of the Result component is success
  const { container } = render(<Login />)
  expect(container.firstChild).toMatchSnapshot()
})

test('two plus two is four', () => {
  expect(2 + 2).toBe(4)
})

// test('Title for the test case', () => {
//   const value = 1
//   const expectedValue = 2
//   const result = fn(value)
//   expect(result).toBe(expectedValue)
// })
