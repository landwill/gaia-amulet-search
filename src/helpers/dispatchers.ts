import { HtmlDumpInfo, PageAction } from '../interfaces.ts'

export const INITIAL_HTML_DUMPS_STATE: HtmlDumpInfo[] = [{ amulets: null, deleted: false, pageNumber: 0 }]

export const pastedHtmlReducer = (state: HtmlDumpInfo[], dispatchedAction: PageAction) => {
  const { action, arrayIndex } = dispatchedAction
  const newState = [...state]

  if (action === 'delete') {
    // early return; deleting all so returning the empty/initial list
    if (arrayIndex === 'all') return INITIAL_HTML_DUMPS_STATE

    newState[arrayIndex] = { ...newState[arrayIndex], deleted: true }
  } else if (action === 'set-amulets') {
    const { pageNumber, amulets } = dispatchedAction
    newState[arrayIndex] = { ...newState[arrayIndex], amulets, pageNumber }
  } else {
    throw new Error(`Unexpected action: ${action}`)
  }

  if (newState[newState.length - 1].amulets != null) {
    newState.push({ amulets: null, deleted: false, pageNumber: 0 })
  }
  return newState
}