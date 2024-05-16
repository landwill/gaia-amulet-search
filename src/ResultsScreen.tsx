import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HtmlDumpInfo, LocationState } from './interfaces.ts'

interface Amulet {
  amuletName: string | null
  stats: string[]
  id: string
}

interface AmuletSummary {
  amuletName: string | null
  stats: string[]
  ids: string[]
}

const parser = new DOMParser()

function extractAmuletDetails(amuletImageElement: HTMLImageElement) {
  const statMatches = amuletImageElement.alt.matchAll(/(\+.*)\n/g)
  const stats = [...statMatches].map(e => e[1]).filter(s => !s.match(/Experience vs/))

  const amuletNameMatch = amuletImageElement.alt.match(/^(.*)\n/)
  const amuletName: string | null = amuletNameMatch ? amuletNameMatch[1] : null
  return { stats, amuletName, id: amuletImageElement.id }
}

const extractAmuletsFromTab = (tab: Element) => {
  const amulets = []
  for (const child of tab.children) {
    if (child.tagName !== 'UL') continue
    for (const amuletListItem of child.children) {
      if (amuletListItem.tagName !== 'LI') continue
      if (amuletListItem.children.length !== 1) continue
      const amuletImageElement = amuletListItem.children[0]
      if (!(amuletImageElement instanceof HTMLImageElement)) continue
      const { stats, amuletName, id } = extractAmuletDetails(amuletImageElement)
      amulets.push({ amuletName, stats, id } satisfies Amulet)
    }
  }
  return amulets
}

const extractAmuletsFromHtml = (html: string): Amulet[] => {
  if (html === '') throw new Error()
  const parsedHtml = parser.parseFromString(html, 'text/html')
  const mainInventories = parsedHtml.getElementsByClassName('main-inventory')
  if (mainInventories.length === 0) throw new Error('Failed to identify the inventory.')

  const amulets = []
  for (const inventory of mainInventories) {
    const inventoryTabs = inventory.children
    for (const tab of inventoryTabs) {
      if (['kindred'].includes(tab.id)) {
        const amuletsInTab = extractAmuletsFromTab(tab)
        amulets.push(...amuletsInTab)
      }
    }
  }
  return amulets
}

function extractAmuletsFromHtmlDumps(inventoryHtml: HtmlDumpInfo[]): Amulet[] {
  const amulets = []
  for (const htmlDump of inventoryHtml.filter(d => !d.deleted)) {
    if (htmlDump.pageHtml == null) continue
    amulets.push(...extractAmuletsFromHtml(htmlDump.pageHtml))
  }
  return amulets
}

function summarizeAmulets(amulets: Amulet[]): Map<string, AmuletSummary> {
  const amuletSummary = new Map<string, AmuletSummary>()
  for (const amulet of amulets) {
    const key = `${amulet.amuletName ?? 'unknown'}_${amulet.stats.join('|')}`
    const existingSummary = amuletSummary.get(key)
    if (existingSummary != null) {
      existingSummary.ids.push(amulet.id)
    } else {
      amuletSummary.set(key, { amuletName: amulet.amuletName, ids: [amulet.id], stats: amulet.stats } satisfies AmuletSummary)
    }
  }

  return amuletSummary
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
    {[...amuletSummary].map(([id, summary]) => {
      return <tr key={id} onClick={e => {
        e.preventDefault()
      }}>
        <td>{summary.amuletName ?? 'Name unknown'}</td>
        <td>{summary.stats.length ? summary.stats.map(stat => <ul key={stat}>{stat}</ul>) : 'Experience vs [...]'}</td>
        <td>{summary.ids.slice(0, 5).map(id => <ul key={id} onClick={() => {
          navigator.clipboard.writeText(id).catch((r: unknown) => {console.error(r)})
        }}>{id}</ul>)}</td>
      </tr>
    })}
    </tbody>
  </table>
}