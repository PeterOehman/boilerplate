import axios from 'axios'

const SET_AUTH = 'SET_AUTH'

const setAuth = auth => {
  console.log(auth)
  return {type: SET_AUTH, auth}
}

export const me = () => async dispatch => {
  const token = window.localStorage.getItem('token')
  if (token) {
    const res = await axios.get('/auth/me', {
      headers: {
        authorization: token
      }
    })
    return dispatch(setAuth(res.data))
  }
}

export const authenticate = (username, password, method) => async dispatch => {
  try {
    const res = await axios.post(`/auth/${method}`, {username, password})
    window.localStorage.setItem('token', res.data.token)
    dispatch(me())
  } catch (error) {
    return dispatch(setAuth({error}))
  }
}

export const logout = () => {
  window.localStorage.removeItem('token')
  history.push('/login')
  return {
    type: SET_AUTH,
    auth: {}
  }
}

export default function(state = {}, action) {
  switch (action.type) {
    case SET_AUTH:
      return action.auth
    default:
      return state
  }
}
