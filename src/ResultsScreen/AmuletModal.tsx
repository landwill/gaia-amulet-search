import { Modal, Text } from '@mantine/core'
import React from 'react'
import { AmuletSummary } from '../interfaces.ts'
import { AmuletLocationsList } from '../page_segments/AmuletLocationsList.tsx'
import { AmuletImage } from './AmuletImage.tsx'

interface AmuletModalProps {
  opened: boolean
  onClose: () => void
  title: string
  stats: React.JSX.Element[] | React.JSX.Element
  amulet: AmuletSummary
}

export function AmuletModal({ opened, onClose, title, stats, amulet }: AmuletModalProps) {
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
    <AmuletLocationsList locations={amulet.locations} />
  </Modal>
}