var Backbone = require('backbone');

var Containers = require('../collections/containers');
var data = require('../../../json/editions/cac2b27c-fa00-400d-a644-ba6408b2566d/edition.json');
var Edition;




Edition = module.exports = Backbone.Model.extend({

  fetch: function() {
    var data = require('../../../json/editions/' + this.get('id') + '/edition.json');
    this.set(data);

    this.containers = new Containers(data.containers);

    this.trigger('sync');
  },

})