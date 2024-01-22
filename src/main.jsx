import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "bootstrap/dist/js/bootstrap.js"
import "bootstrap/dist/css/bootstrap.css"
import "react-toastify/dist/ReactToastify.css";
import './index.css'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import dotenv from "dotenv"
// dotenv.config()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
