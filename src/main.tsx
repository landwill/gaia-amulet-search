import '@mantine/core/styles.css'
import { Button, createTheme, MantineProvider } from '@mantine/core'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './Home.tsx'
import './index.css'
import classes from './Button.danger.module.css'

const theme = createTheme({
  components: {
    Button: Button.extend({
      classNames: classes,
    }),
  },
});

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Home />
    </MantineProvider>
  </React.StrictMode>
)
