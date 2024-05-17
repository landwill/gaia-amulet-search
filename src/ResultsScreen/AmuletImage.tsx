import { Rarity, Shape } from '../interfaces.ts'
import { amuletImageMap } from './utils.ts'

export const AmuletImage = ({ rarity, shape }: { rarity: Rarity, shape: Shape }) => {
  return <img src={amuletImageMap[shape][rarity]} alt={`${Rarity[rarity]} ${shape} amulet`} />
}