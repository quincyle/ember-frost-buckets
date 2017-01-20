/* jshint node:true*/
var Reporter = require('ember-test-utils/reporter')

module.exports = {
  'framework': 'mocha',
  'test_page': 'tests/index.html?hidepassed',
  'disable_watching': true,
  'launch_in_ci': [
    'Firefox'
  ],
  'launch_in_dev': [
    'Chrome'
  ],
  parallel: '-1',
  reporter: new Reporter()
}
