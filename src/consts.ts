import { Rarity } from './interfaces.ts'

export const FIELD_MARGIN_BOTTOM = 6

export const STAT_NAMES = [
  'Accuracy',
  'Damage',
  'Life',
  'Magic',
  'Platinum Find',
  'Stamina Regen',
  'Stamina',
  'Experience',
  'Resistance'
]

export const RARITY_STAT_COUNTS_MAP = new Map<Rarity, number>([[Rarity.Legendary, 3], [Rarity.Rare, 2], [Rarity.Common, 1]])