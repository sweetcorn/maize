var Backbone = require('backbone');



module.exports = Backbone.Model.extend({

  url: function(){
    return '/api/account' + this.id
  }

})