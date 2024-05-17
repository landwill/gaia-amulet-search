import { HtmlDumpInfo } from '../interfaces.ts'
import { AmuletGrid, summarizeAmulets } from './AmuletGrid.tsx'

export default function ResultsScreen({ inventoryHtml }: { inventoryHtml: HtmlDumpInfo[] | null }) {
  if (inventoryHtml == null || inventoryHtml.length === 0) return <div>No inventory data found.</div>

  const amulets = inventoryHtml.filter(dumpInfo => !dumpInfo.deleted).map(dumpInfo => dumpInfo.amulets)
    .filter((amulets): amulets is NonNullable<typeof amulets> => amulets != null)
    .flatMap(amuletSummary => Array.from(amuletSummary.values()))
  const amuletTuples = [...summarizeAmulets(amulets)]

  return <div style={{ display: 'flex', flexDirection: 'row', maxWidth: '1000px', flexWrap: 'wrap' }}>
    <AmuletGrid amuletTuples={amuletTuples} />
  </div>
}

