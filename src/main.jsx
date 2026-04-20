import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import ErrorBoundary from './components/layout/ErrorBoundary.jsx'
import { AppProvider } from './context/AppContext.jsx'
import ScrollToTop from './components/layout/ScrollToTop.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <AppProvider>
          <BrowserRouter>
            <ScrollToTop />
            <App />
          </BrowserRouter>
        </AppProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
