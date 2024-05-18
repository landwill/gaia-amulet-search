import legendaryDiamondAmulet from '/amuletLegendaryDiamond.png'
import './App.css'
import { Button } from '@mantine/core'
import { useReducer } from 'react'
import { HtmlEntryPanel } from './Home/HtmlEntryPanel.tsx'
import { DeletePage, HtmlDumpInfo, PageAction, SetPageHtml } from './interfaces.ts'
import ResultsScreen from './ResultsScreen/ResultsScreen.tsx'
import { extractAmuletsFromHtml, warnUserOfError } from './ResultsScreen/utils.ts'

const INITIAL_HTML_DUMPS_STATE: HtmlDumpInfo[] = [{ amulets: null, deleted: false, pageNumber: 0 }]

const isIndexedAction = (action: PageAction): action is SetPageHtml | DeletePage => {
  return 'arrayIndex' in action
}

const htmlDumpReducer = (state: HtmlDumpInfo[], action: PageAction) => {
  if ('action' in action) {
    return INITIAL_HTML_DUMPS_STATE
  }
  if (!isIndexedAction(action)) throw new Error('Bug; failed to return despite not being an indexed action.')

  const newState = [...state]
  if ('pageHtml' in action) {
    const { arrayIndex, pageHtml } = action
    try {
      const { amulets, pageNumber } = extractAmuletsFromHtml(pageHtml)
      newState[arrayIndex] = { ...newState[arrayIndex], amulets, pageNumber }
    } catch (error: unknown) {
      warnUserOfError(error, 'Failed to parse the pasted HTML.')
    }
  } else {
    const { arrayIndex, ...rest } = action
    newState[arrayIndex] = { ...newState[arrayIndex], ...rest }
  }

  if (newState[newState.length - 1].amulets != null) {
    newState.push({ amulets: null, deleted: false, pageNumber: 0 })
  }
  return newState
}

const notices = [
  'Guide coming soon.',
  'Easier method than pasting HTML, coming soon.',
  'Clicking results for their pages & IDs, coming soon.',
  'Searching/filtering currently being enhanced.'
]

function Home() {
  const [htmlDumps, setHtmlDump] = useReducer(htmlDumpReducer, INITIAL_HTML_DUMPS_STATE)

  return (
    <>
      <img src={legendaryDiamondAmulet} alt='Legendary diamond amulet icon' className='logo'
           style={{ display: 'inline', height: '4rem', marginBottom: '2rem' }} />
      <div style={{ marginBottom: '2rem', alignItems: 'center', flexDirection: 'column', display: 'flex' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '3rem', lineHeight: 1 }}>Amulet Search</h1>
        <div style={{ marginBottom: 32 }}>
          {
            htmlDumps.map((htmlDumpInfo: HtmlDumpInfo, index: number) =>
              htmlDumpInfo.deleted
                ? undefined
                : <HtmlEntryPanel key={index} dispatcher={setHtmlDump} arrayIndex={index} pageNumber={htmlDumpInfo.pageNumber} />)
          }
          <Button variant='danger' onClick={() => {setHtmlDump({ action: 'delete' })}}>Clear all</Button>
        </div>
        <p style={{ marginBottom: '32px' }}>
          Insert the HTML of a Trade page into a text field above, and your amulets will be displayed below.
        </p>
        {notices.map(notice => <span style={{ pointerEvents: 'none', color: '#9CA3AF' }}>{notice}</span>)}
      </div>
      <ResultsScreen inventoryHtml={htmlDumps} />
    </>
  )
}

export default Home
