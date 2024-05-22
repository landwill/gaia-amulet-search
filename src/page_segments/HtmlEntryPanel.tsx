import { Button, Input } from '@mantine/core'
import React from 'react'
import { PageAction } from '../interfaces.ts'
import { ExtractionError } from '../ResultsScreen/errors.ts'
import { extractAmuletsFromHtml, warnUser, warnUserOfError } from '../ResultsScreen/utils.ts'

interface HtmlEntryPanelProps {
  dispatcher: React.Dispatch<PageAction>
  arrayIndex: number
  pageNumber: number
}

export const HtmlEntryPanel = ({ arrayIndex, dispatcher, pageNumber = 0 }: HtmlEntryPanelProps) => {
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
               dispatcher({ action: 'set-amulets', arrayIndex, amulets, pageNumber })
             } catch (error: unknown) {
               if (error instanceof ExtractionError) {
                 warnUserOfError(error, pasted, 'Issue reading HTML')
               } else {
                 console.error(error)
                 warnUser('See the developer console for more info, and please consider raising a bug report.', 'paste-error', 'Something went wrong', false)
               }
             }
           }}
           onChange={() => {}} // mute the console warning. We don't want readOnly because it prevents right-click pasting in some(?) browsers
           style={{ width: '12rem', marginRight: 8 }}
    />
    <Button variant='danger' disabled={!isHtmlPopulated} onClick={e => {
      e.preventDefault()
      dispatcher({ action: 'delete', arrayIndex })
    }}>
      Delete
    </Button>
  </div>
}