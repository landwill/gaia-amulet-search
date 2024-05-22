import { Button, Grid, Input } from '@mantine/core'
import React from 'react'
import { PageAction } from '../interfaces.ts'

interface HtmlEntryPanelProps {
  dispatcher: React.Dispatch<PageAction>
  arrayIndex: number
  pageNumber: number
}

export const HtmlEntryPanel = ({ arrayIndex, dispatcher, pageNumber = 0 }: HtmlEntryPanelProps) => {
  const displayText = `Page ${String(pageNumber)} added successfully`

  return <Grid.Col span={12}>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Input value={displayText}
             disabled
             readOnly
             style={{ marginRight: 16, flexGrow: 1 }}
      />
      <Button variant='danger' onClick={e => {
        e.preventDefault()
        dispatcher({ action: 'delete', arrayIndex })
      }}>
        Delete
      </Button>
    </div>
  </Grid.Col>
}