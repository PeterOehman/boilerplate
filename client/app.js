import React from 'react'
import ReactDOM from 'react-dom'
import '../public/index.css'
import store from './store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <div>hi</div>
  </Provider>,
  document.getElementById('app')
)


