import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HtmlDumpInfo, LocationState } from './interfaces.ts'

interface Amulet {
  amuletName: string | null
  stats: string[]
  id: string
}

const parser = new DOMParser()

function extractAmuletDetails(amuletImageElement: HTMLImageElement) {
  const statMatches = amuletImageElement.alt.matchAll(/(\+.*)\n/g)
  const stats = [...statMatches].map(e => e[1])

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

  return <table>
    <thead>
    <tr>
      <th>Name</th>
      <th>Stats</th>
    </tr>
    </thead>
    <tbody>
    {amulets.map(a => {
      return <tr key={a.id} onClick={e => {
        e.preventDefault()
        navigator.clipboard.writeText(a.id).catch((r: unknown) => {console.log(r)})
      }}>
        <td>{a.amuletName ?? 'Name unknown'}</td>
        <td>{a.stats.map((stat, index) => <ul key={`${a.id}_${index.toString()}`}>{stat}</ul>)}</td>
      </tr>
    })}
    </tbody>
  </table>
}