/* eslint-disable @typescript-eslint/no-empty-function */
import { Button, Grid, Input } from '@mantine/core'
import React from 'react'
import { getRandomizedAmulets } from '../helpers/amuletRandomizer.ts'
import { HtmlDumpInfo, PageAction } from '../interfaces.ts'
import { ExtractionError } from '../ResultsScreen/errors.ts'
import { extractAmuletsFromHtml, warnUser, warnUserOfError } from '../ResultsScreen/utils.ts'
import { HtmlEntryPanel } from './HtmlEntryPanel.tsx'

interface HtmlPasteListProps {
  pastedHtml: HtmlDumpInfo[]
  dispatcher: React.Dispatch<PageAction>
}

const generateSampleData = (dispatcher: React.Dispatch<PageAction>, pageNumber: number) => {
  dispatcher({ action: 'push-amulets', amulets: getRandomizedAmulets(pageNumber), pageNumber })
}

export const HtmlPasteList = ({ pastedHtml, dispatcher }: HtmlPasteListProps) => {
  const hasSomethingToClear = pastedHtml.filter(d => d.amulets != null).length > 0

  return <Grid justify='center' style={{ marginBottom: 12 }} mx='1.5rem' maw={{ xs: 300 }}>
    <Grid.Col span={12}>
      <Input value='Paste HTML here, or...'
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
             onChange={() => {}} // mute the console warning. We don't want readOnly because it prevents right-click pasting in some/all browsers
      />
    </Grid.Col>
    {
      pastedHtml.map((htmlDump: HtmlDumpInfo, index: number) =>
        <HtmlEntryPanel key={index} dispatcher={dispatcher} arrayIndex={index} pageNumber={htmlDump.pageNumber} />)
    }
    <div style={{ marginTop: 8 }}>
      <Button variant='danger' mr={16} onClick={() => {dispatcher({ action: 'delete', arrayIndex: 'all' })}} disabled={!hasSomethingToClear}>Clear all</Button>
      <Button variant='outline' onClick={() => {generateSampleData(dispatcher, pastedHtml.length + 1 )}}>...play with sample data</Button>
    </div>
  </Grid>
}