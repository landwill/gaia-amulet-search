import { AmuletSummary, AmuletTuple } from '../interfaces.ts'
import { AmuletCard } from './AmuletCard.tsx'

const largestStatSumSorter = ([, amuletA]: AmuletTuple, [, amuletB]: AmuletTuple): number => {
  if (amuletA.rarity !== amuletB.rarity) return amuletA.rarity - amuletB.rarity
  const sumA = amuletA.stats.reduce((prev, curr) => prev + curr.bonus, 0)
  const sumB = amuletB.stats.reduce((prev, curr) => prev + curr.bonus, 0)

  return sumA - sumB
}

export const AmuletGrid = ({ amuletTuples }: { amuletTuples: [string, AmuletSummary][] }) => {
  return <div style={{ display: 'grid', justifyContent: 'center' }}>
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      maxWidth: '1000px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }}>{amuletTuples.sort(largestStatSumSorter).reverse()
      .map(([id, amulet]) => <AmuletCard key={id} amulet={amulet} />)}
    </div>
  </div>
}