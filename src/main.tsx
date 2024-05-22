import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { Button, createTheme, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import classes from './Button.danger.module.css'
import { GitHubCorner } from './components/GitHubCorner.tsx'
import { PROJECT_GITHUB_URL } from './config.ts'

const theme = createTheme({
  components: {
    Button: Button.extend({
      classNames: classes
    })
  }
})

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      <App />
      <GitHubCorner href={PROJECT_GITHUB_URL} />
    </MantineProvider>
  </React.StrictMode>
)
