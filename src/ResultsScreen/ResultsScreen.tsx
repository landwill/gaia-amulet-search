import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Amulet, AmuletSummary, AmuletTuple, LocationState, Stat } from '../interfaces.ts'
import { extractAmuletsFromHtmlDumps } from './utils.ts'

function stringifyStats(stats: Stat[]): string {
  return stats.map(s => `${s.statName}_${String(s.bonus)}`).join('|')
}

function summarizeAmulets(amulets: Amulet[]): Map<string, AmuletSummary> {
  const amuletSummary = new Map<string, AmuletSummary>()
  for (const amulet of amulets) {
    const stringifiedStats = stringifyStats(amulet.stats)
    const key = `${amulet.amuletName ?? 'unknown'}_${stringifiedStats}`
    const existingSummary = amuletSummary.get(key)
    if (existingSummary != null) {
      existingSummary.ids.push(amulet.id)
    } else {
      amuletSummary.set(key, { amuletName: amulet.amuletName, ids: [amulet.id], stats: amulet.stats } satisfies AmuletSummary)
    }
  }

  return amuletSummary
}

const largestStatSumSorter = ([, amuletA]: AmuletTuple, [, amuletB]: AmuletTuple): number => {
  const sumA = amuletA.stats.reduce((prev, curr) => prev + curr.bonus, 0)
  const sumB = amuletB.stats.reduce((prev, curr) => prev + curr.bonus, 0)

  return sumA - sumB
}

export default function ResultsScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | undefined
  const inventoryHtml = state?.inventory ?? null

  useEffect(() => {
    if (inventoryHtml == null || inventoryHtml.length === 0) navigate('/')
    window.history.replaceState({}, document.title)
  }, [inventoryHtml, navigate])

  if (inventoryHtml == null || inventoryHtml.length === 0) return <div>No inventory data found.</div>

  const amulets = extractAmuletsFromHtmlDumps(inventoryHtml)
  const amuletSummary = summarizeAmulets(amulets)

  return <table>
    <thead>
    <tr>
      <th>Name</th>
      <th>Stats</th>
      <th>Page & ID</th>
    </tr>
    </thead>
    <tbody>
    {[...amuletSummary].sort(largestStatSumSorter).reverse().map(([id, summary]) => {
      return <tr key={id} onClick={e => {
        e.preventDefault()
      }}>
        <td>{summary.amuletName ?? 'Name unknown'}</td>
        <td>{summary.stats.length ? summary.stats.map(stat => <ul key={`${stat.statName}_${String(stat.bonus)}`}>{`+${String(stat.bonus)}% ${stat.statName}`}</ul>) : 'Experience vs [...]'}</td>
        <td>{summary.ids.slice(0, 5).map(id => <ul key={id} onClick={() => {
          navigator.clipboard.writeText(id).catch((r: unknown) => {console.error(r)})
        }}>{id}</ul>)}</td>
      </tr>
    })}
    </tbody>
  </table>
}