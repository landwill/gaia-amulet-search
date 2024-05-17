import legendaryDiamondAmulet from '/amuletLegendaryDiamond.png'
import './App.css'
import { useReducer } from 'react'
import { HtmlEntryPanel } from './Home/HtmlEntryPanel.tsx'
import { DeletePage, HtmlDumpInfo, PageAction, SetPageHtml, SetPageNumber } from './interfaces.ts'
import ResultsScreen from './ResultsScreen/ResultsScreen.tsx'
import { extractAmuletsFromHtml, warnUserOfError } from './ResultsScreen/utils.ts'

const INITIAL_HTML_DUMPS_STATE: HtmlDumpInfo[] = [{ amulets: null, pageNumber: 1, deleted: false }]

const findFirstMissingPositive = (nums: number[]): number => {
  const seen: boolean[] = []
  for (const num of nums) {
    if (num > 0 && num <= nums.length) seen[num] = true
  }
  for (let i = 1; i <= nums.length + 1; i++) if (!seen[i]) return i
  return nums.length + 1
}

const isIndexedAction = (action: PageAction): action is SetPageNumber | SetPageHtml | DeletePage => {
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
      const amulets = extractAmuletsFromHtml(pageHtml, state[arrayIndex].pageNumber)
      newState[arrayIndex] = { ...newState[arrayIndex], amulets }
    } catch (error: unknown) {
      warnUserOfError(error, 'Failed to parse the pasted HTML.')
    }
  } else {
    const { arrayIndex, ...rest } = action
    newState[arrayIndex] = { ...newState[arrayIndex], ...rest }
    console.log(newState)
  }

  if (newState[newState.length - 1].amulets != null) {
    const maxPageNumber = findFirstMissingPositive(newState.filter(d => !d.deleted).map(d => d.pageNumber))
    newState.push({ pageNumber: maxPageNumber, amulets: null, deleted: false })
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
      <div>
        <h1>Amulet Search</h1>
        {
          htmlDumps.map((htmlDumpInfo: HtmlDumpInfo, index: number) =>
            htmlDumpInfo.deleted
              ? undefined
              : <HtmlEntryPanel key={index} dispatcher={setHtmlDump} arrayIndex={index} isHtmlPopulated={htmlDumpInfo.amulets != null}
                                initialPageNumber={htmlDumpInfo.pageNumber} />)
        }
        <div>
          <button style={{ marginRight: '6px' }} onClick={() => {setHtmlDump({ action: 'delete' })}}>
            Clear
          </button>
        </div>
        <p>
          Insert the HTML of a Trade page into the above and press submit.
        </p>
        <p style={{ color: '#999', pointerEvents: 'none' }}>Guide coming soon.</p>
      </div>
      <ResultsScreen inventoryHtml={htmlDumps} />
    </>
  )
}

export default Home
