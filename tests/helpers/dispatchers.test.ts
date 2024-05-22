import { INITIAL_HTML_DUMPS_STATE, pastedHtmlReducer } from '../../src/helpers/dispatchers.ts'
import { HtmlDumpInfo, Rarity } from '../../src/interfaces.ts'

const NON_EMPTY_HTML_PASTE_STATE: HtmlDumpInfo[] = [
  {
    amulets: [{ stats: [], rarity: Rarity.Rare, shape: 'Square', location: { id: 'abc', page: 2 } }],
    pageNumber: 6
  }, {
    amulets: [{ stats: [], rarity: Rarity.Legendary, shape: 'Diamond', location: { id: 'def', page: 1 } }],
    pageNumber: 3
  }
]

describe('pastedHtmlReducer', () => {
  it('resets the state when called with action \'delete all\'', () => {
    // given
    expect(NON_EMPTY_HTML_PASTE_STATE).not.toStrictEqual(INITIAL_HTML_DUMPS_STATE) // else the test may be meaningless

    // when
    const returnedState = pastedHtmlReducer(NON_EMPTY_HTML_PASTE_STATE, { action: 'delete', arrayIndex: 'all' })

    // then
    expect(returnedState).toStrictEqual(INITIAL_HTML_DUMPS_STATE)
  })

  it('deletes a single page, when given the \'delete (page number\' action', () => {
    // given
    expect(NON_EMPTY_HTML_PASTE_STATE).not.toStrictEqual(INITIAL_HTML_DUMPS_STATE) // else the test may be meaningless
    const initialLength = NON_EMPTY_HTML_PASTE_STATE.length
    const indexToDelete = 1

    // when
    const returnedState = pastedHtmlReducer(NON_EMPTY_HTML_PASTE_STATE, { action: 'delete', arrayIndex: indexToDelete })

    // then
    expect(returnedState).not.toStrictEqual(NON_EMPTY_HTML_PASTE_STATE)
    expect(returnedState.length).not.toBe(initialLength)
  })
})