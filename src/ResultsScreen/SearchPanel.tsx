import { MultiSelect, Select } from '@mantine/core'
import React from 'react'

export interface SearchState {
  rarities: string[] // todo try to improve typing
  shape: string | null
}

export const SearchPanel = ({ searchState, setSearchState }: {
  searchState: SearchState,
  setSearchState: React.Dispatch<React.SetStateAction<SearchState>>
}) => {
  return <>
    <div style={{ display: 'grid', justifyItems: 'center' }}>
      <MultiSelect label='Rarity'
                   placeholder='Filter by rarity'
                   data={['Legendary', 'Rare', 'Common']}
                   clearable
                   style={{ width: '260px', marginBottom: 8 }}
                   value={searchState.rarities}
                   onChange={newVal => setSearchState(prev => ({ ...prev, rarities: newVal }))} />
      <Select label='Shape'
              placeholder='Filter by shape'
              data={['Square', 'Diamond', 'Circle']}
              clearable
              style={{ width: '200px', marginBottom: 32 }}
              value={searchState.shape}
              onChange={newVal => setSearchState(prev => ({ ...prev, shape: newVal }))}
      />
    </div>
  </>
}