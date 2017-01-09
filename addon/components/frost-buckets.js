import Ember from 'ember';
import layout from '../templates/components/frost-buckets'
// import {reducer} from 'npm:bucket-duck'
import {createStore} from 'npm:redux'

export default Ember.Component.extend({
  layout,

  init() {
    this._super(...arguments)
    //this.set('redux-store', createStore(duck, duck.INITIAL_STATE))
    console.log(BB)
  },

  actions: {

  }
});
