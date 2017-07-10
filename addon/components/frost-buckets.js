import Ember from 'ember'
const {Component} = Ember
import * as actions from '../actions'
import reducer, {INITIAL_STATE} from '../reducer'
import layout from '../templates/components/frost-buckets'
import PropTypesMixin, {PropTypes} from 'ember-prop-types'
const {createStore} = redux
import _ from 'lodash'
import redux from 'redux'

const actionDispatchers = _.chain(actions)
  .toPairs()
  .filter(([key, value]) => _.isFunction(value))
  .map(function ([key, action]) {
    return [key, function () {
      const store = this.get('redux-store')
      store.dispatch(action(...arguments))
    }]
  })
  .fromPairs()
  .value()

/**
 * Removes selected items from the list of all items
 *
 * @param {any[]} items List of all available items
 * @param {any[]} selectedItems List of selected items
 * @returns {any[]} The list of items that are not selected
 */
function removeSelectedItems (items, selectedItems) {
  return _.reject(items, (item) => {
    return _.some(selectedItems, (selectedItem) => {
      return _.isEqual(item, selectedItem)
    })
  })
}

/**
 * Calculates a value for the widget based on the selected list of items and a value key, if one is available
 *
 * @param {State} state Current redux state of the component
 * @param {any[]} state.selectedItems List of items that are currently selected
 * @param {string} state.valueAttr Key to use to get values
 * @returns {any[]} A list of values based on the provided key
 */
function valueFromState ({selectedItems, valueAttr}) {
  if (valueAttr === undefined) {
    return selectedItems
  }
  return _.map(selectedItems, valueAttr)
}

export default Component.extend(PropTypesMixin, {
  layout,
  classNames: ['frost-buckets'],
  // == PropTypes =============================================================

  /**
   * Properties for this component. Options are expected to be (potentially)
   * passed in to the component. State properties are *not* expected to be
   * passed in/overwritten.
   */
  propTypes: {
    // options
    titleAttr: PropTypes.string,
    subtitleAttr: PropTypes.string,
    valueAttr: PropTypes.string,
    onChange: PropTypes.func,
    // state
    items: PropTypes.array.isRequired,
    selectedItems: PropTypes.array
  },

  init () {
    this._super(...arguments)
    const selectedItems = this.get('selectedItems')
    const reduxStore = createStore(reducer, _.defaults({
      nonSelectedItems: removeSelectedItems(this.get('items'), selectedItems),
      selectedItems,
      titleAttr: this.get('titleAttr'),
      subtitleAttr: this.get('subtitleAttr'),
      valueAttr: this.get('valueAttr')
    },
      INITIAL_STATE
    ))
    this.set('redux-store', reduxStore)
    const state = this.get('redux-store').getState()
    this.set('redux-state', state)
    reduxStore.subscribe(() => this.updateState())
  },

  didReceiveAttrs () {
    const stateAttrs = [
      'items',
      'selectedItems',
      'hoveredItem',
      'titleAttr',
      'subtitleAttr',
      'valueAttr'
    ]
    const newState = _.chain(stateAttrs)
      .map((attrName) => {
        const val = this.get(attrName)
        if (val !== undefined) {
          return [attrName, val]
        }
      })
      .filter()
      .fromPairs()
      .value()

    newState.nonSelectedItems = removeSelectedItems(newState.items, newState.selectedItems)
    delete newState.items
    this.get('redux-store').dispatch(actions.receivedState(newState))
  },

  updateState () {
    const state = this.get('redux-store').getState()
    this.set('redux-state', state)
    const onChange = this.get('onChange')
    if (state.selectedChanged && onChange) {
      onChange(valueFromState(state))
    }
  },

  actions: _.assign({}, actionDispatchers)
})
