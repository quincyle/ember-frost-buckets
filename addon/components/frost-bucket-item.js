/**
 * Component definition for the frost-bucket-item component
 */

import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'
import {maybeAction} from './helpers/action-helpers'

import layout from '../templates/components/frost-bucket-item'

function computeProperties (item, titleAttr, subtitleAttr, valueAttr) {
  let title
  if (titleAttr !== undefined && titleAttr !== null) {
    title = item[titleAttr]
  } else if (valueAttr !== undefined && valueAttr !== null) {
    title = item[valueAttr]
  } else {
    title = item
  }

  const subtitle = subtitleAttr === undefined || subtitleAttr === null ?
    '' :
    item[subtitleAttr]

  return {
    title,
    subtitle
  }
}

export default Component.extend({
  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,

  classNames: ['frost-bucket-item'],

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
    this.setProperties(computeProperties(
      this.get('item'),
      this.get('titleAttr'),
      this.get('subtitleAttr'),
      this.get('valueAttr')
    ))
  },

  // == Actions ===============================================================

  actions: {
  }
})
