import Immutable from 'seamless-immutable'
export const REDUX_INIT = '@@redux/INIT'

export function simpleAction (action) {
  const actionObj = {
    get type () {
      return action
    }
  }
  return function () {
    return actionObj
  }
}

export const Actions = Immutable.from({
  CLICK_ITEM: 'frost-bucket/CLICK_ITEM',
  DOUBLE_CLICK_ITEM: 'frost-buckets/DOUBLE_CLICK_ITEM',
  SELECT_ITEM: 'frost-buckets/SELECT_ITEM',
  DESELECT_ITEM: 'frost-buckets/DESELECT_ITEM',
  HOVER_NEXT_ITEM: 'frost-buckets/HOVER_NEXT_ITEM',
  HOVER_PREV_ITEM: 'frost-buckets/HOVER_PREV_ITEM',
  CLEAR_HOVER: 'frost-buckets/CLEAR_HOVER',
  SELECT_HOVER: 'frost-buckets/SELECT_HOVER',
  RECEIVED_STATE: 'frost-buckets/RECEIVED_STATE'
})

export function clickItem (isSelectedItem, index) {
  return {
    type: Actions.CLICK_ITEM,
    isSelectedItem,
    index
  }
}

export function doubleClickItem (isSelectedItem, index) {
  return {
    type: Actions.DOUBLE_CLICK_ITEM,
    isSelectedItem,
    index
  }
}

export function selectItem (index) {
  return {
    type: Actions.SELECT_ITEM,
    index
  }
}


export function deselectItem (index) {
  return {
    type: Actions.DESELECT_ITEM,
    index
  }
}

export function receivedState (state) {
  return {
    type: Actions.RECEIVED_STATE,
    state
  }
}

export const hoverNextItem = simpleAction(Actions.HOVER_NEXT_ITEM)

export const hoverPrevItem = simpleAction(Actions.HOVER_PREV_ITEM)

export const clearHover = simpleAction(Actions.CLEAR_HOVER)

export const selectHover = simpleAction(Actions.SELECT_HOVER)

