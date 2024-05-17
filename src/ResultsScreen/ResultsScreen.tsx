import commonCircleAmulet from '/amuletCommonCircle.png'
import commonDiamondAmulet from '/amuletCommonDiamond.png'
import commonSquareAmulet from '/amuletCommonSquare.png'
import legendaryDiamondAmulet from '/amuletLegendaryDiamond.png'
import legendarySquareAmulet from '/amuletLegendarySquare.png'
import rareCircleAmulet from '/amuletRareCircle.png'
import rareDiamondAmulet from '/amuletRareDiamond.png'
import rareSquareAmulet from '/amuletRareSquare.png'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Amulet, AmuletSummary, AmuletTuple, LocationState, Rarity, Shape, Stat } from '../interfaces.ts'
import { extractAmuletsFromHtmlDumps } from './utils.ts'

const amuletImageMap: Record<Shape, Record<Rarity, string>> = {
  Square: {
    [Rarity.Common]: commonSquareAmulet,
    [Rarity.Rare]: rareSquareAmulet,
    [Rarity.Legendary]: legendarySquareAmulet
  },
  Circle: {
    [Rarity.Common]: commonCircleAmulet,
    [Rarity.Rare]: rareCircleAmulet,
    [Rarity.Legendary]: 'legendaryCircleAmulet'
  },
  Diamond: {
    [Rarity.Common]: commonDiamondAmulet,
    [Rarity.Rare]: rareDiamondAmulet,
    [Rarity.Legendary]: legendaryDiamondAmulet
  }
}

const AmuletImage = ({ rarity, shape }: { rarity: Rarity, shape: Shape }) => {
  return <img src={amuletImageMap[shape][rarity]} alt={`${Rarity[rarity]} ${shape} amulet`} />
}

function stringifyStats(stats: Stat[]): string {
  return stats.map(s => `${s.statName}_${String(s.bonus)}`).join('|')
}

function summarizeAmulets(amulets: Amulet[]): Map<string, AmuletSummary> {
  const amuletSummary = new Map<string, AmuletSummary>()
  for (const amulet of amulets) {
    const stringifiedStats = stringifyStats(amulet.stats)
    const key = `${String(amulet.rarity)}_${amulet.shape}_${stringifiedStats}`
    const existingSummary = amuletSummary.get(key)
    if (existingSummary != null) {
      existingSummary.locations.push(amulet.location)
    } else {
      amuletSummary.set(key, { rarity: amulet.rarity, shape: amulet.shape, locations: [amulet.location], stats: amulet.stats } satisfies AmuletSummary)
    }
  }

  return amuletSummary
}

const largestStatSumSorter = ([, amuletA]: AmuletTuple, [, amuletB]: AmuletTuple): number => {
  if (amuletA.rarity !== amuletB.rarity) return amuletA.rarity - amuletB.rarity
  const sumA = amuletA.stats.reduce((prev, curr) => prev + curr.bonus, 0)
  const sumB = amuletB.stats.reduce((prev, curr) => prev + curr.bonus, 0)

  return sumA - sumB
}

export default function ResultsScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | undefined
  const inventoryHtml = state?.inventory ?? null

  useEffect(() => {
    if (inventoryHtml == null || inventoryHtml.length === 0) navigate('/')
    window.history.replaceState({}, document.title)
  }, [inventoryHtml, navigate])

  if (inventoryHtml == null || inventoryHtml.length === 0) return <div>No inventory data found.</div>

  const amulets = extractAmuletsFromHtmlDumps(inventoryHtml)
  const amuletSummary = summarizeAmulets(amulets)

  return <div style={{ display: 'flex', flexDirection: 'row', maxWidth: '1000px', flexWrap: 'wrap' }}>
    {[...amuletSummary].sort(largestStatSumSorter).reverse().map(([id, amulet]) => {
      const amuletNameParts = []
      if (amulet.rarity) amuletNameParts.push(Rarity[amulet.rarity])
      amuletNameParts.push(amulet.shape)
      amuletNameParts.push('Amulet')
      const amuletName = amuletNameParts.join(' ')

      return <div key={id}
                  style={{ border: '1px solid black', padding: '12px', margin: '6px', borderRadius: '12px', borderColor: 'lightgrey', width: '160px' }}>
        <AmuletImage rarity={amulet.rarity} shape={amulet.shape} /><br />
        <span style={{ fontWeight: 'bold' }}>{amuletName}</span><br />
        <div style={{ marginTop: 6, marginBottom: 6}}>
        {
          amulet.stats.length
            ? amulet.stats.map(stat => <span style={{ display: 'inline-block' }}
                                             key={`${stat.statName}_${String(stat.bonus)}`}>{`+${String(stat.bonus)}% ${stat.statName}`}</span>)
            : 'Experience vs [...]'
        }</div>
        {`Count: ${String(amulet.locations.length)}`}<br />
        {/*{amulet.locations.slice(0, 5).map(amuletLocation => <ul style={{ marginTop: 6, marginBottom: 6 }} key={amuletLocation.id} onClick={() => {*/}
        {/*  navigator.clipboard.writeText(amuletLocation.id).catch((r: unknown) => {console.error(r)})*/}
        {/*}}>...{amuletLocation.id.substring(amuletLocation.id.length - 10)} (Page {amuletLocation.page})</ul>)}*/}
      </div>
    })}
  </div>
}