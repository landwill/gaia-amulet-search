import { v4 as uuid } from 'uuid'
import { RARITY_STAT_COUNTS_MAP } from '../consts.ts'
import { Amulet, AmuletLocation, Rarity, Shape, Stat } from '../interfaces.ts'

const SHAPES: Shape[] = ['Circle', 'Square', 'Diamond']

const SAMPLE_AMULET_COUNT = 100

const getRandomShape = (): Shape => {

  return SHAPES[Math.floor(Math.random() * SHAPES.length)]
}

const getRandomRarity = (): Rarity => {
  const random = Math.random()
  if (random > 0.9) return Rarity.Legendary
  if (random > 0.4) return Rarity.Rare
  return Rarity.Common
}

const allowedStatsForShape = new Map<Shape, string[]>([
  ['Circle', ['Experience', 'Life', 'Resistance', 'Experience vs']],
  ['Square', ['Accuracy', 'Damage', 'Magic', 'Experience vs']],
  ['Diamond', ['Platinum Find', 'Stamina', 'Stamina Regen', 'Experience vs']]
])

const getRandomStatName = (shape: Shape): string => {
  const allowedStats = allowedStatsForShape.get(shape)
  if (allowedStats == null) throw new Error(`Failed to map shape ${shape} to its allowed stat names.`)
  return allowedStats[Math.floor(Math.random() * allowedStats.length)]
}

const getAllowedBonus = new Map<Rarity, { min: number, max: number }>([
  [Rarity.Legendary, { min: 7, max: 10 }],
  [Rarity.Rare, { min: 4, max: 7 }],
  [Rarity.Common, { min: 1, max: 4 }]
])

const getRandomizedStats = (rarity: Rarity, shape: Shape): Stat[] => {
  const stats: Stat[] = []
  const numStats = RARITY_STAT_COUNTS_MAP.get(rarity)
  if (numStats == null) throw new Error(`Failed to map rarity ${String(rarity)} to a number of allowed stats.`)
  for (let i = 0; i < numStats; i++) {
    const allowedBonus = getAllowedBonus.get(rarity)
    if (allowedBonus == null) throw new Error(`Failed to find allowedBonus for rarity ${String(rarity)}`)
    const bonus = Math.floor(Math.random() * (allowedBonus.max - allowedBonus.min + 1)) + allowedBonus.min
    const statName = getRandomStatName(shape)
    if (statName === 'Experience vs') continue // filtered away during extraction. Nobody likes this stat; it's noise.
    stats.push({ statName, bonus })
  }
  return stats
}

export const getRandomizedAmulets = (page: number): Amulet[] => {
  const amulets: Amulet[] = []
  for (let i = 0; i < SAMPLE_AMULET_COUNT; i++) {
    const shape = getRandomShape()
    const rarity = getRandomRarity()
    const id: string = uuid()
    const location: AmuletLocation = { page, id }
    const stats: Stat[] = getRandomizedStats(rarity, shape)
    amulets.push({ shape, rarity, location, stats })
  }
  return amulets
}