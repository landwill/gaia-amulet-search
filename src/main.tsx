import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { Button, createTheme, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import React from 'react'
import ReactDOM from 'react-dom/client'
import classes from './Button.danger.module.css'
import Home from './Home.tsx'
import './index.css'

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
      <Home />
    </MantineProvider>
  </React.StrictMode>
)
