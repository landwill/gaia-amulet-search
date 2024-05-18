import React from 'react'
import { StyledRadioGroup, StyledRadioOption } from '../components/StyledRadioGroup.tsx'
import { Rarity, Shape } from '../interfaces.ts'

export interface SearchState {
  rarity: Rarity | ''
  shape: Shape | ''
}

const shapes: StyledRadioOption<Shape | ''>[] = [
  { value: 'Diamond', label: 'Diamond' },
  { value: 'Square', label: 'Square' },
  { value: 'Circle', label: 'Circle' },
  { value: '', label: 'Any' }
]

const rarities: StyledRadioOption<Rarity | ''>[] = [
  { value: Rarity.Legendary, label: 'Legendary' },
  { value: Rarity.Rare, label: 'Rare' },
  { value: Rarity.Common, label: 'Common' },
  { value: '', label: 'Any' }
]

export const SearchPanel = ({ searchState, setSearchState }: {
  searchState: SearchState,
  setSearchState: React.Dispatch<React.SetStateAction<SearchState>>
}) => {
  return <>
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <StyledRadioGroup value={searchState.rarity}
                        onChange={newVal => setSearchState(prev => ({ ...prev, rarity: newVal }))}
                        radios={rarities}
                        style={{ marginRight: 24 }} />
      <StyledRadioGroup value={searchState.shape}
                        onChange={newVal => setSearchState(prev => ({ ...prev, shape: newVal }))}
                        radios={shapes} />
    </div>
    <p>Selected shape: {searchState.shape === '' ? 'None' : searchState.shape}</p>
    <p>Selected rarity: {searchState.rarity === '' ? 'None' : searchState.rarity}</p>
  </>
}