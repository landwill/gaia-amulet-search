import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Home.tsx'
import './index.css'
import ResultsScreen from './ResultsScreen/ResultsScreen.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  }, {
    path: '/search',
    element: <ResultsScreen />
  }
])

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
