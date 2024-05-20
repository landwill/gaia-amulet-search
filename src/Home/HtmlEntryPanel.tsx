/* eslint-disable @typescript-eslint/no-empty-function */
import { Button, Input } from '@mantine/core'
import React from 'react'
import { PageAction } from '../interfaces.ts'
import { extractAmuletsFromHtml, warnUserOfError } from '../ResultsScreen/utils.ts'

export const HtmlEntryPanel = ({ arrayIndex, dispatcher, pageNumber = 0 }: {
  dispatcher: React.Dispatch<PageAction>,
  arrayIndex: number,
  pageNumber: number
}) => {
  const isHtmlPopulated = pageNumber !== 0

  return <div style={{ display: 'flex', marginBottom: '0.75rem' }}>
    <Input value={pageNumber !== 0 ? `Page ${String(pageNumber)} added successfully` : 'Paste HTML here'}
           disabled={isHtmlPopulated}
           onPaste={e => {
             e.preventDefault()
             if (isHtmlPopulated) return
             const pasted = e.clipboardData.getData('text/plain')
             try {
               const { amulets, pageNumber } = extractAmuletsFromHtml(pasted)
               dispatcher({ arrayIndex, amulets, pageNumber })
             } catch (error: unknown) {
               warnUserOfError(error, 'paste-error', 'This typically means incorrect/invalid HTML was pasted.', 'Issue reading HTML')
             }
           }}
           onChange={() => {}} // mute the console warning. We don't want readOnly because it prevents right-click pasting in some(?) browsers
           style={{ width: '12rem', marginRight: 8 }}
    />
    <Button variant='danger' disabled={!isHtmlPopulated} onClick={e => {
      e.preventDefault()
      dispatcher({ arrayIndex, deleted: true })
    }}>
      Delete
    </Button>
  </div>
}