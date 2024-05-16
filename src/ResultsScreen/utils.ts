import { Amulet, HtmlDumpInfo, Stat } from '../interfaces.ts'

const parser = new DOMParser()

export function extractStats(amuletImageElement: HTMLImageElement): Stat[] {
  const statMatches = amuletImageElement.alt.matchAll(/\+(\d+)% (\w+)\n/g)
  return [...statMatches].map(e => ({ statName: e[2], bonus: Number(e[1])} satisfies Stat))//.filter(s => !s.statName.match(/Experience vs/))
}

export function extractAmuletDetails(amuletImageElement: HTMLImageElement): Amulet {
  const stats = extractStats(amuletImageElement)

  const amuletNameMatch = amuletImageElement.alt.match(/^(.*)\n/)
  const amuletName: string | null = amuletNameMatch ? amuletNameMatch[1] : null
  return { stats, amuletName, id: amuletImageElement.id }
}

const extractAmuletsFromTab = (tab: Element): Amulet[] => {
  const amulets: Amulet[] = []
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

export function extractAmuletsFromHtmlDumps(inventoryHtml: HtmlDumpInfo[]): Amulet[] {
  const amulets = []
  for (const htmlDump of inventoryHtml.filter(d => !d.deleted)) {
    if (htmlDump.pageHtml == null) continue
    amulets.push(...extractAmuletsFromHtml(htmlDump.pageHtml))
  }
  return amulets
}