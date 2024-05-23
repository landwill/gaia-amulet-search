import { Amulet, Rarity, StatEnum } from '../../src/interfaces'

import { extractAmuletDetails, extractAmuletsFromHtml, extractStats } from '../../src/ResultsScreen/utils.ts'
import pageWithAmulets from './data/pageWithAmulets.json'

describe('extractStats', () => {
  it('extracts stats appropriately in ideal conditions', () => {
    const id = '123.456'
    const testAmuletImage = document.createElement('img')
    testAmuletImage.alt = `[Kindred] Rare Square Amulet\n+7% Damage\n`
    testAmuletImage.id = id

    const stats = extractStats(testAmuletImage)

    expect(stats.size).toBe(1)
    expect(stats.get(StatEnum.Damage)).toBe(7)
  })
})

describe('extractAmuletDetails', () => {
  it('extracts all info in ideal conditions', () => {
    const id = '123.456'
    const pageNumber = 6
    const location = { id, page: pageNumber }
    const rarity = Rarity.Rare
    const shape = 'Square'
    const expectedStats = new Map<StatEnum, number>([[StatEnum.Damage, 7]])
    const testAmuletImage = document.createElement('img')
    testAmuletImage.alt = `[Kindred] Rare Square Amulet\n+7% Damage\n`
    testAmuletImage.id = id

    const result = extractAmuletDetails(testAmuletImage, pageNumber)

    expect(result).toStrictEqual({ rarity, shape, location, stats: expectedStats } satisfies Amulet)
  })
})

describe('extractAmuletsFromHtml', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  it.skipIf(pageWithAmulets.skip).each([pageWithAmulets.content, '<!DOCTYPE html>' + String(pageWithAmulets.content)])('succeeds for valid & complete html', (html) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const { amulets, pageNumber } = extractAmuletsFromHtml(html)
    expect(Array.isArray(amulets)).toBeTruthy()
    expect(amulets).length(473)
    expect(pageNumber).toBe(2)
  })

  it('fails for doctype-only pastes', () => {
    const doctypeHtml = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
    const expectedErrorMessage = 'Pasted unexpected HTML; you probably pasted the <!DOCTYPE> element, but we need the element below it (beginning with \'<html...\').'
    expect(() => extractAmuletsFromHtml(doctypeHtml)).toThrowError(expectedErrorMessage)
  })

  it('fails for non-html pastes', () => {
    const doctypeHtml = 'test'
    const expectedErrorMessage = 'Pasted unexpected content; clipboard should start with \'<html\''
    expect(() => extractAmuletsFromHtml(doctypeHtml)).toThrowError(expectedErrorMessage)
  })
})