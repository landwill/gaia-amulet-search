import { describe, expect, it } from 'vitest'
import { Amulet, Rarity, Stat } from '../interfaces.ts'

import { extractAmuletDetails, extractStats } from './utils.ts'

describe('extractStats', () => {
  it('extracts stats appropriately in ideal conditions', () => {
    const id = '123.456'
    const testAmuletImage = document.createElement('img')
    testAmuletImage.alt = `[Kindred] Rare Square Amulet\n+7% Damage\n`
    testAmuletImage.id = id

    const stats = extractStats(testAmuletImage)

    expect(stats).toStrictEqual([{ statName: 'Damage', bonus: 7 } satisfies Stat])
  })
})

describe('extractAmuletDetails', () => {
  it('extracts all info in ideal conditions', () => {
    const id = '123.456'
    const pageNumber = 6
    const location = { id, page: pageNumber}
    const rarity = Rarity.Rare
    const shape = 'Square'
    const expectedStats: Stat[] = [{ statName: 'Damage', bonus: 7 }]
    const testAmuletImage = document.createElement('img')
    testAmuletImage.alt = `[Kindred] Rare Square Amulet\n+7% Damage\n`
    testAmuletImage.id = id

    const result = extractAmuletDetails(testAmuletImage, pageNumber)

    expect(result).toStrictEqual({ rarity, shape, location, stats: expectedStats } satisfies Amulet)
  })
})