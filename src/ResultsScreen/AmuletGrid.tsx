import { AmuletSummary, AmuletTuple, Rarity } from '../interfaces.ts'
import { AmuletImage } from './AmuletImage.tsx'

const largestStatSumSorter = ([, amuletA]: AmuletTuple, [, amuletB]: AmuletTuple): number => {
  if (amuletA.rarity !== amuletB.rarity) return amuletA.rarity - amuletB.rarity
  const sumA = amuletA.stats.reduce((prev, curr) => prev + curr.bonus, 0)
  const sumB = amuletB.stats.reduce((prev, curr) => prev + curr.bonus, 0)

  return sumA - sumB
}

export const AmuletGrid = ({ amuletTuples }: { amuletTuples: [string, AmuletSummary][] }) => {
  return amuletTuples.sort(largestStatSumSorter).reverse()
    .map(([id, amulet]) => {
      const amuletNameParts = []
      if (amulet.rarity) amuletNameParts.push(Rarity[amulet.rarity])
      amuletNameParts.push(amulet.shape)
      amuletNameParts.push('Amulet')
      const amuletName = amuletNameParts.join(' ')

      return <div key={id}
                  style={{ border: '1px solid black', padding: '12px', margin: '6px', borderRadius: '12px', borderColor: 'lightgrey', width: '160px' }}>
        <AmuletImage rarity={amulet.rarity} shape={amulet.shape} /><br />
        <span style={{ fontWeight: 'bold' }}>{amuletName}</span><br />
        <div style={{ marginTop: 6, marginBottom: 6 }}>
          {
            amulet.stats.length
              ? amulet.stats.map(stat => <span style={{ display: 'inline-block' }}
                                               key={id}>{`+${String(stat.bonus)}% ${stat.statName}`}</span>)
              : 'Experience vs [...]'
          }</div>
        {`Count: ${String(amulet.locations.length)}`}<br />
        {/*{amulet.locations.slice(0, 5).map(amuletLocation => <ul style={{ marginTop: 6, marginBottom: 6 }} key={amuletLocation.id} onClick={() => {
            navigator.clipboard.writeText(amuletLocation.id).catch((r: unknown) => {console.error(r)})
          }}>...{amuletLocation.id.substring(amuletLocation.id.length - 10)} (Page {amuletLocation.page})</ul>)}*/}
      </div>
    })
}