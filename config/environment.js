/* eslint-env node */
'use strict'

module.exports = function (/* environment, appConfig */) {
  return {
    'ember-prop-types': {
      spreadProperty: 'options',
      throwErrors: true,
      validate: true
    }
  }
}
