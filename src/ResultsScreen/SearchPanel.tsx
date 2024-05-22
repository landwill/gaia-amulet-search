import { Grid, MultiSelect, Select } from '@mantine/core'
import React from 'react'
import { FIELD_MARGIN_BOTTOM } from '../consts.ts'
import { SearchState, StatSelector } from './StatSelector.tsx'

const SPAN_RULES = {
  base: 12,
  xs: 6,
  md: 4,
  lg: 3
}

export const SearchPanel = ({ searchState, setSearchState }: {
  searchState: SearchState,
  setSearchState: React.Dispatch<React.SetStateAction<SearchState>>
}) => {
  return <>
    <Grid justify='center' mb={24}>
      <Grid.Col span={SPAN_RULES} py={0}>
        <Select label='Shape'
                placeholder='Filter by shape'
                data={['Square', 'Diamond', 'Circle']}
                clearable
                value={searchState.shape}
                mb={FIELD_MARGIN_BOTTOM}
                onChange={newVal => {setSearchState(prev => ({ ...prev, shape: newVal }))}}
        />
        <MultiSelect label='Rarity'
                     placeholder='Filter by rarity'
                     data={['Legendary', 'Rare', 'Common']}
                     clearable
                     value={searchState.rarities}
                     mb={FIELD_MARGIN_BOTTOM}
                     onChange={newVal => {setSearchState(prev => ({ ...prev, rarities: newVal }))}}
        />
      </Grid.Col>
      <Grid.Col span={SPAN_RULES} py={0}>
        {Array.from([1, 2, 3]).map(statSelectorNum => {
          return <StatSelector key={statSelectorNum} statNumber={statSelectorNum} values={searchState.stats[statSelectorNum - 1]} setSearchState={setSearchState} />
        })}
      </Grid.Col>
    </Grid>
  </>
}