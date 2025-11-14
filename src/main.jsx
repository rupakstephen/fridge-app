import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Mock storage API for local development
if (!window.storage) {
  window.storage = {
    get: async (key) => {
      const value = localStorage.getItem(key);
      return value ? { key, value, shared: false } : null;
    },
    set: async (key, value, shared = false) => {
      localStorage.setItem(key, value);
      return { key, value, shared };
    },
    delete: async (key, shared = false) => {
      localStorage.removeItem(key);
      return { key, deleted: true, shared };
    },
    list: async (prefix = '', shared = false) => {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(prefix));
      return { keys, prefix, shared };
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)