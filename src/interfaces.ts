export interface LocationState {
  inventory: HtmlDumpInfo[]
}

export interface HtmlDumpInfo {
  pageNumber: number
  pageHtml: string | null
  deleted: boolean
}

export interface Amulet {
  amuletName: string | null
  stats: Stat[]
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

export interface AmuletSummary {
  amuletName: string | null
  stats: Stat[]
  locations: AmuletLocation[]
}

export type AmuletTuple = [string, AmuletSummary]