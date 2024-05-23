import commonCircleAmulet from '/amuletCommonCircle.png'
import commonDiamondAmulet from '/amuletCommonDiamond.png'
import commonSquareAmulet from '/amuletCommonSquare.png'
import legendaryCircleAmulet from '/amuletLegendaryCircle.png'
import legendaryDiamondAmulet from '/amuletLegendaryDiamond.png'
import legendarySquareAmulet from '/amuletLegendarySquare.png'
import rareCircleAmulet from '/amuletRareCircle.png'
import rareDiamondAmulet from '/amuletRareDiamond.png'
import rareSquareAmulet from '/amuletRareSquare.png'
import { notifications } from '@mantine/notifications'
import React from 'react'
import { Amulet, Rarity, Shape, StatEnum } from '../interfaces.ts'
import { ExtractionError } from './errors.ts'

const parser = new DOMParser()

const STRING_TO_RARITY_MAP = new Map<string, Rarity>([
  ['Common', Rarity.Common],
  ['Rare', Rarity.Rare],
  ['Legendary', Rarity.Legendary]])

export const AMULET_IMAGE_MAP: Record<Shape, Record<Rarity, string>> = {
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

export const stringToRarity = (rarity: string): Rarity => {
  const retVal = STRING_TO_RARITY_MAP.get(rarity)
  if (retVal == null) throw new Error(`Failed to map rarity ${rarity} to enum`)
  return retVal
}

export const stringToStatEnum = (str: string) => {
  if (str.startsWith('Experience vs')) return StatEnum['Experience vs']
  const retVal = StatEnum[str as keyof typeof StatEnum]
  if (retVal == null) throw new Error(`Failed to map ${str} to Stat`)
  return retVal
}

export function extractStats(amuletImageElement: HTMLImageElement): Map<StatEnum, number> {
  const stats = new Map<StatEnum, number>
  const statMatches = amuletImageElement.alt.matchAll(/\+(\d+)% ([\w ]+)\n/g)
  ;[...statMatches].map(([, bonus, statName]) => ({ stat: stringToStatEnum(statName), bonus }))
    .filter(s => s.stat != StatEnum['Experience vs'])
    .forEach(e => {stats.set(e.stat, Number(e.bonus))})
  return stats
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

export function getPageNumber(parsedHtml: Document) {
  const kindredPageUlElement = parsedHtml.getElementById('kindred_pg')
  if (!kindredPageUlElement) {
    // Since we've hopefully caught all "page is still loading" related issues, failing to find a page number
    // should imply that the user's inventory spans only a single page, thus we're on page one.
    return 1
  }
  for (const pageLi of kindredPageUlElement.getElementsByTagName('LI')) {
    const aTags = pageLi.getElementsByTagName('a')
    if (aTags.length === 1 && aTags[0].className === 'selected') {
      const pageNumberString = aTags[0].textContent
      return Number(pageNumberString)
    }
  }
  throw new Error('Page number not found')
}

function parseAndValidateHtml(html: string) {
  if (!html) throw new ExtractionError('Can\'t extract amulets from an empty clipboard.')
  if (!html.includes('<html')) {
    let errorMessage: string
    if (html.toLowerCase().includes('doctype')) {
      errorMessage = 'Pasted unexpected HTML; you probably pasted the <!DOCTYPE> element, but we need the element below it (beginning with \'<html...\').'
    } else {
      // noinspection HtmlRequiredLangAttribute
      errorMessage = 'Pasted unexpected content; clipboard should start with \'<html\'.'
    }
    throw new ExtractionError(errorMessage)
  }

  const parsedHtml = parser.parseFromString(html, 'text/html')
  const mainInventories = parsedHtml.getElementsByClassName('main-inventory')
  if (mainInventories.length === 0) throw new ExtractionError('Failed to identify the inventory.')
  if (mainInventories.length > 1) console.debug('Multiple \'main inventories\' found!')
  const kindredInventoryElement = parsedHtml.getElementById('kindred')
  if (kindredInventoryElement?.children.length === 2 && kindredInventoryElement.children[0].className === 'loader') throw new ExtractionError('Kindred tab hasn\'t been loaded. Please ensure that you clicked the Kindred tab in the trade window, and waited for it to load all items. Please also ensure that you used Developer Console instead of opening a new tab to \'view source\'.')
  if (mainInventories[0].className.includes('loading')) throw new ExtractionError('Inventory is loading. Please wait another moment before copying HTML, and ensure that your HTML viewer didn\'t open a new tab (i.e. please use the Developer Console).')

  const pageNumber = getPageNumber(parsedHtml)
  return { pageNumber, mainInventories }
}

export const extractAmuletsFromHtml = (html: string): { amulets: Amulet[], pageNumber: number } => {
  const { pageNumber, mainInventories } = parseAndValidateHtml(html)

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

export const warnUser = (message: string, id: string, title: React.ReactNode = 'Warning', warnConsole = true) => {
  notifications.show({
    id,
    color: 'orange',
    title,
    message,
    autoClose: 8000
  })
  if (warnConsole) console.warn(message)
}

export const warnUserOfError = (error: unknown, id: string, title: React.ReactNode = 'Warning') => {
  const messageParts = []
  if (typeof error === 'object' && error != null && 'message' in error && typeof error.message === 'string') {
    messageParts.push(error.message)
  } else {
    messageParts.push('Cause unknown')
  }
  warnUser(messageParts.join(' '), id, title)
}

export function stringifyStats(stats: Map<StatEnum, number>): string {
  return [...stats.entries()].map(stringifyStat).join('|')
}

export function stringifyStat(s: [StatEnum, number]): string {
  return `${String(s[0])}_${String(s[1])}`
}