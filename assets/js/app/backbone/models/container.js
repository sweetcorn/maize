var Backbone = require('backbone');

var data = require('./data.json');
var Container;




Container = module.exports = Backbone.Model.extend({

  fetch: function() {
    this.set(data);
    this.trigger('sync');
  }

});