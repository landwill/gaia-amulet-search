import { Card, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { AmuletSummary, Rarity, StatEnum } from '../interfaces.ts'
import { AmuletImage } from './AmuletImage.tsx'
import { AmuletModal } from './AmuletModal.tsx'
import { stringifyStats } from './utils.ts'

function getAmuletName(amulet: AmuletSummary) {
  const amuletNameParts = []
  if (amulet.rarity) amuletNameParts.push(Rarity[amulet.rarity])
  amuletNameParts.push(amulet.shape)
  amuletNameParts.push('Amulet')
  return amuletNameParts.join(' ')
}

export const AmuletCard = ({ amulet }: { amulet: AmuletSummary }) => {
  const [opened, { open, close }] = useDisclosure(false)

  const amuletName = getAmuletName(amulet)

  const stats = amulet.stats.size
    ? [...amulet.stats.entries()].map(([statName, bonus]) =>
      <div key={statName}>
        <Text size='xs' c='dimmed' ta='center'>{StatEnum[statName]}</Text>
        <Text fw={500} size='sm' ta='center'>{`+${String(bonus)}%`}</Text>
      </div>)
    : <Text size='xs'>Experience vs ...</Text>

  return <>
    <AmuletModal opened={opened} onClose={close} title={amuletName} stats={stats} amulet={amulet} />
    <Card withBorder key={`${amuletName}_${stringifyStats(amulet.stats)}`} style={{ margin: '6px', width: '180px', cursor: 'pointer' }} onClick={open}>
      <Card.Section pt='md'>
        <AmuletImage rarity={amulet.rarity} shape={amulet.shape} />
      </Card.Section>
      <Card.Section pl='md' pr='md'>
        <Text style={{ fontSize: 'medium', fontWeight: 700 }}>{amuletName}</Text>
      </Card.Section>
      <Card.Section mb='auto'>
        <div style={{
          marginTop: 6,
          paddingTop: 6,
          borderTop: '1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-5))'
        }}>
          {stats}
        </div>
      </Card.Section>
      <Text size='sm' c='dimmed' mt='sm'>Quantity: {String(amulet.locations.length)}</Text>
    </Card>
  </>
}