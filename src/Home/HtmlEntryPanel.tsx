import React from 'react'
import { PageAction } from '../interfaces.ts'

export const HtmlEntryPanel = ({ arrayIndex, dispatcher, pageNumber = 0 }: {
  dispatcher: React.Dispatch<PageAction>,
  arrayIndex: number,
  pageNumber: number
}) => {
  const isHtmlPopulated = pageNumber !== 0

  return <div style={{ display: 'flex', marginBottom: 12 }}>
    <input value={pageNumber !== 0 ? `Page ${String(pageNumber)} added successfully` : 'Paste HTML here'}
           readOnly
           disabled={isHtmlPopulated}
           onPaste={e => {
             e.preventDefault()
             if (isHtmlPopulated) return
             const pasted = e.clipboardData.getData('text/plain')
             dispatcher({ arrayIndex, pageHtml: pasted })
           }}
           style={{ marginRight: 12 }}
    />
    <button disabled={!isHtmlPopulated} onClick={e => {
      e.preventDefault()
      dispatcher({ arrayIndex, deleted: true })
    }}>
      Delete
    </button>
  </div>
}