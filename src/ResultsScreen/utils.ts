import { Amulet, HtmlDumpInfo, Stat } from '../interfaces.ts'

const parser = new DOMParser()

export function extractStats(amuletImageElement: HTMLImageElement): Stat[] {
  const statMatches = amuletImageElement.alt.matchAll(/\+(\d+)% (\w+)\n/g)
  return [...statMatches].map(e => ({ statName: e[2], bonus: Number(e[1]) } satisfies Stat))//.filter(s => !s.statName.match(/Experience vs/))
}

export function extractAmuletDetails(amuletImageElement: HTMLImageElement, page: number): Amulet {
  const stats = extractStats(amuletImageElement)

  const amuletNameMatch = amuletImageElement.alt.match(/^(.*)\n/)
  const amuletName: string | null = amuletNameMatch ? amuletNameMatch[1] : null
  return { stats, amuletName, location: { id: amuletImageElement.id, page } }
}

function isAmuletLI(listItem: Element) {
  return listItem instanceof HTMLLIElement && listItem.title.match(/Amulet/)
}

const extractAmuletsFromTab = (tab: Element, pageNumber: number): Amulet[] => {
  const amulets: Amulet[] = []
  for (const child of tab.children) {
    if (child.tagName !== 'UL') continue
    for (const listItem of child.children) {
      if (!isAmuletLI(listItem)) continue
      if (listItem.children.length !== 1) continue
      const amuletImageElement = listItem.children[0]
      if (!(amuletImageElement instanceof HTMLImageElement)) continue
      const { stats, amuletName, location } = extractAmuletDetails(amuletImageElement, pageNumber)
      amulets.push({ amuletName, stats, location } satisfies Amulet)
    }
  }
  return amulets
}
const extractAmuletsFromHtml = (html: string, pageNumber: number): Amulet[] => {
  if (html === '') throw new Error()
  const parsedHtml = parser.parseFromString(html, 'text/html')
  const mainInventories = parsedHtml.getElementsByClassName('main-inventory')
  if (mainInventories.length === 0) throw new Error('Failed to identify the inventory.')

  const amulets = []
  for (const inventory of mainInventories) {
    const inventoryTabs = inventory.children
    for (const tab of inventoryTabs) {
      if (['kindred'].includes(tab.id)) {
        const amuletsInTab = extractAmuletsFromTab(tab, pageNumber)
        amulets.push(...amuletsInTab)
      }
    }
  }
  return amulets
}

export function extractAmuletsFromHtmlDumps(inventoryHtml: HtmlDumpInfo[]): Amulet[] {
  const amulets = []
  for (const htmlDump of inventoryHtml.filter(d => !d.deleted)) {
    if (htmlDump.pageHtml == null) continue
    amulets.push(...extractAmuletsFromHtml(htmlDump.pageHtml, htmlDump.pageNumber))
  }
  return amulets
}