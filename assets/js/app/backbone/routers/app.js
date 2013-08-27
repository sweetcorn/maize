var Backbone = require('backbone');

var Edition = require('../models/edition');
var Container = require('../models/container');
var PageView = require('../views/page');
var AppRouter;




AppRouter = module.exports = Backbone.Router.extend({

  routes: {
    '': 'index',
    'editions/:id': 'edition',
    'editions/:id/containers/:id': 'container'
  }

, renderView: function(editionId, containerId) {
    var edition = (editionId) ? new Edition({id: editionId}) : new Edition();

    edition.on('sync', function() {
      var _edition = edition;
      var container = (containerId) ? edition.containers.findWhere({id: containerId}) : edition.containers.models[0];

      container.on('sync', function(){
        new PageView({el: $('.js-body'), edition: _edition, container: container});
      });

      container.fetch();
    });

    edition.fetch();
  }

, index: function() {
    this.renderView()
  }

, edition: function(editionId) {
    this.renderView(editionId);
  }

, container: function(editionId, containerId) {
    this.renderView(editionId, containerId);
  }

});
