import Ember from 'ember';
import layout from '../templates/components/frost-buckets'
import reducer, {INITIAL_STATE} from '../reducer'
import * as actions from '../actions'
import redux  from 'npm:redux'
const {createStore} = redux
import _ from 'lodash'
import PropTypes from 'ember-prop-types'

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

function removeSelectedItems (items, selectedItems) {
  return _.reject(items, (item) => {
    return _.some(selectedItems, (selectedItem) => {
      return _.isEqual(item, selectedItem)
    })
  })
}

export default Ember.Component.extend({
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
    valueAttr: PropTypes.string
    // state
  },

  init() {
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

  updateState () {
    const state = this.get('redux-store').getState()
    this.set('redux-state', state)
  },

  onChange () {

  },

  actions: _.assign({}, actionDispatchers)
});
