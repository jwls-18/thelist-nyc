import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Polyfill window.storage when running outside Claude
if (!window.storage) {
  window.storage = {
    get: async (key, shared = true) => {
      const k = (shared ? 's__' : 'l__') + key
      const v = localStorage.getItem(k)
      if (v === null) throw new Error('Not found')
      return { key, value: v, shared }
    },
    set: async (key, value, shared = true) => {
      const k = (shared ? 's__' : 'l__') + key
      localStorage.setItem(k, value)
      return { key, value, shared }
    },
    delete: async (key, shared = true) => {
      localStorage.removeItem((shared ? 's__' : 'l__') + key)
      return { key, deleted: true }
    },
    list: async (prefix = '', shared = true) => {
      const p = (shared ? 's__' : 'l__') + prefix
      const keys = Object.keys(localStorage)
        .filter(k => k.startsWith(p))
        .map(k => k.replace(/^(s__|l__)/, ''))
      return { keys }
    },
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
