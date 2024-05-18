import React, { Reducer, useReducer } from 'react'
import { Amulet, AmuletSummary, HtmlDumpInfo, Rarity, Shape, Stat } from '../interfaces.ts'
import { AmuletGrid } from './AmuletGrid.tsx'

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

interface StatRequirement {
  searchType: 'exact' | 'more'
  value: number
}

interface StatSearch {
  statName: string
  statRequirement: StatRequirement
}

interface SearchDetails {
  rarity: Rarity | null
  shape: Shape | null
  stats: StatSearch[] | null
}

interface SearchActionSetRarity {
  action: 'setRarity'
  rarity: Rarity | null
}

interface SearchActionSetShape {
  action: 'setShape'
  shape: Shape | null
}

type SearchAction = SearchActionSetRarity | SearchActionSetShape

const searchReducer: Reducer<any, any> = (prev: SearchDetails, action: SearchAction): SearchDetails => {
  console.log('Search action:', action)
  if (action.action === 'setRarity') return { ...prev, rarity: action.rarity }
  else if (action.action === 'setShape') return { ...prev, shape: action.shape }
  console.log('Action not yet implemented', action)
  return { ...prev }
}

const SearchPanel = ({ searchDispatcher }: { searchDispatcher: React.Dispatch<SearchAction> }) => {
  // const [statName, setStatName] = useState('')
  return <div>
    <div onChange={e => {
      const selectedRarity = e.target.value
      searchDispatcher({ action: 'setRarity', rarity: selectedRarity === '' ? null : selectedRarity })
    }}>
      {/*<textarea defaultValue='' onChange={e => {searchDispatcher({ setName: e.target.value })}}/>*/}
      <input type='radio' id='rarityAny' name='rarity' value='' />
      <label htmlFor='rarityCommon'>Any</label>
      <input type='radio' id='rarityLegendary' name='rarity' value={Rarity.Legendary} />
      <label htmlFor='rarityLegendary'>Legendary</label>
      <input type='radio' id='rarityRare' name='rarity' value={Rarity.Rare} />
      <label htmlFor='rarityRare'>Rare</label>
      <input type='radio' id='rarityCommon' name='rarity' value={Rarity.Common} />
      <label htmlFor='rarityCommon'>Common</label>
    </div>
    <div onChange={e => {
      const selectedShape = e.target.value
      searchDispatcher({ action: 'setShape', shape: selectedShape === '' ? null : selectedShape })
    }}>
      {/*<textarea defaultValue='' onChange={e => {searchDispatcher({ setName: e.target.value })}}/>*/}
      <input type='radio' id='shapeAny' name='shape' value='' />
      <label htmlFor='shapeAny'>Any</label>
      <input type='radio' id='shapeDiamond' name='shape' value='Diamond' />
      <label htmlFor='shapeDiamond'>Diamond</label>
      <input type='radio' id='shapeSquare' name='shape' value='Square' />
      <label htmlFor='shapeSquare'>Square</label>
      <input type='radio' id='shapeCircle' name='shape' value='Circle' />
      <label htmlFor='shapeCircle'>Circle</label>
    </div>
  </div>
}

const amuletSatisfiesFilter = (amulet: AmuletSummary, searchDetails: SearchDetails): boolean => {
  if (searchDetails.rarity && amulet.rarity != searchDetails.rarity) return false
  if (searchDetails.shape && amulet.shape != searchDetails.shape) {
    console.log(searchDetails.shape, amulet.shape)
    return false
  }
  return true
}

export default function ResultsScreen({ inventoryHtml }: { inventoryHtml: HtmlDumpInfo[] | null }) {
  const [searchDetails, dispatchSearch] = useReducer<(prev: SearchDetails, action: SearchAction) => SearchDetails>(searchReducer, {
    rarity: null,
    shape: null,
    stats: []
  })

  if (inventoryHtml == null || inventoryHtml.length === 0) return <div>No inventory data found.</div>

  const amulets = inventoryHtml.filter(dumpInfo => !dumpInfo.deleted).map(dumpInfo => dumpInfo.amulets)
    .filter((amulets): amulets is NonNullable<typeof amulets> => amulets != null)
    .flatMap(amuletSummary => Array.from(amuletSummary.values()))
  const amuletTuples = [...summarizeAmulets(amulets)]

  console.log('Search details:', searchDetails)

  return <>
    <SearchPanel searchDispatcher={dispatchSearch} />
    <div style={{ display: 'flex', flexDirection: 'row', maxWidth: '1000px', flexWrap: 'wrap' }}>
      <AmuletGrid amuletTuples={amuletTuples.filter(([_, amulet]) => amuletSatisfiesFilter(amulet, searchDetails))} />
    </div>
  </>
}

