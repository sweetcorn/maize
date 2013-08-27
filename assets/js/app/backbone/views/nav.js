var Backbone = require('backbone');

var Edition = require('../models/edition.js');
var NavView;



NavView = module.exports = Backbone.View.extend({

  template: function() {
    return JST['nav']();
  }

, initialize: function(options) {
    this.render();
  }

, render: function() {
    var html = this.template(this.model.toJSON());
    this.$el.html(html);

    return this;
  }

})