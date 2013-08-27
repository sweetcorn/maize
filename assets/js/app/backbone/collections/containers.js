var Backbone = require('backbone');

var Container = require('../models/container');
var Containers;



Containers = module.exports = Backbone.Collection.extend({

  model: Container

})