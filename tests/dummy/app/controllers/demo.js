import Ember from 'ember';

function stringifyValue (value) {
  return JSON.stringify(value, null, 2)
}

const templateString = `{{frost-buckets
  items=model.items
  titleAttr='label'
  subtitleAttr='description'
  valueAttr='id'
  onChange=(action 'onChange')
}}
`

export default Ember.Controller.extend({
  templateString,
  init () {
    this._super(...arguments)
    this.set('stringifiedValue', stringifyValue([]))
  },
  actions: {
    onChange (newVal) {
      this.set('stringifiedValue', stringifyValue(newVal))
    }
  }
})
