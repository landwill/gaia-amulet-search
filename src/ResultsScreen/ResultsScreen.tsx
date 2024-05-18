import { useState } from 'react'
import { Amulet, AmuletSummary, HtmlDumpInfo } from '../interfaces.ts'
import { AmuletGrid, stringifyStats } from './AmuletGrid.tsx'
import { SearchPanel, SearchState } from './SearchPanel.tsx'

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

const amuletSatisfiesFilter = (amulet: AmuletSummary, searchState: SearchState): boolean => {
  if (searchState.rarity !== '' && amulet.rarity != searchState.rarity) return false
  // noinspection RedundantIfStatementJS
  if (searchState.shape !== '' && amulet.shape != searchState.shape) return false

  return true
}

function mapAndFilterAmuletTuples(inventoryHtml: HtmlDumpInfo[]) {
  const amulets = inventoryHtml.filter(dumpInfo => !dumpInfo.deleted)
    .map(dumpInfo => dumpInfo.amulets)
    .filter((amulets): amulets is NonNullable<typeof amulets> => amulets != null)
    .flatMap(amuletSummary => Array.from(amuletSummary.values()))
  return [...summarizeAmulets(amulets)]
}

export default function ResultsScreen({ inventoryHtml }: { inventoryHtml: HtmlDumpInfo[] | null }) {
  const [searchState, setSearchState] = useState<SearchState>({ rarity: '', shape: '' })

  if (inventoryHtml == null || inventoryHtml.length === 0) return <div>No inventory data found.</div>

  const amuletTuples = mapAndFilterAmuletTuples(inventoryHtml)

  return <>
    <SearchPanel searchState={searchState} setSearchState={setSearchState} />
    <div style={{ display: 'flex', flexDirection: 'row', maxWidth: '1000px', flexWrap: 'wrap' }}>
      <AmuletGrid amuletTuples={amuletTuples.filter(([_, amulet]) => amuletSatisfiesFilter(amulet, searchState))} />
    </div>
  </>
}

