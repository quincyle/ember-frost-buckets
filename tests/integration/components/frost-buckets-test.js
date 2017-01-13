import {expect} from 'chai'
import {$hook} from 'ember-hook'
import {
  setupComponentTest,
  it
} from 'ember-mocha'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {describe} from 'mocha'
import {integration} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'
import {generateDummyItems} from 'dummy/tests/helpers/reducer-helpers'

const HOVERED_CLASS = 'frost-hovered-bucket-item'

const test = integration('frost-buckets')

describe(test.label, function () {
  test.setup()
  it('renders', function () {
    this.render(hbs`
      {{frost-buckets}}
    `)
    expect(this.$('')).to.have.length(1)
  })

  describe('clicking an item', function () {
    beforeEach(function () {
      this.setProperties({
        items: generateDummyItems(1, 1),
        titleAttr: 'title',
        subtitleAtrr: 'subtitle',
        valueAttr: 'id'
      })
      this.render(hbs`
        {{frost-buckets
          items=items
          titleAttr=titleAttr
          subtitleAtrr=subtitleAtrr
          valueAttr=valueAttr
        }}
      `)
    })
    it('hovers the item', function () {
      const $item = $hook('nonSelectedItem', {index: 0})
      $item.click()
      return wait().then(() => {
        const $item = $hook('nonSelectedItem', {index: 0})
        expect($item).to.have.class(HOVERED_CLASS)
      })
    })
  })
  describe('double clicking the item', function () {
    beforeEach(function () {
      // Two items, one is selected
      this.setProperties({
        items: generateDummyItems(1, 2),
        selectedItems: generateDummyItems(2, 1),
        titleAttr: 'title',
        subtitleAtrr: 'subtitle',
        valueAttr: 'id'
      })
      this.render(hbs`
        {{frost-buckets
          items=items
          selectedItems=selectedItems
          titleAttr=titleAttr
          subtitleAtrr=subtitleAtrr
          valueAttr=valueAttr
        }}
      `)
    })
    it('selects the item if it is not selected', function () {
      const $item = $hook('nonSelectedItem', {index: 0})
      $item.dblclick()
      return wait().then(() => {
        // both items should be selected
        const $notSelected = $hook('nonSelectedItem')
        expect($notSelected).to.have.length(0)
        const $selected = $hook('selectedItem')
        expect($selected).to.have.length(2)
      })
    })
    it('deselects the item if it is selected', function () {
      const $item = $hook('selectedItem', {index: 0})
      $item.dblclick()
      return wait().then(() => {
        // both items should not be selected
        const $notSelected = $hook('nonSelectedItem')
        expect($notSelected).to.have.length(2)
        const $selected = $hook('selectedItem')
        expect($selected).to.have.length(0)
      })
    })
  })
  describe('', function () {})
  describe('', function () {})
  describe('', function () {})
})
