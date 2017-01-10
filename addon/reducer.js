import _ from 'lodash'
import {Actions, REDUX_INIT} from './actions'

export const INITIAL_STATE = {
  hoveredItem: null,
  selectedItems: [],
  nonSelectedItems: [],
  allItems: []
}

function selectItem (state, index) {
  const {nonSelectedItems, selectedItems} = state
  const item = nonSelectedItems[index]
  selectedItems.push(item)
  return {
    selectedItems,
    nonSelectedItems: _.without(nonSelectedItems, item)
  }
}

function deselectItem (state, index) {
  const {nonSelectedItems, selectedItems} = state
  const item = selectedItems[index]
  nonSelectedItems.push(item)
  return {
    selectedItems: _.without(selectedItems, item),
    nonSelectedItems
  }
}

function hoverItem (index, isSelected) {
  return {
    hoveredItem: {index, isSelected}
  }
}

function hoverNext (state) {
  const {hoveredItem} = state
  if (hoveredItem === null) {
    return state
  }
  const {index, isSelected} = hoveredItem
  const items = isSelected ? state.selectedItems : state.nonSelectedItems
  if (index > -1 && index < items.length - 1) {
    return hoverItem(index + 1, isSelected)
  }
  return state
}

function hoverPrev (state) {
  const {hoveredItem} = state
  if (hoveredItem === null) {
    return state
  }
  const {index, isSelected} = hoveredItem
  if (index > 0) {
    return hoverItem(index - 1, isSelected)
  }
  return state
}

export default function reducer (state, action) {
  let nextState
  switch (action.type) {
      case Actions.DOUBLE_CLICK_ITEM:
        nextState = {
          hoveredItem: null
        }
        if (action.isSelectedItem) {
          nextState = deselectItem(state, action.index)
        } else {
          nextState = selectItem(state, action.index)
        }
        break

      case Actions.CLICK_ITEM:
        nextState = hoverItem(action.index, action.isSelectedItem)
        break

      case Actions.HOVER_NEXT_ITEM:
        nextState = hoverNext(state)
        break

      case Actions.HOVER_PREV_ITEM:
        nextState = hoverPrev(state)
        break

      case Actions.CLEAR_HOVER:
        nextState = {hoveredItem: null}
        break

      case Actions.SELECT_ITEM:
        nextState = selectItem(state, action.index)
        break

      case Actions.DESELECT_ITEM:
        nextState = deselectItem(state, action.index)
        break

      case Actions.SELECT_HOVER:
        if (state.hoveredItem === null) {
          break
        }
        if (state.hoveredItem.isSelected) {
          nextState = deselectItem(state, state.hoveredItem.index)
          nextState.hoveredItem = null
        } else {
          nextState = selectItem(state, state.hoveredItem.index)
          nextState.hoveredItem = null
        }
        break

      case REDUX_INIT:
        break

      default:
        throw new Error(`Action ${action.type} unrecognized`)
  }

  return _.defaults(nextState, state)
}
