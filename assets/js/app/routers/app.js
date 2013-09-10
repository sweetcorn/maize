var Backbone = require('backbone');

var PageView = require('../views/page');
var File = require('../models/file');
var AppRouter;




AppRouter = module.exports = Backbone.Router.extend({


  routes: {
    '': 'index',
    'files': 'files',
    'files/:id': 'fileShow'
  }

, index: function() {
    new PageView();
  }

, files: function() {
    new PageView();
  }

, fileShow: function(id) {
    var file = new File({id: id});
    console.log(file);
    new PageView({model: file})
  }

});
