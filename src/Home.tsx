import legendaryDiamondAmulet from '/amuletLegendaryDiamond.png'
import './App.css'
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

function Home() {
  const [htmlDumps, setHtmlDump] = useReducer(htmlDumpReducer, INITIAL_HTML_DUMPS_STATE)

  return (
    <>
      <div>
        <img src={legendaryDiamondAmulet} className='logo' alt='Legendary diamond amulet icon' height='60px' />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
        <h1>Amulet Search</h1>
        {
          htmlDumps.map((htmlDumpInfo: HtmlDumpInfo, index: number) =>
            htmlDumpInfo.deleted
              ? undefined
              : <HtmlEntryPanel key={index} dispatcher={setHtmlDump} arrayIndex={index} pageNumber={htmlDumpInfo.pageNumber} />)
        }
        <div>
          <button style={{ marginRight: '6px' }} onClick={() => {setHtmlDump({ action: 'delete' })}}>
            Clear
          </button>
        </div>
        <p>
          Insert the HTML of a Trade page into a text field above, and your amulets will be displayed below.
        </p>
        <span style={{ color: '#999', pointerEvents: 'none' }}>Guide coming soon.</span>
        <span style={{ color: '#999', pointerEvents: 'none' }}>Searching/filtering coming soon.</span>
        <span style={{ color: '#999', pointerEvents: 'none' }}>Easier method than pasting HTML, coming soon.</span>
        <span style={{ color: '#999', pointerEvents: 'none' }}>Clicking results for their pages & IDs, coming soon.</span>
      </div>
      <ResultsScreen inventoryHtml={htmlDumps} />
    </>
  )
}

export default Home
