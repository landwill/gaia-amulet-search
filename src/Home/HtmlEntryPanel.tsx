import { Button } from '@mantine/core'
import React from 'react'
import { PageAction } from '../interfaces.ts'

export const HtmlEntryPanel = ({ arrayIndex, dispatcher, pageNumber = 0 }: {
  dispatcher: React.Dispatch<PageAction>,
  arrayIndex: number,
  pageNumber: number
}) => {
  const isHtmlPopulated = pageNumber !== 0

  return <div style={{ display: 'flex', marginBottom: '0.75rem' }}>
    <input value={pageNumber !== 0 ? `Page ${String(pageNumber)} added successfully` : 'Paste HTML here'}
           readOnly
           disabled={isHtmlPopulated}
           onPaste={e => {
             e.preventDefault()
             if (isHtmlPopulated) return
             const pasted = e.clipboardData.getData('text/plain')
             dispatcher({ arrayIndex, pageHtml: pasted })
           }}
           style={{ marginRight: 12, borderWidth: '2px', borderRadius: '0.25rem', padding: '0.5rem', width: '14rem', height: '2.5rem' }}
    />
    <Button variant='danger' disabled={!isHtmlPopulated} onClick={e => {
      e.preventDefault()
      dispatcher({ arrayIndex, deleted: true })
    }}>
      Delete
    </Button>
  </div>
}