import React, { ReactNode, createContext, useReducer, useEffect } from 'react'
import Router from 'next/router'

interface State {
  isLoggedIn: boolean
  user: {
    name?: string
  }
}

const initialState: State = { isLoggedIn: false, user: { name: undefined } }

interface ActionType {
  type: string
  data: State
}

const reducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'state':
      return state
    case 'set':
      return action.data
    case 'clear':
    case 'reset':
      return initialState
    default:
      console.log(action.type + ' action not found!')
      return state
    // throw new Error()
  }
}

const defaultDispatch: (action: any) => void | Promise<void> = (): void => {}

const UserContext = createContext({ state: initialState, dispatch: defaultDispatch })

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const dispatchProxy = action => {
    switch (action.type) {
      case 'fetch':
        return fetch('/api/session')
          .then(data => {
            if (data.ok) {
              return data.json()
            } else {
              console.log({ data: data.body })
              throw data
            }
          })
          .then((res: Response & { data?: State }) => {
            return res.data || initialState
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
              dispatch({ type: 'clear', data: initialState })
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
