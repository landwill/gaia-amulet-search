import { Rarity, Shape } from '../interfaces.ts'
import { AMULET_IMAGE_MAP } from './utils.ts'

const SIZE = 52

export const AmuletImage = ({ rarity, shape }: { rarity: Rarity, shape: Shape }) => {
  return <img style={{ display: 'inline' }} src={AMULET_IMAGE_MAP[shape][rarity]} alt={`${Rarity[rarity]} ${String(shape)} amulet`} height={SIZE} width={SIZE} />
}