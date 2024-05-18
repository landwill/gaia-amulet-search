import { NativeSelect, NumberInput } from '@mantine/core'
import React from 'react'

interface StatSearch {
  amount: number | ''
  stat: string
}

export interface SearchState {
  rarities: string[]
  shape: string | null
  stats: StatSearch[]
}

const statNames = [
  'Accuracy',
  'Damage',
  'Life',
  'Magic',
  'Platinum Find',
  'Stamina Regen',
  'Stamina',
  'Experience',
  'Resistance'
]

const updateStatAmountByIndex = (setSearchIndex: React.Dispatch<React.SetStateAction<SearchState>>, index: number, value: number | string) => {
  if (typeof value === 'string' && value !== '') throw new Error('A string value, which isn\'t empty, was somehow selected from the number selector.')
  setSearchIndex(prev => {
    const stats = prev.stats
    stats[index].amount = value
    return { ...prev, stats }
  })
}

const updateStatNameByIndex = (setSearchIndex: React.Dispatch<React.SetStateAction<SearchState>>, index: number, value: string) => {
  setSearchIndex(prev => {
    const stats = prev.stats
    stats[index].stat = value
    return { ...prev, stats }
  })
}

export const StatSelector = ({ statNumber, values, setSearchState }: {
  statNumber: number,
  values: StatSearch,
  setSearchState: React.Dispatch<React.SetStateAction<SearchState>>
}) => {
  const { amount, stat } = values

  const label = statNumber != null ? `Stat ${statNumber}` : 'Stat'
  const select = <NativeSelect data={statNames}
                               rightSectionWidth={28}
                               style={{ width: '100%' }}
                               value={stat}
                               onChange={newVal => {updateStatNameByIndex(setSearchState, statNumber - 1, newVal.target.value)}} />
  return <NumberInput min={0}
                      max={10}
                      suffix='%'
                      prefix='+'
                      placeholder='At least this much'
                      label={label}
                      rightSection={select}
                      rightSectionWidth={140}
                      style={{ marginBottom: 8, width: 280 }}
                      value={amount}
                      onChange={newVal => updateStatAmountByIndex(setSearchState, statNumber - 1, newVal)} />
}