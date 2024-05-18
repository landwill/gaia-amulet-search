import commonCircleAmulet from '/amuletCommonCircle.png'
import commonDiamondAmulet from '/amuletCommonDiamond.png'
import commonSquareAmulet from '/amuletCommonSquare.png'
import legendaryCircleAmulet from '/amuletLegendaryCircle.png'
import legendaryDiamondAmulet from '/amuletLegendaryDiamond.png'
import legendarySquareAmulet from '/amuletLegendarySquare.png'
import rareCircleAmulet from '/amuletRareCircle.png'
import rareDiamondAmulet from '/amuletRareDiamond.png'
import rareSquareAmulet from '/amuletRareSquare.png'
import { Amulet, Rarity, Shape, Stat } from '../interfaces.ts'

const parser = new DOMParser()

const stringToRarityMap = new Map<'Common' | 'Rare' | 'Legendary', Rarity>([
  ['Common', Rarity.Common],
  ['Rare', Rarity.Rare],
  ['Legendary', Rarity.Legendary]])

export const stringToRarity = (rarity: string): Rarity => {
  if (!isStringValidRarity(rarity)) throw new Error(`Unexpected rarity: ${rarity}`)
  const retVal = stringToRarityMap.get(rarity)
  if (retVal == null) throw new Error('Failed to map rarity to enum')
  return retVal
}

export function extractStats(amuletImageElement: HTMLImageElement): Stat[] {
  const statMatches = amuletImageElement.alt.matchAll(/\+(\d+)% ([\w ]+)\n/g)
  return [...statMatches].map(e => ({ statName: e[2], bonus: Number(e[1]) } satisfies Stat)).filter(s => !s.statName.match(/Experience vs/))
}

const isStringValidRarity = (key: string): key is 'Common' | 'Rare' | 'Legendary' => {
  return ['Common', 'Rare', 'Legendary'].includes(key)
}

export function extractAmuletDetails(amuletImageElement: HTMLImageElement, page: number): Amulet {
  const stats = extractStats(amuletImageElement)

  const amuletSpecs = amuletImageElement.alt.match(/^\[Kindred] (Rare|Legendary)? ?(Diamond|Circle|Square) Amulet\n/)
  if (!amuletSpecs) {
    throw new Error('Amulet rarity/shape not matched. See logs for more info.')
  } // todo indicate that an amulet is equipped (i.e. soulbound)
  if (amuletSpecs.length < 3) throw new Error('Failed to find rarity/shape')

  // false positive; index 1 of a RegExpMatchArray can indeed be null.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const amuletRarityString = amuletSpecs[1] ?? 'Common'

  if (!isStringValidRarity(amuletRarityString)) throw new Error(`Unexpected rarity: ${amuletRarityString}`)
  const rarity: Rarity = stringToRarity(amuletRarityString)
  const shape: Shape = amuletSpecs[2] as Shape
  return { stats, rarity, shape, location: { id: amuletImageElement.id, page } }
}

function isAmuletLI(listItem: Element) {
  return listItem instanceof HTMLLIElement && listItem.title.match(/(Circle|Square|Diamond) Amulet/)
}

const extractAmuletsFromTab = (tab: Element, pageNumber: number): Amulet[] => {
  const amulets: Amulet[] = []
  for (const child of tab.children) {
    if (child.tagName !== 'UL') continue
    for (const listItem of child.children) {
      if (!isAmuletLI(listItem)) continue
      const amuletImageElements = listItem.getElementsByTagName('img')
      if (amuletImageElements.length !== 1) continue
      const amuletImageElement = amuletImageElements[0]
      if (!(amuletImageElement instanceof HTMLImageElement)) continue
      const { stats, rarity, shape, location } = extractAmuletDetails(amuletImageElement, pageNumber)
      amulets.push({ rarity, shape, stats, location } satisfies Amulet)
    }
  }
  return amulets
}

function getPageNumber(parsedHtml: Document) {
  const kindredPageUlElement = parsedHtml.getElementById('kindred_pg')
  if (!kindredPageUlElement) throw new Error('Failed to identify the page number.')
  for (const pageLi of kindredPageUlElement.children) {
    if (!(pageLi instanceof HTMLLIElement)) continue
    const aTags = pageLi.getElementsByTagName('a')
    if (aTags.length === 1 && aTags[0].className === 'selected') {
      const pageNumberString = aTags[0].innerText
      return Number(pageNumberString)
    }
  }
  throw new Error('Page number not found')
}

export const extractAmuletsFromHtml = (html: string): { amulets: Amulet[], pageNumber: number } => {
  if (html === '') throw new Error()
  const parsedHtml = parser.parseFromString(html, 'text/html')
  const mainInventories = parsedHtml.getElementsByClassName('main-inventory')
  if (mainInventories.length === 0) throw new Error('Failed to identify the inventory.')

  const pageNumber = getPageNumber(parsedHtml)

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
  return { amulets, pageNumber }
}

export const amuletImageMap: Record<Shape, Record<Rarity, string>> = {
  Square: {
    [Rarity.Common]: commonSquareAmulet,
    [Rarity.Rare]: rareSquareAmulet,
    [Rarity.Legendary]: legendarySquareAmulet
  },
  Circle: {
    [Rarity.Common]: commonCircleAmulet,
    [Rarity.Rare]: rareCircleAmulet,
    [Rarity.Legendary]: legendaryCircleAmulet
  },
  Diamond: {
    [Rarity.Common]: commonDiamondAmulet,
    [Rarity.Rare]: rareDiamondAmulet,
    [Rarity.Legendary]: legendaryDiamondAmulet
  }
}

export const warnUser = (message: string) => {
  console.warn(message) // todo display in the UI
}

export const warnUserOfError = (error: unknown, prefixMessage: string | null = null) => {
  const messageParts = []
  if (prefixMessage) messageParts.push(prefixMessage)
  if (typeof error === 'object' && error != null && 'message' in error && typeof error.message === 'string') {
    messageParts.push(error.message)
  } else {
    messageParts.push('Cause unknown')
  }
  warnUser(messageParts.join(' '))
}

export function stringifyStats(stats: Stat[]): string {
  return stats.map(stringifyStat).join('|')
}

export function stringifyStat(s: Stat): string {
  return `${s.statName}_${String(s.bonus)}`
}