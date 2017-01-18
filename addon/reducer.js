import _ from 'lodash'
import {Actions, REDUX_INIT} from './actions'

export const INITIAL_STATE = {
  hoveredItem: null,
  selectedItems: [],
  nonSelectedItems: [],
  allItems: [],
  selectedChanged: false
}

function selectItem (state, index) {
  const {nonSelectedItems, selectedItems} = state
  const item = nonSelectedItems[index]
  selectedItems.push(item)
  return {
    selectedItems,
    nonSelectedItems: _.without(nonSelectedItems, item),
    selectedChanged: true
  }
}

function deselectItem (state, index) {
  const {nonSelectedItems, selectedItems} = state
  const item = selectedItems[index]
  nonSelectedItems.push(item)
  return {
    selectedItems: _.without(selectedItems, item),
    nonSelectedItems,
    selectedChanged: true
  }
}

function hoverItem (index, isSelected) {
  return {
    hoveredItem: {index, isSelected},
    selectedChanged: false
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

function hoveredOutOfBounds (hoveredItem, selectedItems, nonSelectedItems) {
  return hoveredItem.index < 0 ||
      (hoveredItem.isSelected && hoveredItem.index >= selectedItems.length) ||
      hoveredItem.index >= nonSelectedItems.length
}

function receiveState (state, newStateProps) {
  const nonSelectedItems = newStateProps.nonSelectedItems || state.nonSelectedItems
  const selectedItems = newStateProps.selectedItems || state.nonSelectedItems
  let hoveredItem = newStateProps.hoveredItem
  if (hoveredItem !== null && hoveredItem !== undefined) {
    if (hoveredOutOfBounds(hoveredItem, selectedItems, nonSelectedItems)) {
      hoveredItem = null
    }
  }
  return _.assign(newStateProps, {
    hoveredItem,
    selectedChanged: false
  })
}
const actionFunctions = {
  [Actions.DOUBLE_CLICK_ITEM] (state, action) {
    let nextState
    if (action.isSelectedItem) {
      nextState = deselectItem(state, action.index)
    } else {
      nextState = selectItem(state, action.index)
    }
    nextState.hoveredItem = null
    return nextState
  },
  [Actions.CLICK_ITEM] (state, action) {
    return hoverItem(action.index, action.isSelectedItem)
  },

  [Actions.HOVER_NEXT_ITEM]: hoverNext,

  [Actions.HOVER_PREV_ITEM]: hoverPrev,

  [Actions.CLEAR_HOVER] (state, action) {
    return {hoveredItem: null, selectedChanged: false}
  },

  [Actions.SELECT_ITEM] (state, action) {
    return selectItem(state, action.index)
  },

  [Actions.DESELECT_ITEM] (state, action) {
    return deselectItem(state, action.index)
  },

  [Actions.SELECT_HOVER] (state, action) {
    if (state.hoveredItem === null) {
      return state
    }
    let nextState
    if (state.hoveredItem.isSelected) {
      nextState = deselectItem(state, state.hoveredItem.index)
      nextState.hoveredItem = null
    } else {
      nextState = selectItem(state, state.hoveredItem.index)
      nextState.hoveredItem = null
    }
    return nextState
  },
  [Actions.RECEIVED_STATE] (state, action) {
    return receiveState(state, action.state)
  },

  [Actions.REORDER_ITEMS] (state, action) {
    return {
      hoveredItem: {
        index: _.findIndex(action.newOrder, action.item),
        isSelected: true
      },
      selectedItems: action.newOrder,
      selectedChanged: true
    }
  },
  [REDUX_INIT]: _.noop
}

export default function reducer (state, action) {
  const reducer = actionFunctions[action.type]
  if (reducer === undefined) {
    throw new Error(`Action ${action.type} unrecognized`)
  }

  return _.defaults(
    reducer(state, action),
    state
  )
}
