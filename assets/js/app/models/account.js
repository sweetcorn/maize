var Backbone = require('backbone');



module.exports = Backbone.Model.extend({

  url: function(){
    return '/api/account' + this.id
  }

, initialize: function(options) {
    this.apiUrl = 'https://api.github.com/users/' + user.github.username;
  }

, getFromGithub: function(){
    var _this = this;

    $.get(this.apiUrl, function(resp){
      _this.save(resp);
    })
  }

})