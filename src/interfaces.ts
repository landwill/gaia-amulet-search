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

interface HtmlDumpActionBase {
  arrayIndex: number
}

export interface SetPageNumber extends HtmlDumpActionBase {
  pageNumber: number
}

export interface SetPageHtml extends HtmlDumpActionBase {
  pageHtml: string
}

export interface DeletePage extends HtmlDumpActionBase {
  deleted: true
}

interface DeleteDumps {
  action: 'delete'
}

export type PageAction = SetPageNumber | SetPageHtml | DeletePage | DeleteDumps