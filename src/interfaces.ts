export interface HtmlDumpInfo {
  amulets: Amulet[] | null
  pageNumber: number
}

export enum StatEnum {
  Accuracy,
  Damage,
  Life,
  Magic,
  'Platinum Find',
  'Stamina Regen',
  Stamina,
  Experience,
  Resistance,
  'Experience vs'
}

interface AmuletBaseInfo {
  shape: Shape
  rarity: Rarity
  stats: Map<StatEnum, number>
}

export interface Amulet extends AmuletBaseInfo {
  location: AmuletLocation
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

export interface DeletePage {
  action: 'delete'
  arrayIndex: number | 'all'
}

export interface PushAmuletPage {
  action: 'push-amulets'
  amulets: Amulet[]
  pageNumber: number
}

export type PageAction = DeletePage | PushAmuletPage