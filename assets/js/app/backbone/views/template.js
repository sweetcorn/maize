var Backbone = require('backbone');

var BaseView;




BaseView = module.exports = Backbone.View.extend({

  template: function() {
    return JST['pages.' + this.model.get('template').toLowerCase()];
  }

, render: function() {
    var html = this.template()(this.model.toJSON());
    this.$el.html(html);
    this.setElement(this.$('section'))

    return this;
  }

});