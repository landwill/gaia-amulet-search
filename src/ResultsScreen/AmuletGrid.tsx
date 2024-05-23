import { Alert } from '@mantine/core'
import { AmuletSummary, AmuletTuple } from '../interfaces.ts'
import { AmuletCard } from './AmuletCard.tsx'

const largestStatSumSorter = ([, amuletA]: AmuletTuple, [, amuletB]: AmuletTuple): number => {
  if (amuletA.rarity !== amuletB.rarity) return amuletA.rarity - amuletB.rarity
  const sumA = [...amuletA.stats.values()].reduce((prev, curr) => prev + curr, 0)
  const sumB = [...amuletB.stats.values()].reduce((prev, curr) => prev + curr, 0)

  return sumA - sumB
}

export const AmuletGrid = ({ amuletTuples }: { amuletTuples: [string, AmuletSummary][] }) => {
  return <div style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginLeft: '-1.5rem',
      marginRight: '-1.5rem'
    }}>{
      amuletTuples.length
        ? amuletTuples.sort(largestStatSumSorter).reverse()
          .map(([id, amulet]) => <AmuletCard key={id} amulet={amulet} />)
        : <Alert>No amulets match this filter!</Alert>
    }
    </div>
}