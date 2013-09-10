var Backbone = require('backbone');
var Base64 = require('Base64');
var Schema = require('./schema');




module.exports = Backbone.Model.extend({

  url: function(){
    return '/api/files/' + this.id;
  }

, initialize: function(options) {
    $.ajaxSetup({
      beforeSend: function(xhr) {
        // xhr.setRequestHeader('Authentication', 'token ' + this.account.administrator.access_token);
      }
    });

    this.on('sync', this.getContents, this);
  }

, getContents: function() {
    var _this = this;

    this.schema = new Schema({}, {file: this, url: this.get('repo').url});

    $.get(this.get('url'), function(resp){
      _this.trigger('github:get', Base64.decode(resp.content));
    })
  }

, saveContents: function(obj) {
    var _this = this;

    var data = {
      message: "foobar"
    , content: Base64.encode(obj)
    , sha: this.get('sha')
    }

    $.ajax({
      url: 'https://api.github.com/repos/createbang/testForMaize/contents/bunnies.json',
      type: 'put',
      beforeSend: function(xhr){
        xhr.setRequestHeader('Authorization', 'token ' + '3d169c37a53d743c925182fb8eb7a10d123db239');
      },
      data: JSON.stringify(data),
      success: function(data, status, xhr) {
        _this.save(data.content, {patch: true});
        _this.trigger('github:put', data);
      },
      error: function(xhr, status, error){
        _this.trigger('github:put:error', error);
      }
    })
  }

});