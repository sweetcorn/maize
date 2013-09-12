var Backbone = require('backbone');
var Base64 = require('Base64');

var Schema = require('./schema');




module.exports = Backbone.Model.extend({


  idAttribute: '_id'

, initialize: function(options) {
    this.apiUrl = 'https://api.github.com/repos/' + user.github.username + '/' + options.repoName + '/contents/' + options.filePath;

    this.on('sync', this.getContents, this);
  }

, getContents: function() {
    var _this = this;

    // this.schema = new Schema({}, {file: this, url: this.get('repo').url});

    $.get(this.apiUrl, function(resp){
      _this.set(_.extend(resp, {content: Base64.decode(resp.content)}));
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
      url: this.apiUrl,
      type: 'put',
      beforeSend: function(xhr){
        xhr.setRequestHeader('Authorization', 'token ' + user.github.accessToken);
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