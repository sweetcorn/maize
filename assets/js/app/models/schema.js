var Backbone = require('backbone');
var _ = require('underscore');




module.exports = Backbone.Model.extend({

  initialize: function(options) {
    this.url = this.url + '/maize.json';
    this.file = options.file;

    $.ajaxSetup({
      beforeSend: function(xhr) {
        // xhr.setRequestHeader('Authentication', 'token ' + this.account.administrator.access_token);
      }
    });

    this.on('github:get:error', this.updateFile, this);
    this.on('github:get:success', this.updateFile, this);

    this.getContents();
  }

, updateFile: function(fileContents) {
    fileContents = fileContents || [];

    // if (fileContents.hasOwnProperty(this.file.get('path')))
  }

, getContents: function() {
    var _this = this;

    $.ajax({
      url: this.url,
      dataType: 'json',
      success: function(data, status, xhr) {
        _this.trigger('github:get:success', Base64.decode(resp.content));
      },
      error: function(xhr, status, error){
        _this.trigger('github:get:error')
      },
    });
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
        console.log(data);
        _this.save(data.content, {patch: true});
        _this.trigger('github:put', data);
      },
      error: function(xhr, status, error){
        _this.trigger('github:put:error', error);
      }
    })
  }

});