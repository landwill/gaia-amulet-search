import { useState } from 'react'
import { Amulet, AmuletSummary, HtmlDumpInfo, Rarity } from '../interfaces.ts'
import { AmuletGrid } from './AmuletGrid.tsx'
import { SearchPanel } from './SearchPanel.tsx'
import { SearchState } from './StatSelector.tsx'
import { stringifyStats } from './utils.ts'

const NUM_AMULET_FILTERS = 3

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
  if (searchState.rarities.length !== 0 && !searchState.rarities.includes(Rarity[amulet.rarity])) return false
  // noinspection RedundantIfStatementJS
  if (searchState.shape != null && amulet.shape != searchState.shape) return false
  for (let i = 0; i < NUM_AMULET_FILTERS; i++) {
    if (searchState.stats[i].amount !== '') {
      const requiredStat = searchState.stats[i]
      if (requiredStat.amount === '') throw new Error('Assertion considering the above if-clause')
      const currentStat = amulet.stats.find(s => s.statName === requiredStat.stat)
      if (currentStat == undefined || currentStat.bonus < requiredStat.amount) return false
    }
  }

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
  const [searchState, setSearchState] = useState<SearchState>({ rarities: [], shape: null, stats: [{amount: '', stat: 'Accuracy'},{amount: '', stat: 'Accuracy'},{amount: '', stat: 'Accuracy'}] })

  if (inventoryHtml == null || inventoryHtml.length === 0) return <div>No inventory data found.</div>

  const amuletTuples = mapAndFilterAmuletTuples(inventoryHtml)

  return <div>
    <SearchPanel searchState={searchState} setSearchState={setSearchState} />
    <div style={{ display: 'flex', flexDirection: 'row', maxWidth: '1000px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <AmuletGrid amuletTuples={amuletTuples.filter(([, amulet]) => amuletSatisfiesFilter(amulet, searchState))} />
    </div>
  </div>
}

