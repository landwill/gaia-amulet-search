import legendaryDiamondAmulet from '/amuletLegendaryDiamond.png'
import './App.css'
import { Button, Text, Title } from '@mantine/core'
import { ExternalLinkIcon } from 'lucide-react'
import { useReducer } from 'react'
import { HtmlEntryPanel } from './Home/HtmlEntryPanel.tsx'
import { DeletePage, HtmlDumpInfo, PageAction, SetAmuletsForPage } from './interfaces.ts'
import ResultsScreen from './ResultsScreen/ResultsScreen.tsx'

const INITIAL_HTML_DUMPS_STATE: HtmlDumpInfo[] = [{ amulets: null, deleted: false, pageNumber: 0 }]

const isIndexedAction = (action: PageAction): action is SetAmuletsForPage | DeletePage => {
  return 'arrayIndex' in action
}

const htmlDumpReducer = (state: HtmlDumpInfo[], action: PageAction) => {
  if ('action' in action) {
    return INITIAL_HTML_DUMPS_STATE
  }
  if (!isIndexedAction(action)) throw new Error('Bug; failed to return despite not being an indexed action.')

  const newState = [...state]
  if ('pageNumber' in action && 'amulets' in action) {
    const { arrayIndex, pageNumber, amulets } = action
    newState[arrayIndex] = { ...newState[arrayIndex], amulets, pageNumber }
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
  'Shareable (\'ghosting\') links, coming soon™️'
]

function Home() {
  const [htmlDumps, setHtmlDump] = useReducer(htmlDumpReducer, INITIAL_HTML_DUMPS_STATE)

  const hasSomethingToClear = htmlDumps.filter(d => !d.deleted && d.amulets != null).length > 0

  return (
    <>
      <img src={legendaryDiamondAmulet} alt='Legendary diamond amulet icon' className='logo'
           style={{ display: 'inline', height: '4rem', marginBottom: '2rem' }} />
      <div style={{ marginBottom: '2rem', alignItems: 'center', flexDirection: 'column', display: 'flex' }}>
        <Title order={1} style={{ fontSize: '3rem', marginBottom: '3rem', lineHeight: 1 }} opacity='0.8'>Amulet Search</Title>
        <div style={{ marginBottom: 12 }}>
          {
            htmlDumps.map((htmlDumpInfo: HtmlDumpInfo, index: number) =>
              htmlDumpInfo.deleted
                ? undefined
                : <HtmlEntryPanel key={index} dispatcher={setHtmlDump} arrayIndex={index} pageNumber={htmlDumpInfo.pageNumber} />)
          }
          <Button variant='danger' onClick={() => {setHtmlDump({ action: 'delete' })}} disabled={!hasSomethingToClear}>Clear all</Button>
        </div>
        <Text mt={12} mb={12}>
          Insert the HTML of a Trade page into a text field above, and your amulets will be displayed below.
        </Text>
        <Button component='a'
                href='https://github.com/landwill/gaia-amulet-search#readme'
                target='_blank'
                variant='outline'
                rightSection={<ExternalLinkIcon size='20' />}
                mb={12}>Click here for a guide</Button>
        {notices.map(notice => <span key={notice} style={{ pointerEvents: 'none', color: '#9CA3AF' }}>{notice}</span>)}
      </div>
      <ResultsScreen inventoryHtml={htmlDumps} />
    </>
  )
}

export default Home
