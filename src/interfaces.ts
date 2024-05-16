export interface LocationState {
  inventory: HtmlDumpInfo[]
}

export interface HtmlDumpInfo {
  pageNumber: number
  pageHtml: string | null
  deleted: boolean
}
