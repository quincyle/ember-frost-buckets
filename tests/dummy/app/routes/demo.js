import Ember from 'ember'
import _ from 'lodash'

function generateDummyItems (firstIndex, numberOfItems) {
    const range = _.range(firstIndex, firstIndex + numberOfItems)
    return _.map(range, (index) => {
        return {
            label: 'Item ' + index,
            description: 'Description for item ' + index,
            id: 'item' + index
        }
    })
}

export default Ember.Route.extend({
  model () {
    const items = generateDummyItems(1, 10)
    return {
      items,
      titleAttr: 'label',
      subtitleAttr: 'description',
      valueAttr: 'id',
      stringifiedItems: JSON.stringify(items, null, 2)
    }
  }
})
