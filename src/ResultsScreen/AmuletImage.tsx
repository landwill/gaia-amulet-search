import { Rarity, Shape } from '../interfaces.ts'
import { amuletImageMap } from './utils.ts'

const SIZE = 52

export const AmuletImage = ({ rarity, shape }: { rarity: Rarity, shape: Shape }) => {
  return <img style={{ display: 'inline' }} src={amuletImageMap[shape][rarity]} alt={`${Rarity[rarity]} ${shape} amulet`} height={SIZE} width={SIZE} />
}