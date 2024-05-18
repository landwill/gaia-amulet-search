import { MultiSelect, Select } from '@mantine/core'
import React from 'react'
import { SearchState, StatSelector } from './StatSelector.tsx'

export const SearchPanel = ({ searchState, setSearchState }: {
  searchState: SearchState,
  setSearchState: React.Dispatch<React.SetStateAction<SearchState>>
}) => {
  return <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
    <div style={{ display: 'flex', flexDirection: 'column', justifyItems: 'center', marginRight: 32, alignItems: 'center' }}>
      <Select label='Shape'
              placeholder='Filter by shape'
              data={['Square', 'Diamond', 'Circle']}
              clearable
              style={{ width: '200px' }}
              value={searchState.shape}
              onChange={newVal => {setSearchState(prev => ({ ...prev, shape: newVal }))}}
      />
      <MultiSelect label='Rarity'
                   placeholder='Filter by rarity'
                   data={['Legendary', 'Rare', 'Common']}
                   clearable
                   style={{ width: '260px', marginBottom: 8 }}
                   value={searchState.rarities}
                   onChange={newVal => {setSearchState(prev => ({ ...prev, rarities: newVal }))}} />
    </div>
    <div style={{ marginBottom: 32 }}>
      <StatSelector statNumber={1} values={searchState.stats[0]} setSearchState={setSearchState} />
      <StatSelector statNumber={2} values={searchState.stats[1]} setSearchState={setSearchState} />
      <StatSelector statNumber={3} values={searchState.stats[2]} setSearchState={setSearchState} />
    </div>
  </div>
}