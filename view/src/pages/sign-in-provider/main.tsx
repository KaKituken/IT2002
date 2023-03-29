import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './sign-in-provider'
import { Provider } from 'react-redux'
import './index.css'
import { store } from '../../store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>,
)