import { Button } from '@mantine/core'
import React from 'react'
import { HtmlDumpInfo, PageAction } from '../interfaces.ts'
import { HtmlEntryPanel } from './HtmlEntryPanel.tsx'

interface HtmlPasteListProps {
  pastedHtml: HtmlDumpInfo[]
  dispatcher: React.Dispatch<PageAction>
}

export const HtmlPasteList = ({ pastedHtml, dispatcher }: HtmlPasteListProps) => {
  const hasSomethingToClear = pastedHtml.filter(d => !d.deleted && d.amulets != null).length > 0

  return <div style={{ marginBottom: 12 }}>
    {
      pastedHtml.map((htmlDump: HtmlDumpInfo, index: number) =>
        !htmlDump.deleted &&
          <HtmlEntryPanel key={index} dispatcher={dispatcher} arrayIndex={index} pageNumber={htmlDump.pageNumber} />)
    }
    <Button variant='danger' onClick={() => {dispatcher({ action: 'delete' })}} disabled={!hasSomethingToClear}>Clear all</Button>
  </div>
}