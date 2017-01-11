import Ember from 'ember';
import layout from '../templates/components/frost-buckets'
import reducer, {INITIAL_STATE} from '../reducer'
import * as actions from '../actions'
import redux  from 'npm:redux'
const {createStore} = redux
import _ from 'lodash'

const actionDispatchers = _.chain(actions)
  .filter(_.isFunction)
  .map(function (action) {
    return function () {
      const store = this.get('redux-store')
      store.dispatch(action(...arguments))
    }
  })
  .value()

export default Ember.Component.extend({
  layout,

  init() {
    this._super(...arguments)
    const reduxStore = createStore(reducer, INITIAL_STATE)
    this.set('redux-store', reduxStore)
    reduxStore.subscribe(() => updateState())
  },

  updateState () {
    const state = this.get('redux-store').getState()
    this.set('redux-state', state)
  },

  actions: _.extend({

  }, actionDispatchers)
});
