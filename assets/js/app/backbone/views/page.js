var Backbone = require('backbone');

var NavView = require('./nav');
var ContainerView = require('./container');
var PageView;




PageView = module.exports = Backbone.View.extend({

  initialize: function() {
    this.render();

    new NavView({el: $('.js-nav-container'), model: this.model});
    new ContainerView({el: this.$('.js-main'), model: this.model});
  }

});