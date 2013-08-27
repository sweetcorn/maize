var Backbone = require('backbone');

var Container;




Container = module.exports = Backbone.Model.extend({

  fetch: function() {
    this.trigger('sync');
  }

});