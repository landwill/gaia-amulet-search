import { HtmlDumpInfo } from '../interfaces.ts'
import { AmuletGrid, summarizeAmulets } from './AmuletGrid.tsx'

export default function ResultsScreen({ inventoryHtml }: { inventoryHtml: HtmlDumpInfo[] | null }) {
  if (inventoryHtml == null || inventoryHtml.length === 0) return <div>No inventory data found.</div>

  const amulets = inventoryHtml.map(dumpInfo => dumpInfo.amulets)
    .filter((amulets): amulets is NonNullable<typeof amulets> => amulets != null)
    .filter((amuletSummary): amuletSummary is NonNullable<typeof amuletSummary> => amuletSummary != null)
    .flatMap(amuletSummary => Array.from(amuletSummary.values()))
    // .flatMap(amuletSummary => Array.from(amuletSummary.entries()))
  const amuletTuples = [...summarizeAmulets(amulets)]

  return <div style={{ display: 'flex', flexDirection: 'row', maxWidth: '1000px', flexWrap: 'wrap' }}>
    <AmuletGrid amuletTuples={amuletTuples} />
  </div>
}

