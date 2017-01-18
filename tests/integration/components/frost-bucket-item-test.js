/**
 * Integration test for the frost-bucket-item component
 */
import {expect} from 'chai'
import {$hook} from 'ember-hook'
import wait from 'ember-test-helpers/wait'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

import {integration} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'

const selectors = {
  title: '.frost-bucket-item-title',
  subtitle: '.frost-bucket-item-subtitle',
  hovered: '.frost-hovered-bucket-item'
}

const test = integration('frost-bucket-item')
describe(test.label, function () {
  test.setup()
  const item = {
    label: 'some random title',
    description: 'Random description of the item',
    id: 'test-id-1'
  }

  let sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
  })

  afterEach(function () {
    sandbox.restore()
  })

  describe('after render', function () {
    beforeEach(function () {
      this.setProperties({
        myHook: 'myThing',
        item,
        index: 0
      })

      this.render(hbs`
        {{frost-bucket-item
          hook=myHook
          item=item
          titleAttr=titleAttr
          subtitleAttr=subtitleAttr
          valueAttr=valueAttr
          clickItem=click
          doubleClickItem=doubleClick
          index=index
        }}
      `)

      return wait()
    })

    it('should have an element', function () {
      expect(this.$()).to.have.length(1)
    })

    it('should be accessible via the hook', function () {
      expect($hook('myThing')).to.have.length(1)
    })

    it('should display a label based on a label attribute', function () {
      this.set('titleAttr', 'label')
      return wait().then(() => {
        expect($hook('myThing').find(selectors.title).text()).to.be.equal(item.label)
      })
    })

    it('displays a subtitle based on a subtitle attribute', function () {
      this.set('subtitleAttr', 'description')
      return wait().then(() => {
        expect($hook('myThing').find(selectors.subtitle).text()).to.be.equal(item.description)
      })
    })

    it('should display the value as the title if no attribute is present', function () {
      this.set('valueAttr', 'id')
      return wait().then(() => {
        expect($hook('myThing').find(selectors.title).text()).to.be.equal(item.id)
      })
    })
  })

  describe('if no attribute specifiers are present', function () {
    const item = 'string item'
    beforeEach(function () {
      this.setProperties({
        myHook: 'myThing',
        item
      })

      this.render(hbs`
        {{frost-bucket-item
          hook=myHook
          item=item
          titleAttr=titleAttr
          subtitleAttr=subtitleAttr
          valueAttr=valueAttr
          clickItem=click
          doubleClickItem=doubleClick
        }}
      `)

      return wait()
    })

    it('title displays the item itself', function () {
      expect($hook('myThing').find(selectors.title).text()).to.be.equal(item)
    })

    it('displays no subtitle', function () {
      expect($hook('myThing').find(selectors.subtitle).text()).to.be.equal('')
    })
  })

  describe('hovered class ', function () {
    const item = 'string item'
    beforeEach(function () {
      this.setProperties({
        myHook: 'myThing',
        item,
        index: 0,
        hovered: {index: 0, isSelected: true}
      })

      this.render(hbs`
        {{frost-bucket-item
          hook=myHook
          item=item
          titleAttr=titleAttr
          subtitleAttr=subtitleAttr
          valueAttr=valueAttr
          clickItem=click
          doubleClickItem=doubleClick
          hovered=hovered
          index=index
          isSelected=true
        }}
      `)

      return wait()
    })

    it('is present if hovered item matches index and isSelected', function () {
      this.set('hovered', {index: 0, isSelected: true})
      return wait().then(() => {
        expect(this.$(selectors.hovered)).to.be.have.length(1)
      })
    })

    it('is not present if hovered item does not match index', function () {
      this.set('hovered', {index: 10, isSelected: true})
      return wait().then(() => {
        expect(this.$(selectors.hovered)).to.be.have.length(0)
      })
    })

    it('is not present if hovered item does not match isSelected', function () {
      this.set('hovered', {index: 0, isSelected: false})
      return wait().then(() => {
        expect(this.$(selectors.hovered)).to.be.have.length(0)
      })
    })
  })

  describe('actions', function () {
    let click
    let doubleClick
    beforeEach(function () {
      click = sandbox.spy()
      doubleClick = sandbox.spy()
      this.setProperties({
        myHook: 'myThing',
        item,
        index: 0,
        click,
        doubleClick
      })

      this.render(hbs`
        {{frost-bucket-item
          hook=myHook
          item=item
          titleAttr=titleAttr
          subtitleAttr=subtitleAttr
          valueAttr=valueAttr
          clickItem=click
          doubleClickItem=doubleClick
          index=index
        }}
      `)

      return wait()
    })

    it('fires click action', function () {
      $hook('myThing').click()
      expect(click.calledWith(0)).to.be.equal(true)
    })

    it('fires double click action', function () {
      $hook('myThing').dblclick()
      expect(doubleClick.calledWith(0)).to.be.equal(true)
    })
  })
})
