/*jshint node:true*/
/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    // Add options here
    babel: {
      optional: ['es7.decorators']
    },
    'ember-cli-mocha': {
      useLintTree: false
    },
    sassOptions: {
      includePaths: [
        'addon/styles'
      ]
    }, codemirror: {
        modes: ['javascript', 'handlebars', 'markdown'],
        // frost-demo-editor defaults to 'mdn-like'
        themes: ['mdn-like']
      },
      'ember-prism': {
        // we use coy for frost demos
        theme: 'coy',
        components: ['javascript']
      }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */
  app.import('bower_components/bucket-duck/dist/bucket-duck.js', {
    exports: {
      'bucket-duck': [
        'default',
        'reducer'
      ]
    }
  })

  return app.toTree();
};
