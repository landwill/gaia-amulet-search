export interface HtmlDumpInfo {
  amulets: Amulet[] | null
  pageNumber: number
  deleted: boolean
}

interface AmuletBaseInfo {
  shape: Shape
  rarity: Rarity
  stats: Stat[]
}

export interface Amulet extends AmuletBaseInfo {
  location: AmuletLocation
}

export interface Stat {
  statName: string
  bonus: number
}

export interface AmuletLocation {
  id: string
  page: number
}

export interface AmuletSummary extends AmuletBaseInfo {
  locations: AmuletLocation[]
}

export type AmuletTuple = [string, AmuletSummary]
export type Shape = 'Square' | 'Diamond' | 'Circle'

export enum Rarity {
  Common,
  Rare,
  Legendary
}

export interface SetAmuletsForPage {
  arrayIndex: number
  action: 'set-amulets'
  amulets: Amulet[]
  pageNumber: number
}

export interface DeletePage {
  arrayIndex: number | 'all'
  action: 'delete'
}

export type PageAction = SetAmuletsForPage | DeletePage