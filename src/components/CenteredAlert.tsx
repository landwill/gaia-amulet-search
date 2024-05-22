import { Alert } from '@mantine/core'
import React from 'react'

interface CenteredAlertProps {
  maxWidth: number
  children: React.ReactNode | React.ReactNode[]
}

export function CenteredAlert({ maxWidth, children }: CenteredAlertProps) {
  return <div style={{ display: 'grid', justifyContent: 'center' }}>
    <Alert style={{ maxWidth }}>{children}</Alert>
  </div>
}