/**
 * Component definition for the frost-bucket-item component
 */

import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'
import layout from '../templates/components/frost-bucket-item'
import {maybeAction} from './helpers/action-helpers'

function getTitle (item, titleAttr, valueAttr) {
  if (titleAttr !== undefined && titleAttr !== null) {
    return item[titleAttr]
  } else if (valueAttr !== undefined && valueAttr !== null) {
    return item[valueAttr]
  }
  return item
}

function getSubtitle (item, subtitleAttr) {
  return subtitleAttr === undefined || subtitleAttr === null
    ? ''
    : item[subtitleAttr]
}

function getHovered (hovered, index, isSelected) {
  if (hovered === null || hovered === undefined) {
    return false
  }
  return hovered.index === index && hovered.isSelected === isSelected
}

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,

  classNames: ['frost-bucket-item'],

  classNameBindings: ['isHovered:frost-hovered-bucket-item'],

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
    clickItem: PropTypes.func,
    doubleClickItem: PropTypes.func
    // state
  },

  /** @returns {Object} the default property values when not provided by consumer */
  getDefaultProps () {
    return {
      // options

      // state
    }
  },

  // == Computed Properties ===================================================

  // == Functions =============================================================

  // == DOM Events ============================================================
  click () {
    maybeAction(this.get('clickItem'), this.get('index'))
  },

  doubleClick () {
    maybeAction(this.get('doubleClickItem'), this.get('index'))
  },

  // == Lifecycle Hooks =======================================================
  didReceiveAttrs () {
    const item = this.get('item')
    this.setProperties({
      isHovered: getHovered(this.get('hovered'), this.get('index'), this.get('isSelected')),
      title: getTitle(item, this.get('titleAttr'), this.get('valueAttr')),
      subtitle: getSubtitle(item, this.get('subtitleAttr'))
    })
  },

  // == Actions ===============================================================

  actions: {
  }
})
