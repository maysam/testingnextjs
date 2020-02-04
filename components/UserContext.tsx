import React, { createContext, useReducer, useEffect } from 'react'
import fetch from 'isomorphic-unfetch'
import Router from 'next/router'

interface State {
  isLoggedIn: boolean
  user: {
    name: string
  }
}

const reducer = (state: State, action) => {
  switch (action.type) {
    case 'state':
      return state
    case 'set':
      return action.data
    case 'clear':
      return {
        // ...state,
        isLoggedIn: false,
        user: {},
      }
    default:
      console.log(action.type + ' action not found!')
      return state
    // throw new Error()
  }
}

const initialState: State = { isLoggedIn: false, user: { name: 'hercules' } }

interface DispatchType {
  type: string
}

const defaultDispatch: React.Dispatch<DispatchType> = () => initialState // we never actually use this

const initialUserContext = { state: initialState, dispatch: defaultDispatch }

const UserContext = createContext(initialUserContext)

const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { isLoggedIn: false, user: {} })
  const dispatchProxy = action => {
    switch (action.type) {
      case 'fetch':
        return fetch('/api/session')
          .then(data => data.json())
          .then((res: Response & { data?: { isLoggedIn: boolean; user: {} } }) => {
            return res.data || { isLoggedIn: false, user: {} }
          })
          .then(({ isLoggedIn, user }) => {
            dispatch({
              type: 'set',
              data: { isLoggedIn, user },
            })
          })
      case 'logout':
        return fetch('/api/session', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(data => data.json())
          .then(data => {
            if (data.status === 'ok') {
              dispatch({ type: 'clear' })
              Router.push('/')
            }
          })
      // case 'dontfetch'
      //   return
      default:
        return dispatch(action)
    }
  }
  useEffect(() => {
    dispatchProxy({ type: 'fetch' })
  }, [])
  return <UserContext.Provider value={{ state, dispatch: dispatchProxy }}>{children}</UserContext.Provider>
}

const UserContextConsumer = UserContext.Consumer

export { UserContext, UserContextProvider, UserContextConsumer }
