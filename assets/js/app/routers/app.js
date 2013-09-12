var Backbone = require('backbone');

var pageViews = require('../views/pages');
var File = require('../models/file');




module.exports = Backbone.Router.extend({

  routes: {
    '': 'home',
    'files': 'fileIndex',
    'files/:id': 'fileShow'
  }

, home: function() {
    new pageViews.HomeView();
  }

, fileIndex: function() {
    new pageViews.FileIndexView();
  }

, fileShow: function(id) {
    new pageViews.FileShowView({id: id});
  }

});
