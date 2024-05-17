import legendaryDiamondAmulet from '/amuletLegendaryDiamond.png'
import './App.css'
import React, { useReducer } from 'react'
import { Amulet, AmuletSummary, DeletePage, HtmlDumpInfo, PageAction, SetPageHtml, SetPageNumber, Stat } from './interfaces.ts'
import ResultsScreen from './ResultsScreen/ResultsScreen.tsx'
import { extractAmuletsFromHtml } from './ResultsScreen/utils.ts'

const INITIAL_HTML_DUMPS_STATE: HtmlDumpInfo[] = [{ amuletSummary: null, pageNumber: 1, deleted: false }]

const PageEntry = ({ arrayIndex, dispatcher, isHtmlPopulated = false, initialPageNumber = 1 }: {
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

function stringifyStats(stats: Stat[]): string {
  return stats.map(s => `${s.statName}_${String(s.bonus)}`).join('|')
}

function summarizeAmulets(amulets: Amulet[]): Map<string, AmuletSummary> {
  const amuletSummary = new Map<string, AmuletSummary>()
  for (const amulet of amulets) {
    const stringifiedStats = stringifyStats(amulet.stats)
    const key = `${String(amulet.rarity)}_${amulet.shape}_${stringifiedStats}`
    const existingSummary = amuletSummary.get(key)
    if (existingSummary != null) {
      existingSummary.locations.push(amulet.location)
    } else {
      amuletSummary.set(key, { rarity: amulet.rarity, shape: amulet.shape, locations: [amulet.location], stats: amulet.stats } satisfies AmuletSummary)
    }
  }

  return amuletSummary
}

const htmlDumpReducer = (state: HtmlDumpInfo[], action: PageAction) => {
  if ('action' in action) {
    return INITIAL_HTML_DUMPS_STATE
  }
  if (!isIndexedAction(action)) throw new Error('Bug; failed to return despite not being an indexed action.')

  const newState = [...state]
  if ('pageHtml' in action) {
    const { arrayIndex, pageHtml } = action
    const amulets = extractAmuletsFromHtml(pageHtml, state[arrayIndex].pageNumber)
    const amuletSummary = summarizeAmulets(amulets)
    newState[arrayIndex] = { ...newState[arrayIndex], amuletSummary }
  } else {
    const { arrayIndex, ...rest } = action
    newState[arrayIndex] = { ...newState[arrayIndex], ...rest }
  }

  if (newState[newState.length - 1].amuletSummary != null) {
    const maxPageNumber = findFirstMissingPositive(newState.filter(d => !d.deleted).map(d => d.pageNumber))
    newState.push({ pageNumber: maxPageNumber, amuletSummary: null, deleted: false })
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
              : <PageEntry key={index} dispatcher={setHtmlDump} arrayIndex={index} isHtmlPopulated={htmlDumpInfo.amuletSummary != null}
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
