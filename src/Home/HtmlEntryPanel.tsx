import React from 'react'
import { PageAction } from '../interfaces.ts'

export const HtmlEntryPanel = ({ arrayIndex, dispatcher, isHtmlPopulated = false, initialPageNumber = 1 }: {
  dispatcher: React.Dispatch<PageAction>,
  arrayIndex: number,
  isHtmlPopulated?: boolean
  initialPageNumber?: number
}) => {
  return <div>
    <input value={isHtmlPopulated ? 'Page added successfully' : 'Paste HTML here'}
           readOnly
           disabled={isHtmlPopulated}
           onPaste={e => {
             e.preventDefault()
             if (isHtmlPopulated) return
             const pasted = e.clipboardData.getData('text/plain')
             dispatcher({ arrayIndex, pageHtml: pasted }) // todo remove page 1
           }}
    />
    <input type='number' id='pageNumber' min={1} max={999} defaultValue={initialPageNumber}
           onChange={e => {
             dispatcher({ arrayIndex, pageNumber: e.target.value as unknown as number })
           }} />
    <button disabled={!isHtmlPopulated} onClick={e => {
      e.preventDefault()
      dispatcher({ arrayIndex, deleted: true })
    }}>
      Delete
    </button>
  </div>
}