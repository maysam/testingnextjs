import React from 'react'
import { mount } from 'enzyme'
import Index from '../index'

describe('index page', () => {
  it('should have App component', () => {
    const subject = mount(<Index message="hi" total="1" keyword="a" />)

    expect(subject.find('Blog')).toHaveLength(1)

  })
})
