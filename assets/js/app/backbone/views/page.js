var Backbone = require('backbone');

var globalUi = require('global-ui');
var NavView = require('./nav');
var ContainerView = require('./container');
var PageView;




PageView = module.exports = Backbone.View.extend({

  initialize: function(options) {
    new NavView({el: $('.js-nav-container'), model: options.edition});
    new ContainerView({el: this.$('.js-main'), model: options.container});

    console.log(globalUi);
    globalUi();
  }

});