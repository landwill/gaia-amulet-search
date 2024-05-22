import { Modal, Text } from '@mantine/core'
import React from 'react'
import { AmuletLocation, AmuletSummary } from '../interfaces.ts'
import { AmuletImage } from './AmuletImage.tsx'

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

export function AmuletModal({ opened, onClose, title, stats, amulet }: {
  opened: boolean,
  onClose: () => void,
  title: string,
  stats: React.JSX.Element[] | React.JSX.Element,
  amulet: AmuletSummary
}) {
  const groupedLocations = groupByPage(amulet.locations)

  return <Modal opened={opened} onClose={onClose} title={title} styles={{ title: { fontWeight: 'bold', textAlign: 'center' } }} centered>
    <div style={{ textAlign: 'center' }}><AmuletImage rarity={amulet.rarity} shape={amulet.shape} /></div>
    <div style={{
      marginTop: 6,
      paddingTop: 6,
      marginBottom: 6,
      paddingBottom: 12,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderBottom: '1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5))'
    }}>
      {stats}
    </div>
    <Text>Inventory locations</Text>
    <Text size='sm' c='dimmed'>Click any ID to copy it to the clipboard.</Text>
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
  </Modal>
}