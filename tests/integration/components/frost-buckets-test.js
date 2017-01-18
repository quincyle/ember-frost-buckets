/*globals beforeEach, afterEach*/
import {expect} from 'chai'
import {$hook} from 'ember-hook'
import {
  it
} from 'ember-mocha'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {describe} from 'mocha'
import {integration} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'
import {generateDummyItems} from 'dummy/tests/helpers/reducer-helpers'
import sinon from 'sinon'

const HOVERED_CLASS = 'frost-hovered-bucket-item'

const hooks = {
  toggleButton: 'bucket-toggle-button',
  selectedItem: 'bucket-selectedItem',
  nonSelectedItem: 'bucket-nonSelectedItem',
  hoverNextButton: 'bucket-next-button',
  hoverPreviousButton: 'bucket-prev-button'
}

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
        subtitleAttr: 'subtitle',
        valueAttr: 'id'
      })
      this.render(hbs`
        {{frost-buckets
          items=items
          titleAttr=titleAttr
          subtitleAttr=subtitleAttr
          valueAttr=valueAttr
        }}
      `)
    })
    it('hovers the item', function () {
      const $item = $hook(hooks.nonSelectedItem, {index: 0})
      $item.click()
      return wait().then(() => {
        const $item = $hook(hooks.nonSelectedItem, {index: 0})
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
        subtitleAttr: 'subtitle',
        valueAttr: 'id'
      })
      this.render(hbs`
        {{frost-buckets
          items=items
          selectedItems=selectedItems
          titleAttr=titleAttr
          subtitleAttr=subtitleAttr
          valueAttr=valueAttr
        }}
      `)
    })
    it('selects the item if it is not selected', function () {
      const $item = $hook(hooks.nonSelectedItem, {index: 0})
      $item.dblclick()
      return wait().then(() => {
        // both items should be selected
        const $notSelected = $hook(hooks.nonSelectedItem)
        expect($notSelected).to.have.length(0)
        const $selected = $hook(hooks.selectedItem)
        expect($selected).to.have.length(2)
      })
    })
    it('deselects the item if it is selected', function () {
      const $item = $hook(hooks.selectedItem, {index: 0})
      $item.dblclick()
      return wait().then(() => {
        // both items should not be selected
        const $notSelected = $hook(hooks.nonSelectedItem)
        expect($notSelected).to.have.length(2)
        const $selected = $hook(hooks.selectedItem)
        expect($selected).to.have.length(0)
      })
    })
  })
  describe('toggle button', function () {
    beforeEach(function () {
      // Two items, one is selected
      this.setProperties({
        items: generateDummyItems(1, 2),
        selectedItems: generateDummyItems(2, 1),
        titleAttr: 'title',
        subtitleAttr: 'subtitle',
        valueAttr: 'id'
      })
      this.render(hbs`
        {{frost-buckets
          items=items
          selectedItems=selectedItems
          titleAttr=titleAttr
          subtitleAttr=subtitleAttr
          valueAttr=valueAttr
        }}
      `)
    })
    describe('if no item is hovered', function () {
      it('is disabled', function () {
        expect($hook(hooks.toggleButton)).to.have.class('disabled')
      })
    })
    describe('if the if the hovered item is not selected', function () {
      beforeEach(function () {
        $hook(hooks.nonSelectedItem, {index: 0}).click()
      })
      it('is not disabled', function () {
        expect($hook(hooks.toggleButton)).not.to.have.class('disabled')
      })
      it('shows "add"', function () {
        const buttonText = $hook(hooks.toggleButton).find('.text').text()
        expect(buttonText).to.eql('Add')
      })
      it('adds the item when clicked', function () {
        $hook(hooks.toggleButton).click()
        return wait().then(() => {
          expect($hook(hooks.selectedItem)).to.have.length(2)
          expect($hook(hooks.nonSelectedItem)).to.have.length(0)
        })
      })
    })
    describe('if the hovered item is selected', function () {
      beforeEach(function () {
        $hook(hooks.selectedItem, {index: 0}).click()
      })
      it('shows "remove" ', function () {
        const buttonText = $hook(hooks.toggleButton).find('.text').text()
        expect(buttonText).to.eql('Remove')
      })
      it('removes the item when clicked', function () {
        $hook(hooks.toggleButton).click()
        return wait().then(() => {
          expect($hook(hooks.selectedItem)).to.have.length(0)
          expect($hook(hooks.nonSelectedItem)).to.have.length(2)
        })
      })
    })
  })
  describe('hover next button', function () {
    beforeEach(function () {
      this.setProperties({
        items: generateDummyItems(1, 3),
        titleAttr: 'title',
        subtitleAttr: 'subtitle',
        valueAttr: 'id'
      })
      this.render(hbs`
        {{frost-buckets
          items=items
          selectedItems=selectedItems
          titleAttr=titleAttr
          subtitleAttr=subtitleAttr
          valueAttr=valueAttr
        }}
      `)
    })

    it('is disabled if no item is hovered', function () {
      expect($hook(hooks.hoverNextButton)).to.have.class('disabled')
    })
    it('hovers the next item', function () {
      $hook(hooks.nonSelectedItem, {index: 0}).click()
      return wait().then(() => {
        $hook(hooks.hoverNextButton).click()
        return wait()
      }).then(() => {
        const secondItem = $hook(hooks.nonSelectedItem, {index: 1})
        expect(secondItem).to.have.class(HOVERED_CLASS)
      })
    })
    it('keeps hovering same item if it is the last item', function () {
      $hook(hooks.nonSelectedItem, {index: 2}).click()
      return wait().then(() => {
        $hook(hooks.hoverNextButton).click()
        return wait()
      }).then(() => {
        const lastItem = $hook(hooks.nonSelectedItem, {index: 2})
        expect(lastItem).to.have.class(HOVERED_CLASS)
      })
    })
  })
  describe('hover previous button', function () {
    beforeEach(function () {
      this.setProperties({
        items: generateDummyItems(1, 3),
        titleAttr: 'title',
        subtitleAttr: 'subtitle',
        valueAttr: 'id'
      })
      this.render(hbs`
        {{frost-buckets
          items=items
          selectedItems=selectedItems
          titleAttr=titleAttr
          subtitleAttr=subtitleAttr
          valueAttr=valueAttr
        }}
      `)
    })

    it('is disabled if no item is hovered', function () {
      expect($hook(hooks.hoverPreviousButton)).to.have.class('disabled')
    })
    it('hovers the previous item', function () {
      $hook(hooks.nonSelectedItem, {index: 2}).click()
      return wait().then(() => {
        $hook(hooks.hoverPreviousButton).click()
        return wait()
      }).then(() => {
        const secondItem = $hook(hooks.nonSelectedItem, {index: 1})
        expect(secondItem).to.have.class(HOVERED_CLASS)
      })
    })
    it('keeps hovering same item if it is the first item', function () {
      $hook(hooks.nonSelectedItem, {index: 0}).click()
      return wait().then(() => {
        $hook(hooks.hoverPreviousButton).click()
        return wait()
      }).then(() => {
        const firstItem = $hook(hooks.nonSelectedItem, {index: 0})
        expect(firstItem).to.have.class(HOVERED_CLASS)
      })
    })
  })
  describe('onChange call back', function () {
    let onChange
    beforeEach(function () {
      onChange = sinon.spy()
    })
    afterEach(function () {
      // clear spy between tests
      onChange = null
    })

    it('is called with an array of the selected items when valueAttr is undefined', function () {
      this.setProperties({
        items: generateDummyItems(1, 3),
        titleAttr: 'title',
        subtitleAttr: 'subtitle',
        onChange
      })
      this.render(hbs`
        {{frost-buckets
          items=items
          titleAttr=titleAttr
          subtitleAttr=subtitleAttr
          valueAttr=valueAttr
          onChange=onChange
        }}
      `)
      return wait().then(() => {
        $hook(hooks.nonSelectedItem, {index: 0}).dblclick()
        return wait()
      }).then(() => {
        const firstCall = onChange.getCall(0)
        expect(firstCall.args[0]).to.be.eql([
          {
            id: 'item1',
            title: 'Item 1',
            subtitle: ''
          }
        ])
      })
    })
    it('is called with an array of the keyed values from the items when valueAttr is defined', function () {
      this.setProperties({
        items: generateDummyItems(1, 3),
        selectedItems: [],
        titleAttr: 'title',
        subtitleAttr: 'subtitle',
        valueAttr: 'id',
        onChange
      })
      this.render(hbs`
        {{frost-buckets
          items=items
          selectedItems=selectedItems
          titleAttr=titleAttr
          subtitleAttr=subtitleAttr
          valueAttr=valueAttr
          onChange=onChange
        }}
      `)
      return wait().then(() => {
        $hook(hooks.nonSelectedItem, {index: 0}).click()
        return wait()
      }).then(() => {
        $hook(hooks.toggleButton).click()
        return wait()
      })
      .then(() => {
        const firstCall = onChange.getCall(0)
        expect(firstCall.args[0]).to.be.eql(['item1'])
      })
    })
  })
})
