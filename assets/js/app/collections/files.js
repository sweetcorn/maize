var Backbone = require('backbone');

var File = require('../models/file');




module.exports = Backbone.Collection.extend({

  model: File

, url: '/api/files'

})