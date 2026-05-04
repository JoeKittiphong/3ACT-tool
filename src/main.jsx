import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/tokens.css'
import './styles/base.css'
import './styles/shared.css'
import './styles/ui.css'
import './styles/layout.css'
import './styles/editor.css'
import './styles/auth.css'
import './styles/library.css'
import './styles/modal.css'
import './styles/mobile.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
