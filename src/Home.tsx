import legendaryDiamondAmulet from '/amuletLegendaryDiamond.png'
import './App.css'
import React, { useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import { HtmlDumpInfo, LocationState } from './interfaces.ts'

const INITIAL_HTML_DUMPS_STATE = [{ pageHtml: null, pageNumber: 1, deleted: false }]

interface HtmlDumpActionBase {
  arrayIndex: number
}

interface SetPageNumber extends HtmlDumpActionBase {
  pageNumber: number
}

interface SetPageHtml extends HtmlDumpActionBase {
  pageHtml: string
}

interface DeletePage extends HtmlDumpActionBase {
  deleted: true
}

interface DeleteDumps {
  action: 'delete'
}

type PageAction = SetPageNumber | SetPageHtml | DeletePage | DeleteDumps

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
             console.debug('Pasted!')
           }}
    />
    <input type='number' id='pageNumber' min={1} max={999} defaultValue={initialPageNumber}
           onChange={e => {
             dispatcher({ arrayIndex, pageNumber: e.target.value as unknown as number })
           }} />
    <button disabled={!isHtmlPopulated} onClick={e => {
      e.preventDefault()
      dispatcher({ arrayIndex, deleted: true })
    }}>Delete</button>
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

const isIndexedAction = (action: any): action is SetPageNumber => {
  return 'arrayIndex' in action;
}

const htmlDumpReducer = (state: HtmlDumpInfo[], action: PageAction) => {
  if ('action' in action) {
    return INITIAL_HTML_DUMPS_STATE
  }
  if (!isIndexedAction(action)) throw new Error('Bug; failed to return despite not being an indexed action.')

  const newState = [...state]
  const { arrayIndex, ...rest } = action
  newState[arrayIndex] = { ...newState[arrayIndex], ...rest }

  console.debug(`(Index: ${arrayIndex.toString()}) Updated field:`, rest)

  if (newState[newState.length - 1].pageHtml != null) {
    const maxPageNumber = findFirstMissingPositive(newState.filter(d => !d.deleted).map(d => d.pageNumber))
    console.log('Creating new page with pageNumber', maxPageNumber)
    newState.push({ pageNumber: maxPageNumber, pageHtml: null, deleted: false })
  }
  return newState
}

function Home() {
  const [htmlDumps, setHtmlDump] = useReducer(htmlDumpReducer, INITIAL_HTML_DUMPS_STATE)

  const navigate = useNavigate()
  console.log(htmlDumps)

  return (
    <>
      <div>
        <img src={legendaryDiamondAmulet} className='logo' alt='Legendary diamond amulet icon' height='60px' />
      </div>
      <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={e => {
        e.preventDefault()
        const state: LocationState = { inventory: htmlDumps }
        navigate('/search', { state })
        console.log('todo') // todo
      }}>
        <h1>Amulet Search</h1>
        {
          htmlDumps.map((htmlDumpInfo: HtmlDumpInfo, index: number) =>
            htmlDumpInfo.deleted ? undefined : <PageEntry key={index} dispatcher={setHtmlDump} arrayIndex={index} isHtmlPopulated={htmlDumpInfo.pageHtml != null} initialPageNumber={htmlDumpInfo.pageNumber} />)
        }
        {/*<textarea style={{ marginBottom: '1em', height: '100px', resize: 'none' }} value={textAreaText} onChange={e => {setTextAreaText(e.target.value)}} />*/}
        <div>
          <button style={{ marginRight: '6px' }} onClick={() => {setHtmlDump({ action: 'delete' })}}>
            Clear
          </button>
          <button type='submit'>
            Submit
          </button>
        </div>
        <p>
          Insert the HTML of a Trade page into the above and press submit.
        </p>
        <p style={{ color: '#999', cursor: 'not-allowed', pointerEvents: 'none' }}>Click here for a guide.</p>
      </form>
    </>
  )
}

export default Home
