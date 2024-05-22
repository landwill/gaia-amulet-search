import { HtmlDumpInfo, PageAction } from '../interfaces.ts'

export const INITIAL_HTML_DUMPS_STATE: HtmlDumpInfo[] = []

export const pastedHtmlReducer = (state: HtmlDumpInfo[], dispatchedAction: PageAction) => {
  const { action } = dispatchedAction
  const newState = [...state]

  if (action === 'push-amulets') {
    const { amulets, pageNumber } = dispatchedAction
    newState.push({ amulets, pageNumber })
  } else if (action === 'delete') {
    const { arrayIndex } = dispatchedAction
    if (arrayIndex === 'all') return INITIAL_HTML_DUMPS_STATE
    newState.splice(arrayIndex, 1)
  } else {
    throw new Error(`Unexpected action: ${action}`)
  }

  return newState
}