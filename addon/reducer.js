import _ from 'lodash'
import {Actions, REDUX_INIT} from './actions'

/**
 * @typedef {object} Action
 * @property {string} type The type of action action
 */

/**
 * @typedef {object} HoverState
 * @property {number} index Index of the hovered item
 * @property {boolean} isSelected True if the hovered item is one of the selected list
 */

/**
 * @typedef {object} State
 * @property {HoverState} hoveredItem State information for a hovered item
 * @property {any[]} selectedItems Currently selected items
 * @property {any[]} nonSelectedItems Current items that are not selected
 * @property {any[]} allItems All available items
 * @property {any[]} selectedChanged Flag indicating the last action changed the selected list
 */

export const INITIAL_STATE = {
  hoveredItem: null,
  selectedItems: [],
  nonSelectedItems: [],
  allItems: [],
  selectedChanged: false
}

/**
 * Takes a non-selected item and moves it to the selected items list
 *
 * @param {State} state The current state
 * @param {number} index Index in the list of the item to be moved
 * @returns {State} The updated parts of the state
 */
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

/**
 * Takes a selected item and moves it to the non-selected items list
 *
 * @param {State} state The current state
 * @param {number} index Index in the list of the item to be moved
 * @returns {State} The updated parts of the state
 */
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

/**
 * Sets the hover state over an item specified by index
 *
 * @param {number} index Index of the hovered item
 * @param {boolean} isSelected True if the item we wish to hover is in the list of selected items
 * @returns {State} New state with the hovered item set
 */
function hoverItem (index, isSelected) {
  return {
    hoveredItem: {index, isSelected},
    selectedChanged: false
  }
}

/**
 * Sets the hovered item to the next item in the list if there is one
 *
 * @param {State} state Current state
 * @returns {State} State with the hovered item updated if there is a next item
 */
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

/**
 * Sets the hovered item to the previous item in the list if there is one
 *
 * @param {State} state Current state
 * @returns {State} State with the hovered item updated if there is a previous item
 */
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

/**
 * Determines if a desired hover state item is out of bounds
 *
 * @param {HoverState} hoveredItem The desired hovered item
 * @param {object[]} selectedItems The list of selected items
 * @param {object[]} nonSelectedItems The list of non-selected items
 * @returns {boolean} True if the desired hover state is out of the bounds of the specified array
 */
function hoveredOutOfBounds (hoveredItem, selectedItems, nonSelectedItems) {
  return hoveredItem.index < 0 ||
      (hoveredItem.isSelected && hoveredItem.index >= selectedItems.length) ||
      hoveredItem.index >= nonSelectedItems.length
}

/**
 * Sanitizes and updates state properties specified from an external source
 *
 * @param {State} state Current state
 * @param {State} newStateProps Hash of state properties to update
 * @returns {State} State with the specified properties updated
 */
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

// Individual handler functions for the actions associated with this reducer
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

/**
 * Reducer for the bucket component. Takes the current state and an action and produces
 * a new state
 *
 * @export
 * @param {State} state The current state
 * @param {Action} action The action we want to perform on the state
 * @returns {State} The next state for the component
 */
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
