import { Text } from '@mantine/core'
import { AmuletLocation } from '../interfaces.ts'

const groupByPage = (locations: AmuletLocation[]): Map<number, AmuletLocation[]> => {
  return locations.reduce((acc: Map<number, AmuletLocation[]>, location) => {
    const existingLocations = acc.get(location.page)
    if (existingLocations == null) {
      acc.set(location.page, [location])
    } else {
      existingLocations.push(location)
    }
    return acc
  }, new Map<number, AmuletLocation[]>())
}

interface AmuletLocationsListProps {
  locations: AmuletLocation[]
}

export const AmuletLocationsList = ({ locations }: AmuletLocationsListProps) => {
  const groupedLocations = groupByPage(locations)

  return <>
    {Array.from(groupedLocations.entries()).map(([page, locations]) => {
      return <div key={page} style={{ marginTop: 6, marginBottom: 6 }}>
        <Text>Page {page}</Text>
        {locations.map((location) => (
          <ul
            key={location.id}
            style={{ marginTop: 6, marginBottom: 6, cursor: 'pointer' }}
            onClick={() => {
              navigator.clipboard.writeText(location.id).catch((r: unknown) => {
                console.error(r)
              })
            }}
          >
            <Text size='xs' truncate>{location.id}</Text>
          </ul>
        ))}
      </div>
    })}
  </>
}