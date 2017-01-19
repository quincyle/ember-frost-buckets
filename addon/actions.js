import Immutable from 'seamless-immutable'
export const REDUX_INIT = '@@redux/INIT'

/**
 * @typedef {object} Action
 * @property {string} type The
 */

/**
 * Creates an action function with no parameters that produces an action with only the 'type' property
 *
 * @export
 * @param {Action} action The action type
 * @returns {function} A function that returns an action with only the 'type' property
 */
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
  RECEIVED_STATE: 'frost-buckets/RECEIVED_STATE',
  REORDER_ITEMS: 'frost-buckets/REORDER_ITEMS'
})

/**
 * Produces a click item action. Should be dispatched when the item is clicked.
 *
 * @export
 * @param {boolean} isSelectedItem True if the item is in the list of selected items
 * @param {number} index Index of the item that was clicked
 * @returns {Action} The click item action to dispatch
 */
export function clickItem (isSelectedItem, index) {
  return {
    type: Actions.CLICK_ITEM,
    isSelectedItem,
    index
  }
}

/**
 * Produces a double click item action. Should be dispatched when the item is double clicked.
 *
 * @export
 * @param {boolean} isSelectedItem True if the item is in the list of selected items
 * @param {number} index Index of the item that was double clicked
 * @returns {Action} The double click item action to dispatch
 */
export function doubleClickItem (isSelectedItem, index) {
  return {
    type: Actions.DOUBLE_CLICK_ITEM,
    isSelectedItem,
    index
  }
}

/**
 * Produces a select item action. Meant for moving an item from the non-selected list to
 * the selected list
 *
 * @export
 * @param {number} index Index of the item to select
 * @returns {Action} The select item action
 */
export function selectItem (index) {
  return {
    type: Actions.SELECT_ITEM,
    index
  }
}

/**
 * Produces a deselect item action. Meant for moving an item from the selected list to
 * the non-selected list
 *
 * @export
 * @param {number} index Index of the item to select
 * @returns {Action} The deselect item action
 */
export function deselectItem (index) {
  return {
    type: Actions.DESELECT_ITEM,
    index
  }
}

/**
 * Produces a received state action. Meant for updating the component's state from an external source.
 *
 * @export
 * @param {State} state Hash of state properties to update
 * @returns {Action} Recieved state action
 */
export function receivedState (state) {
  return {
    type: Actions.RECEIVED_STATE,
    state
  }
}

/**
 * Produces a reordered items action. Meant for changing the order of the selected items
 *
 * @export
 * @param {object[]} newOrder Array in the new order that
 * @param {object} item The item that was re-ordered
 * @returns {Action} Recieved state action
 */
export function reorderItems (newOrder, item) {
  return {
    type: Actions.REORDER_ITEMS,
    newOrder,
    item
  }
}

/**
 * Function for hover next item action
 *
 * @export
 * @returns {Action} Action with HOVER_NEXT_ITEM type
 */
export const hoverNextItem = simpleAction(Actions.HOVER_NEXT_ITEM)

/**
 * Function for hover previous item action
 *
 * @export
 * @returns {Action} Action with HOVER_PREV_ITEM type
 */
export const hoverPrevItem = simpleAction(Actions.HOVER_PREV_ITEM)

/**
 * Function for clear hover action
 *
 * @export
 * @returns {Action} Action with CLEAR_HOVER type
 */
export const clearHover = simpleAction(Actions.CLEAR_HOVER)

/**
 * Function for select hover action
 *
 * @export
 * @returns {Action} Action with SELECT_HOVER type
 */
export const selectHover = simpleAction(Actions.SELECT_HOVER)

