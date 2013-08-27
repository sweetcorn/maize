var _ = require('underscore');
var Backbone = require('backbone');

var Containers = require('../collections/containers');
var json = require('../../../json');
var Edition;




Edition = module.exports = Backbone.Model.extend({

  defaults: {
    id: 'cac2b27c-fa00-400d-a644-ba6408b2566d'
  }

, fetch: function() {
    var data = json.editions[this.get('id')];
    var edition = json.editions[this.get('id')].edition;

    this.set(edition);

    var containers = _.map(data.containers, function(container){
      return _.extend(container, {edition: _.pick(edition, 'id', 'title')});
    });

    this.containers = new Containers(containers);

    this.trigger('sync');
  },

})