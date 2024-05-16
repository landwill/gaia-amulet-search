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
  id: string
}

export interface Stat {
  statName: string
  bonus: number
}