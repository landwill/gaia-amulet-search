import { Button, Grid, Input } from '@mantine/core'
import React from 'react'
import { HtmlDumpInfo, PageAction } from '../interfaces.ts'
import { ExtractionError } from '../ResultsScreen/errors.ts'
import { extractAmuletsFromHtml, warnUser, warnUserOfError } from '../ResultsScreen/utils.ts'
import { HtmlEntryPanel } from './HtmlEntryPanel.tsx'

interface HtmlPasteListProps {
  pastedHtml: HtmlDumpInfo[]
  dispatcher: React.Dispatch<PageAction>
}

export const HtmlPasteList = ({ pastedHtml, dispatcher }: HtmlPasteListProps) => {
  const hasSomethingToClear = pastedHtml.filter(d => d.amulets != null).length > 0

  return <Grid justify='center' style={{ marginBottom: 12 }} mx='1.5rem' maw={{ xs: 300 }}>
    <Grid.Col span={12}>
      <Input value='Paste HTML here!'
             style={{ textAlignLast: 'center' }}
             onPaste={e => {
               e.preventDefault()
               const pasted = e.clipboardData.getData('text/plain')
               try {
                 const { amulets, pageNumber } = extractAmuletsFromHtml(pasted)
                 dispatcher({ action: 'push-amulets', amulets, pageNumber })
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
      />
    </Grid.Col>
    {
      pastedHtml.map((htmlDump: HtmlDumpInfo, index: number) =>
        <HtmlEntryPanel key={index} dispatcher={dispatcher} arrayIndex={index} pageNumber={htmlDump.pageNumber} />)
    }
    <Button variant='danger' mt={8} onClick={() => {dispatcher({ action: 'delete', arrayIndex: 'all' })}} disabled={!hasSomethingToClear}>Clear all</Button>
  </Grid>
}