import {expect} from 'chai'
import {
  setupComponentTest,
  it
} from 'ember-mocha'
import hbs from 'htmlbars-inline-precompile'
import {describe} from 'mocha'
import {integration} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'

const test = integration('frost-buckets')

describe(test.label, function () {
  test.setup()
  it('renders', function () {
    this.render(hbs`
      {{frost-buckets}}
    `)
    expect(this.$('')).to.have.length(1)
  })

})
